import React, { useState, useEffect, useRef } from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import GreenTickImage from '../graphics/tick.png'
import Button from "./Custom_Button.js";
import './test.css';

class ResponseGood extends React.Component {
	
 render() {
		return (
			 <div>
				<Container id="MainBox_Out" style={{margin: 0, position: "absolute", height:"100%", width:"70%", top: "50%", left: "50%", transform: "translate(-50%, -50%)",  minWidth:"500px", minHeight:"775px"}}>
					<Col id="MainBox_In" className="text-center d-flex flex-column justify-content-between" style={{height:"100%", padding:"10px"}}>
					
						<Row id="Top" className="text-center" style={{alignItems:'flex-start', margin:"0"}}>
							<div id="TopRow" style={{marginTop:"50px"}}>
								<Image src={GreenTickImage} style={{width:"250px", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
								<br/>
							</div>
							<p style={{margin:"0", fontSize:"30px", fontWeight:"bold", color:"green"}}>Your input has<br/>been received!</p>
						</Row>
						
						<Row id="Middle" style={{alignItems:'center'}}>
							<div className="text-center">
								<p style={{fontSize:"20px", fontWeight:"500", color:"gray"}}>
									Your opinion is valuable<br/>
									and will help us improve<br/>
									this service.
								</p>
								
								<br/>
								<Button id="FeedbackButton" style={{height:"70px", width:"250px"}}>Give Feedback</Button>
							</div>
						</Row>
						
						<Row id="Bottom" style={{alignItems:'flex-end'}}>
							<div className="text-center" style={{marginTop:"0", width:"500px", margin:"auto"}}>
								<p style={{color:"grey", fontWeight:"500", fontSize:"15px"}}>
									We acknowledge the Traditional Custodians of the Land, and pay respects to their Elders past and present.
								</p>
							</div>
						</Row>
						
					</Col>
				</Container>
			 </div>
		 );
     }
 }
 
 export default ResponseGood;