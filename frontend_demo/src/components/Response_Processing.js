import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import LoadingGif from '../graphics/loading.gif'
import Button from "./Custom_Button.js";

export default function InputResponse(curState) {
         return (
             <div>
				<Container id="MainBox_Out" style={{margin: 0, position: "absolute", height:"100%", width:"70%", top: "50%", left: "50%", transform: "translate(-50%, -50%)",  minWidth:"500px", minHeight:"775px"}}>
					<Col id="MainBox_In" className="border border-dark text-center d-flex flex-column justify-content-center" style={{height:"100%", padding:"10px"}}>
						<Row id="Top" className="border border-dark text-center" style={{alignItems:'center', margin:"0"}}>
							<div id="TopRow" className="border border-dark" style={{marginTop:"50px"}}>
								<Image src={LoadingGif} style={{width:"50%", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
								<p style={{fontSize:"70px", fontWeight:"bold", color:"black"}}>
								Please be patient.
								</p>
								<p style={{fontSize:"25px", fontWeight:"bold", color:"pink"}}>
								We are processing your request.
								</p>
								<p>Debug: </p>
								<ul>
									{curState.map((item) => (
									  <li key={item.value} style={{textAlign:"left"}}>{item.value}</li>
									))}
								</ul>
							</div>
						</Row>
					</Col>
				</Container>
             </div>
         );
};