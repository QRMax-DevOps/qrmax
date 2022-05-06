/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import RedCrossImage from '../../graphics/cross.png'
import './InputResponse.css';

class ResponseBad extends React.Component {
 render() {
         return (
             <div>
				<div id="MainBox">
					<div style={{margin:"0", marginTop:"15vh"}}>
						<div id="TopRow">
							<Image src={RedCrossImage} style={{width:"150px", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
						</div>
					</div>
					
					<div style={{margin:"40px", marginTop:"20px"}}>
						<div className="text-center" style={{margin:"0", height:"100%"}}>
							<p style={{lineHeight:"50px", fontSize:"50px", fontWeight:"bold", color:"#cf0000"}}> Oops! </p>
							<p style={{fontWeight:"bold", fontSize:"20px", color:"#cf0000"}}> Looks like an error has occured.</p>
							<p style={{marginTop:"5vh", fontSize:"20px", color:"#949494"}}> If you send us some diagnostics<br/>information, you'll be saving us<br/>quite the headache.</p>
							<div style={{marginTop:"5vh"}}>
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