import FileHandler from 'split-file'
import fs from 'fs';
import path from 'path';
import axios from 'axios'
import FormData from 'form-data'
import uuidv1 from 'uuid/v4'
import del from 'del'

export class CustomFile {

	constructor(fp, url, chunkSize = 1048576){

		if (typeof fp !== 'string') {
			throw new TypeError(`Expected a string for fp, got ${typeof fp}`);
		}

		if (typeof url !== 'string') {
			throw new TypeError(`Expected a string for url, got ${typeof url}`);
		}

		if(!fs.existsSync(fp)){
			throw new Error(`Invalid input, no file found at ${fp}`);
		}

		let dirPath = path.dirname(fp);
		let fileExtn = path.extname(fp);
		let fileName = path.basename(fp);
		let fileNameSansExtn = path.basename(fp, fileExtn);

		this.fileInfo = {filePath: fp, dirPath: dirPath, fileName: fileName, fileExtn: fileExtn, fileNameSansExtn: fileNameSansExtn };
		this.serverUrl = url;
		this.chunkSize = chunkSize; //1048576
		console.log(this.fileInfo);
	}

	triggerFileMerge(){
		let splitFilesFolderPath = path.dirname(this.guidFilePath);		
		del([splitFilesFolderPath]).then(paths => {
			console.log('Deleted temp files and folders:\n', paths.join('\n'));
		});

		return axios.post(this.serverUrl + 'merge', {fileName: this.fileInfo.fileName, guid: this.guid});
	}

	setupFile(){	
		

		this.guid = uuidv1();
	
		let dirPath = this.fileInfo.dirPath + '/' + this.guid;  	
  		if(!fs.existsSync(dirPath))
			  fs.mkdirSync(dirPath);
		
		this.guidFilePath =  path.join(dirPath, this.guid + this.fileInfo.fileExtn);
		console.log('guidFilePath', this.guidFilePath);
			  
		return this.copyFile();

	}

	copyFile() {		
		return new Promise((resolve, reject) => {
			
			fs.copyFileSync(this.fileInfo.filePath, this.guidFilePath, (err) => {
			    if ( err ) {
			    	console.log('ERROR: ' + err);
			    	return reject(err);
			    }
			});

			console.log(`${this.fileInfo.filePath} copied to ${this.guidFilePath}`);
			resolve(this.guidFilePath);
		}) 
	}

	splitFile(){		
		console.log("Splitting files");
		return FileHandler.splitFileBySize(this.guidFilePath, this.chunkSize);				
	}

	

	uploadFiles(filePaths) {
		
		console.log(`Uploading files count: ${filePaths.length}`);
		
		return Promise.all(
			filePaths.map((filePath) => {	
				return this.uploadFile(this.serverUrl, filePath);
			})
		);

	}

	readFile(filePath) {
		return new Promise((resolve, reject) => {
			  fs.readFile(filePath, (err, data) => {
			    if ( err ) {
			    	console.log('ERROR: ' + err);
			    	reject(err);
			    }
			    else {
			    	resolve(data);
				}
			});
		});

	}
	
	uploadFile(url, filePath, name='file') {
		console.log(`Uploading file: ${filePath}` );

		this.readFile(filePath)
		.then((data) => {
			const formData = new FormData();
			
			let fileName = path.basename(filePath);	    	
	    	formData.append(name, data, fileName);
	    	const config = {
		        headers: {
		            'content-type': `multipart/form-data; boundary=${formData._boundary}`

		        }
		    }
		    
		    return  axios.post(url + 'up', formData, config)
		})	    
	}




}