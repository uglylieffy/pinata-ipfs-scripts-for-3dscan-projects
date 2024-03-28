<a  name="readme-top"></a>
# Pinata IPFS scripts for automated 3D files upload/pinning

<!-- TABLE OF CONTENTS -->

<details>

<summary>Table of Contents</summary>

- <a  href="#getting-started">Getting Started</a>
	 - <a  href="#prerequisites">Prerequisites</a>
	 - <a  href="#environment-variables">Environment Variables</a></li>
- <a  href="#usage">Usage</a>
- <a  href="#contribution">Contribution</a></li>
-  <a  href="#License">License</a></li>

</details>
  

## :running:Getting Started

  

The scripts contained in this repository were created to help automate the upload and hosting of sample specimen files as .GLB through IPFS protocol . Each script serves a unique purpose and when combined will help upload both sample specimen files and the associated file metadata. A brief description of the scripts is below:

-  `upload-files.js` - uploads the contents of a specified folder and pins each individual file in Pinata

-  `upload-folder.js` - uploads the contents of a specified folder and pins the folder container and its contents

-  `upload-folder-folder.js` - uploads the folders within a specified folder and pins the folder containers

<p  align="right">(<a  href="#readme-top">back to top</a>)</p>
  

### :star:Prerequisites

  

Clone the repository.

  

```bash

git  clone  https://github.com/uglylieffy/pinata-ipfs-scripts-for-3dscan-projects.git

```

  

Change directory to the `pinata-ipfs-scripts-for-3dscan-projects` folder.

  

```bash

cd  pinata-ipfs-scripts-for-3dscan-projects

```

  

Install dependencies.

  

```bash

npm  install

```

  

