import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import RedCrossImage from '../graphics/cross.png'

class ResponseBad extends React.Component {
	
 render() {
         return (
             <div>
				<Container className="border border-dark" style={{margin: 0, position: "absolute", height:"90%", width:"70%", top: "50%", left: "50%", transform: "translate(-50%, -50%)",  minWidth:"500px", minHeight:"1025px"}}>
					<Col className="text-center d-flex flex-column justify-content-between" style={{height:"100%", padding:"10px"}}>
						<Row className="border border-primary text-center" style={{alignItems:'flex-start', padding:"10px"}}>
							<div className="border border-primary text-center" style={{marginTop:"100px"}}>
								<Image src={RedCrossImage} style={{width:"50%", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
								<p style={{fontSize:"70px", fontWeight:"bold", color:"red"}}>
								Oops!
								</p>
								<p style={{fontSize:"25px", fontWeight:"bold", color:"red"}}>
								Something has<br/>gone wrong.
								</p>
							</div>
						</Row>
						
						<Row className="border border-warning text-center" style={{alignItems:'center'}}>
							<div className="border border-warning text-center" style={{marginTop:"100px"}}>
								<p style={{fontSize:"20px", fontWeight:"bold", color:"gray"}}>
									Please forward some<br/>information to us so we<br/>can fix this problem!
								</p>
							</div>
							<button style={{height:"70px"}}>Send Data</button>
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
 
 export default ResponseBad;