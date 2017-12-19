import FileHandler from 'split-file'
import fs from 'fs';
import path from 'path';
import axios from 'axios'
import FormData from 'form-data'

export class CustomFile {

	constructor(fp, url){
		this.filePath = fp;
		this.url = url;
	}

	triggerFileMerge(guid){
		return axios.post(this.url + 'merge', {fileName: path.basename(this.filePath), guid: guid})
	}

	splitFile(newFilePath){
		this.newFilePath = newFilePath;
		return FileHandler.splitFileBySize(this.newFilePath, 1048576);				
	}

	renameFile(newName){			

		
		return new Promise((resolve, reject) => {
			let fileExtn = path.extname(this.filePath);
			let fileName = path.basename(this.filePath, fileExtn);
			//let newPath =  path.join(path.dirname(this.filePath), newName + fileExtn);
			let newPath =  path.dirname(this.filePath) + '/' + newName + fileExtn;

			fs.rename(this.filePath, newPath, (err) => {
			    if ( err ) {
			    	console.log('ERROR: ' + err);
			    	reject(err);
			    }
			    else {
			    	console.log(this.filePath + " renamed to " + newPath);
			    	resolve(newPath);
				}
			});
		}) 
	}

	uploadFiles(filePaths) {
		
		console.log('Uploading files count:' + filePaths.length);
		console.log('URL: ' + this.url);
		return Promise.all(
			filePaths.map((filePath) => {	
				return this.uploadFile(this.url, filePath);
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
		if (typeof url !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof url}`);
		}
		console.log('Uploading file: ' + filePath);

		this.readFile(filePath)
		.then((data) => {
			const formData = new FormData();
			let fileName = path.basename(filePath);
			console.log('fileName: ' + fileName);
	    	formData.append(name, data, fileName)
	    	const config = {
		        headers: {
		            'content-type': `multipart/form-data; boundary=${formData._boundary}`

		        }
		    }

		    //console.log(formData, config);
		    return  axios.post(url + 'up', formData, config)
		})	    
	}


}