import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import RedCrossImage from '../../graphics/cross.png'
import Button from "../Custom_Button.js";

class ResponseBad extends React.Component {
	
 render() {
         return (
             <div>
				<div style={{height:"98vh", width:"100vw", margin:"auto"}}>
					<div id="MainBox_In" className="text-center d-flex flex-column" style={{justifyContent:"space-between", alignContent:"center", height:"100%",width:"100%"}}>
					
						<div id="Top" className="text-center" style={{margin:"0", marginTop:"20px"}}>
							<div id="TopRow">
								<Image src={RedCrossImage} style={{width:"30%", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
								<p style={{fontSize:"45px", fontWeight:"bold", color:"red"}}>
								Oops!
								</p>
								<p style={{fontSize:"18px", fontWeight:"bold", color:"red"}}>
								Something has<br/>gone wrong.
								</p>
							</div>
						</div>
						
						<div id="Middle">
							<div className="text-center" style={{margin:"0", height:"100%"}}>
								<p style={{fontSize:"18px", fontWeight:"500", color:"gray"}}>
									With some of your data,<br/>
									we could diagnose and<br/>
									hopefully fix this issue.
								</p>
								<br/>
								<Button id="GiveDataButton" style={{height:"70px", fontSize:"18px", width:"225px"}}>Forward Data</Button>
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
 
 export default ResponseBad;