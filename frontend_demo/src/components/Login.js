import React from 'react';
import {Container, Row, Col, Form} from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import Img1 from '../graphics/test_logo 2.png'
import '../style.css';

class Login extends React.Component {
	render() {
		return (
			<div class="loginView DivSize">
				<Container style={{margin: 0, position: "absolute", width:"60%", top: "50%", left: "50%", transform: "translate(-50%, -50%)",  minWidth:"430px", maxWidth:"700px"}}>
				  <Row>
					<Col className="border border-dark text-center">
						<Row style={{justifyContent:'center', alignItems:'center', paddingTop:"10%", paddingBottom:"20px", paddingLeft:"20px", paddingRight:"20px"}}>
							<br/>
							<Image style={{maxWidth: "400px"}} src={Img1}/>
							<greetingBig style={{textAlign:"center"}}>Prototype</greetingBig>
							<br/><br/><hr/>
							<p className="dynamic noGap" style={{textAlign:"center"}}>This interface is<br/>not representative<br/>of the final design.</p>
						</Row>
					</Col>
					

					<Col className="border border-dark text-center d-flex flex-column justify-content-around" style={{paddingTop:"20px", paddingBottom:"20px", paddingLeft:"20px", paddingRight:"20px"}}>
					
						<Row className="border border-primary " style={{alignItems:'flex-start' }}>
							<greetingBig>Login</greetingBig>
							<greetingSmall className="dynamic">G'day, let's get started</greetingSmall>
						</Row>
						
						<Row className="border border-warning" style={{alignItems:'center'}}>
							
							<Row className="border border-danger">
								<Form.Group className="mb-0 p-0" controlId="formBasicEmail">
									<Form.Control className="dynamic" type="email" placeholder="Enter your username" />
								</Form.Group>
							</Row>
								
							<Row className="border border-danger flex-nowrap">
								<Col className="border border-danger p-0" xs={8}  style={{}}>
								<Form.Group className="mb-0" controlId="formBasicPassword" style={{width:"100%"}}>
									<Form.Control className="dynamic" type="password" placeholder="*************" />
								</Form.Group>
								</Col>

								<Col className="border border-danger" style={{display:'flex', justifyContent:'right'}}>
									<button className="dynamic" style={{width:"60%", textAlign:"center"}}> ? </button>
								</Col>
							</Row>
						</Row>
						
						<Row className="border border-success" style={{alignItems:'flex-end'}}>
							<button className="dynamic" style={{textAlign: 'center', height:"55px"}} >Submit</button>
						</Row>
					</Col>
					
				  </Row>
				</Container>
			</div>
		);
	}
}
 
 export default Login;