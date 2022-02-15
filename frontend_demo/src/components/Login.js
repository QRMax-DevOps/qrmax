import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import {Container, Row, Col, Form, FormControl, InputGroup} from 'react-bootstrap';
import Img1 from '../graphics/test_logo 2.png'

import '../style.css';
import './login_style.css'

import LoadingGif from '../graphics/loading_login.gif'
import * as util from './login_util.js'

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

async function fetchAPI(code, requestOptions) {
    return fetch('http://3.25.134.204/api/v1/QR/'+code, requestOptions)
        .then(response => {
            const data = response.json();
			
			// get error message from body or default to response statusText
			const info = (data && data.message) || response.statusText;
			
            if (!response.ok) {
				console.log(" - Log: API Response ... Fail! (response: "+info+")");
				return false;
				
            } else {
				console.log(" - Log: API Response ... Pass! (response: "+info+")");
				return true;
			}
        })
        .catch(info => {
            console.error(' - Log: API Response ... Unexpected error:', info);
			return false;
        });
}

var testGlobal = null;

async function RunFetch(code) {
	// GET request using fetch with basic error handling
	console.log(" - Log: Fetching via: \"http://3.25.134.204/api/v1/QR/"+code+"\"");
	
	const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };
	const asyncFetch = await fetchAPI(code, requestOptions);
	
	testGlobal=asyncFetch;
}

class LoadingScreen extends React.Component {
	render() {
		return (
			<div id="LoadingContainer">
				<img id="LoadingGraphic" src={LoadingGif}/>
			</div>
		)
	}
}

class Page extends React.Component {
	constructor(props) {
		super(props);
		this.state = {loading : false} //When loading==true, show "LoadingScreen"
		
		//Granting "submitLoginRequest" access to "this".
		this.submitLoginRequest = this.submitLoginRequest.bind(this)
	}
	
	
	
	submitLoginRequest() {
		this.setState({loading: true});
		
		const me = this;

		var timer = { eclapsed: 0 };
		
		var response = {dataSent:false,username:null,passcode:null}
		
		var interval = setInterval(function() {
			++timer.eclapsed;
			console.log(timer, me.state.loading);
			
			//after 0.5 seconds
			if(timer.eclapsed >= 1 && response.dataSent==false) {
				//submit information
				response.dataSent = true;
				
				//do fetch
				RunFetch("testData");
			}
			
			else if(response.dataSent==true && testGlobal != null) {
				console.log("response received!")
				me.setState({loading : false});
				clearInterval(interval);
			}
			
			
			
			
			
			//timeout after 3 seconds
			if(timer.eclapsed == 6) {
				console.log("timer timeout!");
				me.setState({loading : false});
				clearInterval(interval);
			}
		}, 500);
		
	}
	
	render() {
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
						{this.state.loading ? <LoadingScreen/> : null }
						<div id="innerbox" style={{width:"100%",height:"100%", position:"absolute"}}>
							<p style={{margin:0, textAlign:"left", fontSize:"30px", fontWeight:"500", color:"white"}}>Login</p>
							<p style={{textAlign:"left", fontSize:"20px", color:"#fff9"}}>G'day, let's get started</p>
							  <form>
							  <div style={{paddingTop:"60px", paddingBottom:"60px"}}>
								  <div className="form-group" style={{paddingBottom:"20px"}} >
									<input type="email" className="form-control" id="emailInput" aria-describedby="emailHelp" placeholder="Enter email" autoComplete="off"/>
									<small id="emailHelp" className="form-text" style={{color:"white", fontSize:"14px"}}>This address will never  be spammed or shared.</small>
								  </div>
								  <div className="form-group row">
										<div className="col">
											<input type="password" className="form-control" id="passwordInput" placeholder="Password"/>
										</div>
										<div className="col-auto">
											<button type="button" id="forgotPasswordButton">?</button>
										</div>
								  </div>
								  <div className="form-check" id="wrapperPad">
									<input type="checkbox" className="form-check-input" id="rememberMeCheck"/>
									<label className="form-check-label" htmlFor="exampleCheck1" style={{color:"white"}}>Remember me</label>
								  </div>
							  </div>
								<button onClick={this.submitLoginRequest} type="button" className="btn" id="submitButton" style={{color:"rgb(51, 142, 240)", fontWeight:"bold", width:"100%"}}>Submit</button>
							</form>
						</div>
					</div>
				  </div>
				<div id="footer">
					<p>We acknowledge the traditional custodians of the land, and pay respects to their elders past and present.</p>
				</div>
			</div>
		);
	}
}

export default function Load_LoginScreen() {
	ReactDOM.render(<Page/>, document.getElementById('root'));
};