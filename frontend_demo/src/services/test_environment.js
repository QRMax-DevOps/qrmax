import React from "react";
import {HandleDisplay} from './qr_middleware'

class TestEnv extends React.Component {
	render() {
		
		//Basically enums. You don't have to use enums, they just look pretty.
		const GETLIST = Symbol("GETLIST")
		const CREATE = Symbol("CREATE")
		const DELETE = Symbol("DELETE")
		
		//To go in "data"
		var storex = "store1";
		var companyx = "testCompany";
		var displayx = "testDisplayFromMarcus";
		
		var data = {company:companyx, store:storex, display:displayx};
		var url = "http://localhost:80/"
		
		//Where our response data is held!
		var global = new Array(2);
		
		//You don't have to use enums.
		var test = HandleDisplay(DELETE,url,data,global);
		
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