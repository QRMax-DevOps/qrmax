/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import GreenTickImage from '../../graphics/tick.png'
import './InputResponse.css';

class ResponseGood extends React.Component {
 render() {
         return (
             <div>
				<div id="MainBox">
					<div style={{margin:"0", marginTop:"15vh"}}>
						<div id="TopRow">
							<Image src={GreenTickImage} style={{width:"150px", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
						</div>
						<p style={{marginTop:"10px", fontSize:"25px", fontWeight:"bold", color:"rgb(0,153,0)"}}>
								Your input has<br/>
								been received
						</p>
					</div>
					
					<div style={{marginTop:"20px"}}>
						<div className="text-center" style={{margin:"0", height:"100%"}}>
							
							<p style={{fontSize:"20px", fontWeight:"500", color:"#949494"}}>
								Your opinion really is<br/> valuable and helps us<br/>improve our service.
								
							</p>
							<div style={{marginTop:"5vh"}}>
								<button id="GiveFeedbackButton">Give Feedback</button>
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
 
 export default ResponseGood;