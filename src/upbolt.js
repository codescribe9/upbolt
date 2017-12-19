 /*world.topo.D1.jpg*/

 console.log('Running Upbolt');
 
 //import {stringConcat, squareNumbers} from "./utils/commonUtils"
 import {CustomFile} from "./utils/fileUtils"
 import uuidv1 from 'uuid/v4'
 
 //console.log("data/d1.jpg");
 let url = 'http://localhost:9091/';
 let customFile = new CustomFile("data/b1.bmp", url);
 //let customFile = new CustomFile("data/d1.jpg", url);
 let guid = uuidv1();



 customFile
	 .renameFile(guid)
	 .then((newFilePath) => customFile.splitFile(newFilePath))
	 .then((names) => customFile.uploadFiles(names))
	 .then(() => customFile.triggerFileMerge(guid))
	 .then(() => {console.log('Upload successfull')})
	 .catch((err) => { console.log('Error: ', err)});

	

 //console.log(new stringConcat("123", "ABC").concat());
 //console.log(new squareNumbers(12).square());
 