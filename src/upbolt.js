 /*world.topo.D1.jpg*/

 console.log('Running Upbolt');
 
 //import {stringConcat, squareNumbers} from "./utils/commonUtils"
 import {CustomFile} from "./utils/fileUtils"
  
 //console.log("data/d1.jpg");
 let url = 'http://localhost:9091/';
 let customFile = new CustomFile("data/b1.bmp", url);
 //let customFile = new CustomFile("data/d1.jpg", url);
 

 customFile
 	 .setupFile()
	 .then(() => customFile.splitFile())
	 .then((names) => customFile.uploadFiles(names))
	 .then(() => customFile.triggerFileMerge())
	 .then((response) => {console.log(response.status,'Upload successfull')})
	 .catch((err) => { console.log('Error: ', err)});

	

 //console.log(new stringConcat("123", "ABC").concat());
 //console.log(new squareNumbers(12).square());
 