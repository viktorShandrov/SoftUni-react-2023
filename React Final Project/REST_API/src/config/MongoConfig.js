const mongoose = require('mongoose');
const {Dropbox} = require("dropbox");
const fetch = require("isomorphic-fetch");
const fs = require("fs");
const AdmZip = require("adm-zip");
const path = require("path");

exports.mongodbConfig=()=>{
    mongoose.connect('mongodb://localhost:27017/language-trough-literature', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    backupDB()
    setInterval(backupDB,1000 * 60 *10)
}


async function backupDB(){
    const filePath = "P:\\Folder-Deliivanova\\SoftUni\\Repository\\React\\MongoDbBackUp\\backup.zip"
    const dbx = new Dropbox({
        accessToken: "sl.BqekwUOOEws6SRyFdu91_ITDndW6EHlSIWXzo1GWYq5YhOi3aTjgQ-yzVyjwYj0dN0VQCwkT4ZvwrleGxLl7SxtGkaJuA9S9WA7SiT0pPTnp27-HXi5oTRMZ20NqVG1SEdc0IZzD2QJp",
        fetch
    });

// Define an asynchronous function to list all files in a given Dropbox path
    async function getAllFiles(path){
        try {
            // Request a list of files from Dropbox
            const files = await dbx.filesListFolder({path});
            // Return the list of file entries
            return files.result.entries;
        } catch (error) {
            // Log any errors that occur
            console.error('Error:', error);
        }
    }

// Define an asynchronous function to upload a file to Dropbox
    async function uploadFile(file, path){
        try {

            const fileExists = await fileExistsAtPath(path);

            if (fileExists) {
                await deleteFileAtPath(path);
            }
            const fileContent = fs.readFileSync(file);


            if (fileContent) {
                const fileuploaded = await dbx.filesUpload({path, contents: fileContent});
                return fileuploaded;
            } else {
                return false;
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    async function downloadFile(fileToDownload, path){
        try {
            // Request to download the file from Dropbox
            const fileDownloaded = await dbx.filesDownload({path: fileToDownload});
            // Write the downloaded file to the local file system at the given path
            const fileDownloadedIntoServer = fs.writeFileSync(path, fileDownloaded.result.fileBinary, 'binary');
            // Return the result of the write operation
            return fileDownloadedIntoServer;
        } catch (error) {
            // Log any errors that occur
            console.error('Error:', error);
        }
    }

    async function fileExistsAtPath(path) {
        try {
            const fileMetadata = await dbx.filesGetMetadata({ path });
            return !!fileMetadata;
        } catch (error) {
            // If the file doesn't exist, Dropbox API will return a 409 error
            if (error.status === 409) {
                return false;
            } else {
                // Log any other errors
                console.error('Error checking file existence:', error);
                throw error;
            }
        }
    }

    async function deleteFileAtPath(path) {
        try {
            await dbx.filesDeleteV2({ path });
        } catch (error) {
            // Log any errors that occur during file deletion
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    async function zipFolder(){
        const folderToZip = 'P:\\Folder-Deliivanova\\SoftUni\\Repository\\React\\MongoDbBackUp\\language-trough-literature';
        const zipFileName = 'P:\\Folder-Deliivanova\\SoftUni\\Repository\\React\\MongoDbBackUp\\backup.zip';

        const zip = new AdmZip();

        const files = fs.readdirSync(folderToZip);
        for (const file of files) {
            const filePath = path.join(folderToZip, file);
            zip.addLocalFile(filePath);
        }
        zip.writeZip(zipFileName);

    }

    await(async () => {
        await zipFolder()
        const fileUploaded = await uploadFile(filePath, "/backup.zip");
    })();
}
