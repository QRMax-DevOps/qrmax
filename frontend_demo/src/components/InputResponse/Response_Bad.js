import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import RedCrossImage from '../../graphics/cross.png'
import Button from "../Custom_Button.js";

class ResponseBad extends React.Component {
	
 render() {
         return (
             <div>
				<Container id="MainBox_Out" style={{margin: 0, position: "absolute", height:"100%", width:"70%", top: "50%", left: "50%", transform: "translate(-50%, -50%)",  minWidth:"500px", minHeight:"775px"}}>
					<Col id="MainBox_In" className="text-center d-flex flex-column justify-content-between" style={{height:"100%", padding:"10px"}}>
					
						<Row id="Top" className="text-center" style={{alignItems:'flex-start', margin:"0"}}>
							<div id="TopRow" style={{marginTop:"50px"}}>
								<Image src={RedCrossImage} style={{width:"50%", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
								<p style={{fontSize:"70px", fontWeight:"bold", color:"red"}}>
								Oops!
								</p>
								<p style={{fontSize:"25px", fontWeight:"bold", color:"red"}}>
								Something has<br/>gone wrong.
								</p>
							</div>
						</Row>
						
						<Row id="Middle" style={{alignItems:'center'}}>
							<div className="text-center">
								<p style={{fontSize:"20px", fontWeight:"500", color:"gray"}}>
									With some of your data,<br/>
									we could diagnose and<br/>
									hopefully fix this issue.
								</p>
								<br/>
								<Button id="GiveDataButton" style={{height:"70px", width:"250px"}}>Forward Data</Button>
							</div>
						</Row>
						
						<Row id="Bottom" style={{alignItems:'flex-end'}}>
							<div className="text-center" style={{marginTop:"0", width:"350px", margin:"auto"}}>
								<p style={{color:"grey", fontWeight:"500"}}>
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