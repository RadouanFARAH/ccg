module.exports = async (options) => {
    return new Promise((resolve,reject)=>{
        const fs = require("fs")
        let Client = require('ssh2-sftp-client');

        class SFTPClient {
            constructor() {
                this.client = new Client();
            }
    
            async connect(options) {
                try {
                    await this.client.connect(options);
                } catch (err) {
                    console.log('Failed to connect:', err);
                }
            }
    
            async disconnect() {
                await this.client.end();
            }
    
            async listFiles(remoteDir, fileGlob) {
                console.log(`Listing ${remoteDir} ...`);
                let fileObjects;
                try {
                    fileObjects = await this.client.list(remoteDir, fileGlob);
                } catch (err) {
                    console.log('Listing failed:', err);
                }
    
                const fileNames = [];
    
                for (const file of fileObjects) {
                    if (file.type === 'd') {
                        console.log(`${new Date(file.modifyTime).toISOString()} PRE ${file.name}`);
                    } else {
                        console.log(`${new Date(file.modifyTime).toISOString()} ${file.size} ${file.name}`);
                    }
    
                    fileNames.push(file.name);
                }
    
                return fileNames;
            }
    
            async uploadFile(localFile, remoteFile, res) {
                console.log(`Uploading ${localFile} to ${remoteFile} ...`);
                try {
                    await this.client.put(localFile, remoteFile);
                    fs.unlink(options.sourcePath, (err) => {
                        if (err) {
                          throw err;
                        }else{
                            console.log(`Deleted ${options.sourcePath}`);
                        }
                      });
                } catch (err) {
                    console.error('Uploading failed:', err);
                }
            }
    
            async downloadFile(remoteFile, localFile) {
                console.log(`Downloading ${remoteFile} to ${localFile} ...`);
                try {
                    await this.client.get(remoteFile, localFile);
                } catch (err) {
                    console.error('Downloading failed:', err);
                }
            }
    
            async deleteFile(remoteFile) {
                console.log(`Deleting ${remoteFile}`);
                try {
                    await this.client.delete(remoteFile);
                } catch (err) {
                    console.error('Deleting failed:', err);
                }
            }
        }
    
        (async () => {
            const host = options.host;
            const port = 22;
            const username = options.username;
            const password = options.password;
    
            //* Open the connection
            const client = new SFTPClient();
            await client.connect({ host, port, username, password });
    
            //* List working directory files
            // await client.listFiles(".");
    
            //* Upload local file to remote file
    
            await client.uploadFile(options.sourcePath, options.destinationPath);
    
            //* Download remote file to local file
            // await client.downloadFile("./remote.txt", "./download.txt");
    
            //* Delete remote file
            // await client.deleteFile("./remote.txt");
    
            //* Close the connection
            await client.disconnect();
        })();

        resolve(true)
    })

}

