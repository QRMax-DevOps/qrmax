import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import GreenTickImage from '../graphics/tick.png'

class ResponseGood extends React.Component {
	
 render() {
         return (
             <div>
				<Container className="border border-dark" style={{margin: 0, position: "absolute", height:"90%", width:"70%", top: "50%", left: "50%", transform: "translate(-50%, -50%)",  minWidth:"500px", minHeight:"908px"}}>
					<Col className="text-center d-flex flex-column justify-content-between" style={{height:"100%", padding:"10px"}}>
						<Row className="border border-primary text-center" style={{alignItems:'flex-start', padding:"10px"}}>
							<div className="border border-primary text-center" style={{marginTop:"100px"}}>
								<Image src={GreenTickImage} style={{width:"50%", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
								<br/>
								<p style={{fontSize:"30px", fontWeight:"bold", color:"green"}}>Your input has<br/>been received!</p>
							</div>
						</Row>
						
						<Row className="border border-warning text-center" style={{alignItems:'center'}}>
							<div className="border border-warning text-center" style={{marginTop:"100px"}}>
								<p style={{fontSize:"20px", fontWeight:"bold", color:"gray"}}>
									Your opinion is valuable<br/>
									and will help us improve<br/>
									this service.
								</p>
							</div>
							<button style={{height:"70px"}}>Give Feedback</button>
						</Row>
						
						<Row className="border border-success text-center" style={{alignItems:'flex-end'}}>
							<div className="border border-success text-center" style={{marginTop:"100px"}}>
								<p style={{color:"grey"}}>
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