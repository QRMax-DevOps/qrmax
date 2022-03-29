import React, { useState, useEffect } from 'react';
import Image from 'react-bootstrap/Image'
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';
import {Container, Row, Col, Form, FormControl, InputGroup} from 'react-bootstrap';

import {log, getApiURL} from '../../services/core_mw';
import {RunFetch_Login} from '../../services/middleware/login_mw';
import {saveLoginToken} from '../../services/utilities/auth_util';
import {getNiceError} from './login_util';

import Img1 from '../../graphics/updated_logo.PNG'
import Homepage from '../Homepage';

import '../../style.css';
import './login_style.css'

import LoadingGif from '../../graphics/loading_login.gif'

var GLOBAL = [null,null];

function checkDetails(isCompany, companyName, userName, passCode) {
	let valid = true;
		
	if(!companyName) {
		valid = false;
		log('Login Error: Invalid COMPANY (provided: \''+companyName+'\')');
		GLOBAL = [false, "Please provide a company name."];
	}
	if(!userName && !isCompany) {
		valid = false;
		log('Login Error: Invalid USERNAME (provided: \''+userName+'\')');
		GLOBAL = [false, "Please provide a username."];
	}
	if(!passCode) {
		valid = false;
		log('Login Error: Invalid PASSWORD (provided: \''+passCode+'\')');
		if(companyName) { GLOBAL = [false, "Please provide a password."]; }
		
	}
	return valid;
}

function resetGlobal() { GLOBAL = [null,null]; }




/*

if (typeof window !== 'undefined') {
    var path = location.protocol + '//' + location.host + '/someting'; // (or whatever)
  } else {
    // work out what you want to do server-side...
  }

*/


export default class Page extends React.Component {
	constructor(props) {
		super(props);
		
		 //When loading==true, show "LoadingScreen"
		this.state = {
			loading : false,
			passwordBox : '',
			companyBox : '',
			usernameBox : '',
			companyAccount : false,
			localhost : false,
			loginError : '',
		}
		
		this.navigateToHome = this.navigateToHome.bind(this)
		this.SubmitLoginRequest = this.SubmitLoginRequest.bind(this)
		this.handleChange = this.handleChange.bind(this);
	}
	
	navigateToHome() {
		sessionStorage.setItem('companyName',this.state.companyBox);
		
		sessionStorage.setItem('username',this.state.usernameBox);
		
		if(this.state.companyAccount) {
			sessionStorage.setItem('username',this.state.companyBox);
		}
		
		sessionStorage.setItem('isLocalhost',false);
		if(this.state.localhost===true) { 
			sessionStorage.setItem('isLocalhost',true);
		}
		
		sessionStorage.setItem('isCompanyAccount',this.state.companyAccount);
		if(this.state.companyAccount===true) { 
			sessionStorage.setItem('isCompanyAccount',this.state.companyAccount);
		}

		saveLoginToken(JSON.parse(GLOBAL[1]).token);
		
		window.location.href = window.location.protocol + '//' + window.location.host + '/homepage';
	}
	
	handleChange({ target }) {
		this.setState({
			[target.name]: target.value,
			loginError : ''
		});
	}
	
	SubmitLoginRequest() {
		this.setState({loading: true});
		
		resetGlobal();
		
		const me = this;

		var timer = { eclapsed: 0 };
		
		var response = {dataSent:false,username:null,passcode:null}
		
		var interval = setInterval(function() {
			++timer.eclapsed;
			//console.log(timer, me.state.loading);
			
			//after 0.5 seconds
			if(timer.eclapsed >= 1 && response.dataSent==false) {
				//submit information
				response.dataSent = true;
				
				//do fetch
					
				let detailsValid = checkDetails(me.state.companyAccount, me.state.companyBox, me.state.usernameBox, me.state.passwordBox);

				
				if(detailsValid) {
					var data = {companyInput:me.state.companyBox, usernameInput:me.state.usernameBox, passwordInput:me.state.passwordBox};
					
					//console.log("localhost===",me.state.localhost);
					//console.log("getApiURL===",getApiURL(me.state.localhost));
					
					if(me.state.companyAccount) {
						data.usernameInput = me.state.companyBox;
					}
					
					
					RunFetch_Login(getApiURL(me.state.localhost), me.state.companyAccount, data, GLOBAL);
				}
			}
			
			else if(response.dataSent==true && GLOBAL[0] != null) {
				me.setState({loading : false});
				clearInterval(interval);
				
				if(GLOBAL[0]==false) {
					me.setState({loginError : getNiceError(GLOBAL[1])});
					
				}
				
				if(GLOBAL[0]==true) {
					me.navigateToHome();
				}
				
				//Check for errors
				//Visualise errors (username, password, check console, etc.)
				
			}

			//timeout after 3 seconds
			if(timer.eclapsed == 24) {
				console.log("timer timeout!");
				me.setState({loading : false});
				
				clearInterval(interval);
			}
		}, 500);
	}
	
