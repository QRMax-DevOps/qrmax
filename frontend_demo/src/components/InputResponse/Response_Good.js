import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import GreenTickImage from '../../graphics/tick.png'
import Button from "../Custom_Button.js";

class ResponseGood extends React.Component {
	
 render() {
         return (
             <div>
				<div style={{height:"95vh", width:"100vw", margin:"auto"}}>
					<div id="MainBox_In" className="text-center d-flex flex-column" style={{justifyContent:"space-between", alignContent:"center", height:"100%",width:"100%"}}>
					
						<div id="Top" className="text-center" style={{margin:"0", marginTop:"20px"}}>
							<div id="TopRow" style={{marginTop:"50px"}}>
								<Image src={GreenTickImage} style={{width:"30%", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
								<br/>
							</div>
							<p style={{margin:"0", fontSize:"30px", fontWeight:"bold", color:"green"}}>Your input has<br/>been received!</p>
						</div>
						
						<div id="Middle">
							<div className="text-center" style={{margin:"0", height:"100%"}}>
								<p style={{fontSize:"20px", fontWeight:"500", color:"gray"}}>
									Your opinion is valuable<br/>
									and will help us improve<br/>
									this service.
								</p>
								<br/>
								<Button id="FeedbackButton" style={{height:"70px", width:"250px"}}>Give Feedback</Button>
							</div>
						</div>
						
						<div id="Bottom" style={{display:"flex", alignItems:"flex-end", margin:"0"}}>
							<div className="text-center" style={{width:"100%"}}>
								<p style={{textAlign:"center", color:"grey", fontSize:"10px", fontWeight:"500"}}>
									We acknowledge the Traditional Custodians of the Land, and pay respects to their Elders past and present.
								</p>
							</div>
						</div>
						
					</div>
				</div>
             </div>
         );
     }
 }
 
 export default ResponseGood;