/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React from "react";

/* This is more of an example function, I wouldn't suggest trying to use it.
 * It's more for debug and testing purposes.
 * You should write something similar and use it in your code.
 * You can implement this function in HTML like:
 * ...
 * <input id="upload" ref="upload" type="file" accept="image/*"
 *		onChange={(event)=> { 
 *			imageUploaded();
 *		}}
 *	/>
 * ...
 */
export function imageUploaded() {
    var file = document.querySelector(
        'input[type=file]')['files'][0];
  
    var reader = new FileReader();
      
    reader.onload = function () {
		//Get encoded base-64 image data
		var base64String = ImageToBase64(reader.result);
		console.log(file.name,"should be encoded.");
		
		//Do whatever you want with the string here.
		
		//DEBUG STUFF: Proof of successful back-and-forth.
		//Decode base-64 data and display image
		var image = base64ToImage(base64String);
		document.body.appendChild(image);
		
		//This is an asynchronous fuction. If you try to use the return value
		//immediately after calling, it may be "undefined"
		return {image:reader.result,encoded:base64String};
    }
	
	if(file) {
		reader.readAsDataURL(file);
	}
}

// Data variable should be reader.result
// As demonstrated in "imageUploaded()".
// I.e., var base64string = ImageToBase64(reader.result)
export function ImageToBase64(data) {
	try {
		var isImage = isFileImage(data);
		if(isImage) {
			var encodedData = data.replace("data:", "")
				.replace(/^.+,/, "");
		} else {
			alert("Is not an image! Will not convert!");
		}
	return encodedData;
	} catch(e) {
		console.log(e);
	}
}

// Is the given file an image?
// Expects an Element object.
// E.g., document.querySelector('input[type=file]')['files'][0];
export function isFileImage(file) {
	var f = file.replace("data:", "");
	return f && f.split('/')[0] === 'image';
}

//Self-explanatory.
export function base64ToImage(base64String) {
	try {
		//Checking is valid base64.
		window.atob(base64String);
		
		//Decoding and returning image.
		var image = new Image();
		image.src = 'data:image/png;base64,'+base64String;
		return image;
	} catch(e) {
		console.log(e);
		// if base 64 was invalid, check for 'e.code === 5'.
	}
}