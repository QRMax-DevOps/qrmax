import React from "react";

class Home extends React.Component {
	render() {
         return(
			<div style={{padding:"40px"}}>
				<h1 style={{textAlign:"Left"}}>GUI Debug/Demo</h1>
				<hr/>
				<p>Please append either <b>"/login", "/response_good"</b> or <b>"/response_bad"</b> to the url. <br/></p>
				E.g :
				<ul>
				  <li>http://localhost:3000<b>/login</b></li>
				  <li>http://localhost:3000<b>/response_good</b></li>
				  <li>http://localhost:3000<b>/response_bad</b></li>
				</ul>
			</div>
		);
    }
}
 
 export default Home;