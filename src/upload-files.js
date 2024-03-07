require('dotenv').config();

const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;
const fs = require('fs-extra');
const recursive = require('recursive-fs');
const Bottleneck = require('bottleneck');
const pinataSDK = require('@pinata/sdk');
const { getFileName } = require('./utils');

const { log, error } = console;

(async () => {
  /**
   * Load any existing file CID mappings to avoid attempting to upload
   * a file that may have already been uploaded and the CID is known.
   */
  const pinataCIDs = fs.readJsonSync('./output/downloaded-cids.json') || {};
  const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

  /**
   * Set rate limiting close to the maximum of 180 requests / minute.
   * These values can be modified to fit your needs while staying
   * within the rate limit range to avoid HTTP 429 errors.
   *
   * Pinata Rate Limit: https://docs.pinata.cloud/rate-limits
   */
  const rateLimiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 3000, // Once every 3 seconds
  });

  /**
   * Checks whether the provided file name has already been mapped
   * with a CID. If so, it does not need to be uploaded again.
   *
   * @param {string} fileName <<< the file name to check for existing CIDs
   * @return {bool} returns true if the file has already been mapped; otherwise false
   */
  const cidExists = (fileName) => ({
    exists: !!pinataCIDs[fileName],
    ipfsHash: pinataCIDs[fileName],
  });

  /**
   * Upload a file's data to Pinata and provide a metadata name for the file.
   * This fileName can be either the name of the file being uploaded, or any
   * name sufficent enough to identify the contents.
   *
   * @param {string} fileName the file name to use for the uploaded data
   * @param {string} filePath the path to the file to upload and pin to Pinata
   * @return {string} returns the IPFS hash (CID) for the uploaded file
   */
  const uploadFile = async (fileName, filePath) => {
    log(`'${fileName}' upload started`);
    const { IpfsHash } = await pinata.pinFileToIPFS(
      fs.createReadStream(filePath),
      {
        pinataMetadata: {
          name: fileName,
        },
        pinataOptions: {
          cidVersion: 0,
        },
      },
    );
    log(`'${fileName}' upload complete; CID: ${IpfsHash}`);
    return IpfsHash;
  };

  try {
    const OUTPUT_PATH = './output/uploaded-cids.json'; // <<< default path and file name
    const FOLDER_PATH = '<insert path>'; // Folder containing files to upload
    const cidMapping = {};
    const { files } = await recursive.read(FOLDER_PATH);
    if ((files && files.length) <= 0) {
      log(`No files were found in folder '${FOLDER_PATH}'`);
      return;
    }
    await Promise.all(
      files.map(async (filePath) => {
        const fileName = getFileName(filePath);
        const { exists, ipfsHash } = cidExists(fileName);
        if (exists) {
          log(`File '${fileName}' already exists; CID: ${ipfsHash}`);
          cidMapping[fileName] = ipfsHash;
        } else {
          cidMapping[fileName] = await rateLimiter.schedule(() => uploadFile(fileName, filePath));
        }
      }),
    );
    fs.outputJsonSync(OUTPUT_PATH, cidMapping);
  } catch (err) {
    error(err);
    process.exit(1);
  }
})();