	render() {
		return(
			<div id="background">
			
				<div id="mainbox" >

					<div id="leftbox" className="alignmentCheck">
						<div id="innerbox">
							<img id="logo" src={Img1}/>
							<br/><br/>
							<p id="subtitle">
								This prototype is not an accurate<br/>
								representation of the final product<br/>
								and is subject to frequent change.
							</p>
						</div>
					</div>
					<div id="rightbox" className="alignmentCheck">
						{this.state.loading===true && 
							<div id="LoadingContainer">
							<img id="LoadingGraphic" src={LoadingGif}/>
							</div>
						}
						<div id="innerbox">
							<p style={{margin:0, textAlign:"left", fontSize:"30px", fontWeight:"500", color:"white"}}>Login</p>
							<p style={{textAlign:"left", fontSize:"20px", color:"#fff9"}}>G'day, let's get started</p>
							
							  <form>
							  
							 
							  
							  <div id="LoginFields_Container">
							  
								 <label id="LoginErrorBox">{this.state.loginError}</label>
							  
								  <div id="Checkbox_Container">
									<div id="RememberMe_Container" className="form-check">
										<input type="checkbox" className="form-check-input" id="CompanyAccountCheck" onChange={e => this.setState({companyAccount : e.target.checked})}/>
										<label style={{color:'white', marginLeft:'10px'}}>Company Account</label>
									</div>
									<div id="RememberMe_Container" className="form-check">
										<input type="checkbox" className="form-check-input" id="LocalHostCheck" onChange={e => this.setState({localhost : e.target.checked})}/>
										<label style={{color:'white', marginLeft:'10px'}}>Localhost</label>
									</div>
								</div>
							  
								<div id="LoginFormGroup" className="form-group" style={{paddingBottom:"20px"}} >
								

									<input
										name="companyBox"
										type="email"
										className="form-control emailInput"
										id="companyInput"
										aria-describedby="emailHelp"
										placeholder="Enter company name"
										autoComplete="off"
										value={ this.state.companyBox }
										onChange={ this.handleChange }
									/>
									
									{ !this.state.companyAccount && <>
									<input style={{marginTop:"10px"}}
										name="usernameBox"
										type="email"
										className="form-control emailInput"
										id="usernameInput"
										aria-describedby="emailHelp"
										placeholder="Enter username"
										autoComplete="off"
										value={ this.state.usernameBox }
										onChange={ this.handleChange }
									/>
									</>
									}
								  
								  <div className="form-group row" style={{marginTop:"10px"}}>
										<div className="col">
											<input
												name="passwordBox"
												type="password"
												className="form-control"
												id="passwordInput"
												placeholder="Password"
												value={ this.state.passwordBox }
												onChange={ this.handleChange }
											/>
										</div>
										<div className="col-auto">
											<button type="button" id="forgotPasswordButton">?</button>
										</div>
								  </div>
								  </div>
								  <div id="Checkbox_Container">
									  <div id="RememberMe_Container" className="form-check">
										<input type="checkbox" className="form-check-input" id="rememberMeCheck"/>
										<label style={{color:'white', marginLeft:'10px'}}>Remember me</label>
									  </div>
								  </div>
							  </div>
							  <button type="button" onClick={this.SubmitLoginRequest} className="btn" id="submitButton" style={{color:"rgb(51, 142, 240)", fontWeight:"bold", width:"100%"}}>Submit</button>
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
};
