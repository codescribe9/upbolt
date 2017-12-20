 console.log('Running Upbolt');
 
 import {CustomFile} from "./utils/fileUtils"
  
 let url = 'http://localhost:9091/';
 
 if(process.argv.length >= 3) {
	let filePath = process.argv[2];	
	let customFile = new CustomFile(filePath, url);

	customFile
		.setupFile()
		.then(() => customFile.splitFile())
		.then((names) => customFile.uploadFiles(names))
		.then(() => customFile.triggerFileMerge())
		.then((response) => {console.log(response.status,'Upload successfull')})
		.catch((err) => { console.log('Error: ', err)});

 }	