:star:Note: Some scripts require environment variables to connect with the [Pinata API](https://docs.pinata.cloud/). These environment variables are needed to download pinned files, or to upload files and folders.
<p  align="right">(<a  href="#readme-top">back to top</a>)</p>
  

#### :seedling:Environment Variables

  

`PINATA_API_KEY` - The Pinata API Key environment variable

  

`PINATA_API_SECRET` - The Pinata API Secret environment variable

  

The repo is setup with [dotenv](https://github.com/motdotla/dotenv) and configured to allow using an `.env` file to run the scripts.

  

If the env file does not already exist simply create a new `.env` file at the root of the repository.

  

The contents of the `.env` file should look similar to this:

  

```ini

PINATA_API_KEY="<insert here>"

PINATA_API_SECRET="<insert here>"

```

  

To generate these Pinata API keys you'll need to follow the [Getting Started](https://docs.pinata.cloud/#your-api-keys) Pinata documentation
<p  align="right">(<a  href="#readme-top">back to top</a>)</p>
  
<!-- USAGE EXAMPLES -->

## :open_file_folder:Usage

### :arrow_forward:Upload Files

  

`/src/upload-files.js`

  

The upload files script will iterate the contents of a specified folder and will upload and pin each _individual_ file to Pinata. After a successful upload the file name will be mapped to the IPFS hash CID from the response.

  

Once complete the script will output the file name and CID mappings to a file.

  

#### Settings

  

`var: pinataCIDs` - To prevent re-uploading already pinned files in Pinata. This variable is loaded with the json contents of the `./ouput/downloaded-cids.json` file if one exists. These CID mappings will help prevent re-uploading a file that has already been pinned in Pinata.

  

`var: OUTPUT_PATH` - The relative output file path. Defaulted to `./output/uploaded-cids.json`.

  

`var: FOLDER_PATH` - The relative folder path to read and upload all local files to be pinned with Pinata.

  

`env: PINATA_API_KEY` - The Pinata API Key environment value

  

`env: PINATA_API_SECRET` - The Pinata API Secret environment value

  

#### Command

  

```bash

node  ./src/upload-files.js

```

  

#### Output

  

`./output/uploaded-cids.json`

  

#### Contents

  

```json

{

"some_pic.png": "some_CID",

"some_pic2.png": "some_CID2"

}

```
<p  align="right">(<a  href="#readme-top">back to top</a>)</p>
  

### :arrow_forward:Upload Folder

  

`/src/upload-folder.js`

  

The upload folder script will iterate the contents of a specified folder and will upload and pin each file under a folder container in Pinata. After a successful upload the folder name will be mapped to the IPFS hash CID from the response.

  

Once complete the script will output the folder name and CID mapping to a file.

  

>  **Note** - To support `ipfs/<CID>/<TokenId>` such as `ipfs/QmR5m9zJDSmrLnYMawrySYu3wLgN5afo3yizevAaimjvmD/0` simply name the JSON files with numeric names and strip the file extensions. This will allow the files to be accessed by a numeric file name that can be easily mapped to the `TokenId`.

  

  

#### Settings

  

`var: OUTPUT_PATH` - The relative output file path. Defaulted to `./output/folder-cid.json`.

  

`var: FOLDER_NAME` - The folder name to use for the uploaded folder of json metadata. This can be changed to any name you'd like that identifies the collection of metadata files. Defaulted to `metadata` as the folder name.

  

`var: FOLDER_PATH` - The relative folder path to read and upload all local files to be pinned in Pinata as a folder container for the uploaded files. 

  

`env: PINATA_API_KEY` - The Pinata API Key environment value

  

`env: PINATA_API_SECRET` - The Pinata API Secret environment value

  

#### Command

  

```bash

node  ./src/upload-folder.js

```

  

#### Output

  

`./output/folder-cid.json`

  

#### Contents

  

```json

{

"some_metadata": "some_CID"

}

```

### :arrow_forward:Upload Folders Within Folder

  

`/src/upload-folder-folder.js`

  

The upload folder script will iterate the contents of a specified folder/directory and will upload and pin only the folder containers in Pinata. After a successful upload each of the folder name under that directory will be mapped to the IPFS hash CID from the response.

  

The script will output all folder name and CID mapping to a file ("./output/folder_record.json" by default).

  

>  **Note** - To support `ipfs/<CID>/<TokenId>` such as `ipfs/QmR5m9zJDSmrLnYMawrySYu3wLgN5afo3yizevAaimjvmD/0` simply name the JSON files with numeric names and strip the file extensions. This will allow the files to be accessed by a numeric file name that can be easily mapped to the `TokenId`.

  

  

#### Settings

  

`var: OUTPUT_PATH` - The relative output file path. Defaulted to `./output/folder_record.json`.

  

`var: FOLDER_NAME` - The folder name to use for the uploaded folder of json metadata. This can be changed to any name you'd like that identifies the collection of metadata files.

  

`var: FOLDER_PATH` - The relative folder path to read and upload all local files to be pinned in Pinata as a folder container for the uploaded files.

  

`env: PINATA_API_KEY` - The Pinata API Key environment value

  

`env: PINATA_API_SECRET` - The Pinata API Secret environment value

  

#### Command

  

```bash

node  ./src/upload-folder-folder.js

```

  

#### Output

  

`./output/folder_record.json`

  

#### Contents

  

```bash

{

"test1": "QmR5m9zJDSmrLnYMawrySYu3wLgN5afo3yizevAaimjvmD"

}
```

<p  align="right">(<a  href="#readme-top">back to top</a>)</p>

## :pencil2:Contribution
#### :heavy_exclamation_mark:Disclaimer:heavy_exclamation_mark:
:bell:This repo is a modified version from the **[pinata-ipfs-scripts-for-nft-projects](https://github.com/Coderrob/pinata-ipfs-scripts-for-nft-projects)**'s original repo.:bell:

 :one:. [Coderrob](https://github.com/Coderrob)
 :two:. [dependabot[bot]](https://github.com/apps/dependabot)
 :three:. [lucky7323](https://github.com/lucky7323)
 :four:. [VampishWolf](https://github.com/VampishWolf)
 :five:. [uglylieffy](https://github.com/uglylieffy)

<p  align="right">(<a  href="#readme-top">back to top</a>)</p>