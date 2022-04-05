import React from "react";
import {HandleDisplay} from './middleware/qr_mw';
import {HandleMedia} from './middleware/media_mw';
import GreenTickImage from '../graphics/tick.png';
import {imageUploaded} from './utilities/base64_util';

import {getSettings} from './middleware/settings_mw';

var param = {url:"stuffhere",live:true};

//target, type, url, data, global

class TestEnv extends React.Component {
	constructor(props) {
		super(props);
		//console.log("param == ", param)
	}
	
	
	
	render() {
		var image = document.createElement("img");
		image.src = GreenTickImage;
		
		
		//Basically enums. You don't have to use enums, they just look pretty.
		const COMPANYACCOUNT = Symbol("invalidtarget")
		
		const GETLIST = Symbol("GETLIST")
		const MODIFY = Symbol("MODIFY")
		//const CREATE = Symbol("CREATE")
		//const DELETE = Symbol("DELETE")
		//const GETMEDIAFILE = Symbol("GETMEDIAFILE");
		
		//To go in "data"
		var storex = "store1";
		var companyx = "testCompany";
		var displayx = "display1";
		var fieldsx = ["setting1","setting2"];
		var valuesx = ["updatedValue1","updatedValue2"];
		//value1_updatedbymarcus
		var data = {company:companyx, store:storex, display:displayx, fields:fieldsx, values:valuesx };
		var url = "http://localhost:80/";
		
		//Where our response data is held!
		var global = new Array(2);
		
		//You don't have to use enums.
		var test = getSettings(COMPANYACCOUNT, GETLIST, url, data, global);
		
		
         return(
			<div style={{padding:"40px"}}>
			
				<h1 style={{textAlign:"Left"}}>Middleware Test Environment</h1>
				<hr/>
				<p>Refer to the console.</p>
			</div>
		);
    }
}
 
 export default TestEnv;
 
 /*
 
 				<input id="upload" ref="upload" type="file" accept="image/*"
					onChange={(event)=> { 
						imageUploaded();
					}}
				/>
				<button onClick={()=> { param.live = false; }}> Stop subscription </button>
 */