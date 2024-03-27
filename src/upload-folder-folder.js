//jshint esversion:8
//jshint node:true
const fs = require( 'fs' );
const path = require( 'path' );
const { post } = require('axios');
const { createReadStream, outputJsonSync } = require('fs-extra');
const { read } = require('recursive-fs');
const FormData = require('form-data');
const basePathConverter = require('base-path-converter');


require('dotenv').config();

const { PINATA_API_KEY, PINATA_API_SECRET } = process.env;

const { log, error } = console;

const PINATA_API_PINFILETOIPFS = 'https://api.pinata.cloud/pinning/pinFileToIPFS';


(async () => {
  try {
    // Edit Directory Here <<<<
    const DIRECTORY = "D:/ResCast/IPFS_Converter/test/bundle";
    const OUTPUT_PATH = './output/folder_record.json'; // Output path/file_name containing the metadata


    // Get the directory path as an array
    const dir_path = await fs.promises.readdir( DIRECTORY );

    // Loop them all with the new for...of
    for( const folder of dir_path ) {
      // Get the full paths, aka Folder to be uploaded
      const folderPath = path.join( DIRECTORY, folder );
      const FOLDER_PATH = folderPath.replace(/\\/g, '/');
      // Display name of folder in Pinata
      const FOLDER_NAME = folderPath.split('\\').pop(); 


      // Pinata Upload... 
      const { files } = await read(FOLDER_PATH);
      if ((files && files.length) <= 0) {
        log(`No files were found in folder '${FOLDER_PATH}'`);
        return;
      }
      log(`'${FOLDER_PATH}' upload started`);
      const formData = new FormData();
      files.forEach((filePath) => {
        log(`Adding file: ${filePath}`);
        formData.append('file', createReadStream(filePath), {
          filepath: basePathConverter(FOLDER_PATH, filePath),
        });
      });
      formData.append(
        'pinataMetadata',
        JSON.stringify({
          name: FOLDER_NAME,
        }),
      );
      const {
        data: { IpfsHash: cid },
      } = await post(PINATA_API_PINFILETOIPFS, formData, {
        maxBodyLength: 'Infinity',
        headers: {
          // eslint-disable-next-line no-underscore-dangle
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      });
      log(`'${FOLDER_PATH}' upload complete; CID: ${cid}`);

      // Read the contents of the JSON file
      const data = fs.readFileSync(OUTPUT_PATH);
      // Parse the JSON data into a JavaScript object
      const jsonData = JSON.parse(data);
      // Modify the JavaScript object by adding new data
      jsonData[FOLDER_NAME] = cid;
      // Convert the JavaScript object back into a JSON string
      const jsonString = JSON.stringify(jsonData);
      fs.writeFileSync(OUTPUT_PATH, jsonString, 'utf-8', (err) => {
        if (err) throw err;
        console.log('Data added to file');
      });


    } // End for...of

  } catch (err) {
    error(err);
    process.exit(1);
  }
})();
