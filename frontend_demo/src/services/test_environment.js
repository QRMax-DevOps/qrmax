import React from "react";
import {handleDisplay} from './middleware/display_mw';

var param = {url:"stuffhere",live:true};

//target, type, url, data, global

class TestEnv extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		//Basically enums. You don't have to use enums, they just look pretty.
		const COMPANYACCOUNT = Symbol("invalidtarget")
		
		const GETLIST = Symbol("GETLIST")
		const MODIFY = Symbol("MODIFY")
		const CREATE = Symbol("CREATE")
		const DELETE = Symbol("DELETE")
		
		//To go in "data"
		var storex = "displayStore";
		var companyx = "displayCompany";
		var displayx = "display3";
		
		var mediax = "media1";
		var mediaName = "media1";
		// var mediaFile = "marcusWasHereLol"
		
		var QRID = "3bbdf09d29fb456894bf"
		
		var fieldsx = ["setting1","setting2"];
		var valuesx = ["updatedValue1","updatedValue2"];
		//value1_updatedbymarcus
		var data = {company:companyx, store:storex, display:displayx, mediaName:mediaName, mediaFile:'testData', fields:fieldsx, values:valuesx };
		var url = "https://api.qrmax.app/";
		
		//Where our response data is held!
		var global = new Array(2);
		
		
		var test = handleDisplay('display/media', 'PATCH', url, data, global);

	
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
