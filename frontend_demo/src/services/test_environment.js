import React from "react";
import {HandleDisplay} from './qr_middleware';
import {HandleMedia} from './media_middleware';
import GreenTickImage from '../graphics/tick.png';
import {imageUploaded} from './base64_utilities';
import {ListenTo} from './listener_middleware';

var param = {url:"stuffhere",live:true};

class TestEnv extends React.Component {
	constructor(props) {
		super(props);
		console.log("param == ", param)
	}
	
	
	
	render() {
		var image = document.createElement("img");
		image.src = GreenTickImage;
		
		
		//Basically enums. You don't have to use enums, they just look pretty.
		const GETLIST = Symbol("GETLIST")
		const CREATE = Symbol("CREATE")
		const MODIFY = Symbol("MODIFY")
		const DELETE = Symbol("DELETE")
		const GETMEDIAFILE = Symbol("GETMEDIAFILE");
		
		//To go in "data"
		var storex = "store1";
		var companyx = "testCompany";
		var displayx = "display1";
		var mediaNamex = "marcusCat";
		var mediaFilex = "96f47459926746b4b3a6";
		
		var data = {company:companyx, store:storex, display:displayx, mediaName:mediaNamex, mediaFile:mediaFilex };
		var url = "http://localhost:80/"
		
		//Where our response data is held!
		var global = new Array(2);
		
		//You don't have to use enums.
		var test = HandleMedia(DELETE,url,data,global);
		
		
         return(
			<div style={{padding:"40px"}}>
			
				<h1 style={{textAlign:"Left"}}>Middleware Test Environment</h1>
				<hr/>
				<p>Refer to the console.</p>
				<input id="upload" ref="upload" type="file" accept="image/*"
					onChange={(event)=> { 
						imageUploaded();
					}}
				/>
				<button onClick={()=> { param.live = false; }}> Stop subscription </button>
			</div>
		);
    }
}
 
 export default TestEnv;
 
 