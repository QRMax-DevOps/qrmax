import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import RedCrossImage from '../../graphics/cross.png'
import './InputResponse.css';

class ResponseBad extends React.Component {

 render() {
         return (
             <div>
					<div id="MainBox">
						<div className="text-center" style={{margin:"0", marginTop:"15vh"}}>
							<div id="TopRow">
								<Image src={RedCrossImage} style={{width:"150px", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
							</div>
						</div>
						
						<div style={{marginTop:"20px"}}>
							<div className="text-center" style={{margin:"0", height:"100%"}}>
								<p style={{fontSize:"25px", fontWeight:"bold", color:"#cf0000"}}>
									An error occured
								</p>
								<p style={{fontSize:"20px", fontWeight:"500", color:"#949494"}}>
									Help us fix this issue.
								</p>
								<div style={{marginTop:"10vh"}}>
									<button id="GiveDataButton">Send Diagnostics Data</button>
								</div>
							</div>
						</div>
					</div>
					
					<div className="footer">
						<p style={{textAlign:"center", color:"grey", fontSize:"12px", fontWeight:"500"}}>
							We acknowledge the Traditional Custodians of the Land, and pay respects to their Elders past and present.
						</p>
				</div>
            </div>

         );
     }
 }
 
 export default ResponseBad;