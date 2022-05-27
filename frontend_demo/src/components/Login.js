import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Form, FormControl, InputGroup} from 'react-bootstrap';
import Image from 'react-bootstrap/Image'
import Img1 from '../graphics/test_logo 2.png'
import '../style.css';
import Button from "./Custom_Button.js"

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

/*
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
*/

export default function Load_LoginScreen() {
	return (
			<div id="background">
			
				<div id="mainbox" className="center" >

					<div id="leftbox" className="alignmentCheck">
						<div id="innerbox">
							<img id="logo" src={Img1}/>
							<br/>
							<p id="title">
								Pre-alpha Prototype
							</p>
							<p id="subtitle">
								This prototype is not an accurate<br/>
								representation of the final product<br/>
								and is subject to frequent change.
							</p>
						</div>
					</div>
					<div id="rightbox" className="alignmentCheck">
						<div id="innerbox">
							<p style={{margin:0, textAlign:"left", fontSize:"30px", fontWeight:"500", color:"white"}}>Login</p>
							<p style={{textAlign:"left", fontSize:"20px", color:"#fff9"}}>G'day, let's get started</p>
							
							  <form>
							  <div style={{paddingTop:"60px", paddingBottom:"60px"}}>
								  <div class="form-group" style={{paddingBottom:"20px"}} >
									<input type="email" class="form-control" id="emailInput" aria-describedby="emailHelp" placeholder="Enter email" autocomplete="off"/>
									<small id="emailHelp" class="form-text" style={{color:"white"}}>This address will never  be spammed or shared.</small>
								  </div>
								  <div class="form-group row">
										<div class="col">
											<input type="password" class="form-control" id="passwordInput" placeholder="Password"/>
										</div>
										<div class="col-auto">
											<button type="button" id="forgotPasswordButton">?</button>
										</div>
								  </div>
								  <div class="form-check" id="wrapperPad">
									<input type="checkbox" class="form-check-input" id="rememberMeCheck"/>
									<label class="form-check-label" for="exampleCheck1" style={{color:"white"}}>Remember me</label>
								  </div>
							  </div>
							  <button type="submit" class="btn" id="submitButton" style={{color:"rgb(51, 142, 240)", fontWeight:"bold", width:"100%"}}>Submit</button>
							</form>
						</div>
					</div>
				  </div>
				<div id="footer">
					<p>We acknowledge the traditional custodians of the land, and pay respects to their elders past and present.</p>
				</div>
			</div>
		);
};