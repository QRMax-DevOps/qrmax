import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import LoadingGif from '../../graphics/loading_response.gif'
import Button from "../Custom_Button.js";

export default function InputResponse(curState) {
         return (
             <div>
				<Container id="MainBox_Out" style={{margin: 0, position: "absolute", height:"100%", width:"100%", top: "50%", left: "50%", transform: "translate(-50%, -50%)",  minWidth:"300px", minHeight:"650px"}}>
					<Col id="MainBox_In" className="d-flex flex-column justify-content-center" style={{height:"100%", padding:"10px"}}>
						<Row id="Top" style={{alignItems:'center', margin:"0"}}>
							<div id="TopRow" style={{marginTop:"50px"}}>
								<Image src={LoadingGif} style={{width:"70%", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
							</div>
						</Row>
					</Col>
				</Container>
             </div>
         );
};