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
		GLOBAL = [false, "(Please provide a company name)"];
	}
	if(!userName && !isCompany) {
		valid = false;
		log('Login Error: Invalid USERNAME (provided: \''+userName+'\')');
		GLOBAL = [false, "(Please provide a username)"];
	}
	if(!passCode) {
		valid = false;
		log('Login Error: Invalid PASSWORD (provided: \''+passCode+'\')');
		if(companyName) { GLOBAL = [false, "(Please provide a password)"]; }
		
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
			rememberMeCheck : false,
			companyAccount : false,
			localhost : false,
			loginError : '',
		}
		
		var recalled_username = localStorage.getItem('login_recall_username');
		var recalled_company = localStorage.getItem('login_recall_company');
		var recalled_companyChecked = localStorage.getItem('login_recall_companyChecked');
		var recalled_localhostChecked = localStorage.getItem('login_recall_localhostChecked');
		
		if(recalled_username != null && recalled_username.length > 0) {
			this.state.usernameBox = recalled_username;
			this.state.rememberMeCheck = true;
		}
		if(recalled_company != null && recalled_company.length > 0) {
			this.state.companyBox = recalled_company; 
			this.state.rememberMeCheck = true;
		}
		if(recalled_companyChecked != null) {
			this.state.companyAccount = true;
			this.state.rememberMeCheck = true;
		}
		if(recalled_localhostChecked != null) {
			this.state.localhost = true;
			this.state.rememberMeCheck = true;
		}
		
		this.updateRememberedValues = this.updateRememberedValues.bind(this);
		this.setRememberMe = this.setRememberMe.bind(this);
		this.navigateToHome = this.navigateToHome.bind(this);
		this.SubmitLoginRequest = this.SubmitLoginRequest.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	
	showHelp() {
		alert("Forgotten your password? No worries!\n\nWe suggest that you contact your organisation's administrator to assist you with the password reset process.\nIf you are the administrator, then please contact QRMAX support and we will guide you through this process.");
	}
	
	setRememberMe(newState) {
		if(newState === true) {
			this.setState({rememberMeCheck : true});
			this.updateRememberedValues();
		}
		else {
			this.setState({rememberMeCheck : false});
			this.clearRememberedValues();
		}
	}
	
	updateRememberedValues() {
		localStorage.setItem("login_recall_username", this.state.usernameBox);
		localStorage.setItem("login_recall_company", this.state.companyBox);
		
		if(this.state.companyAccount === true) {
			localStorage.setItem("login_recall_companyChecked", true);
		}
		else {
			localStorage.removeItem('login_recall_companyChecked');
		}
		
		if(this.state.localhost === true) {
			localStorage.setItem("login_recall_localhostChecked", true);
		}
		else {
			localStorage.removeItem('login_recall_localhostChecked');
		}
	}
	
	clearRememberedValues() {
		localStorage.removeItem('login_recall_username');
		localStorage.removeItem('login_recall_company');
		localStorage.removeItem('login_recall_companyChecked');
		localStorage.removeItem('login_recall_localhostChecked');
	}
	
	navigateToHome() {
		sessionStorage.setItem('companyName',this.state.companyBox);
		
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
	
	componentDidUpdate(prevProps, prevState) {
		if(prevState!==this.state && this.state.rememberMeCheck === true) {
			this.updateRememberedValues();
		}
		
	}
	
	handleChange({ target }, checkboxType) {
		if(!checkboxType) {
			this.setState({
				[target.name]: target.value,
				loginError : ''
			});
		}
		else {
			this.setState({[target.name] : target.checked})
			
			
			if(target.name === 'companyAccount') {
				if(target.checked === true && this.state.rememberMeCheck === true) {
					localStorage.setItem("login_recall_companyChecked", true);
				}
				else {
					localStorage.removeItem('login_recall_companyChecked');
				}
			}
			
			if(target.name === 'localhost') {
				if(target.checked === true && this.state.rememberMeCheck === true) {
					localStorage.setItem("login_recall_localhostChecked", true);
				}
				else {
					localStorage.removeItem('login_recall_localhostChecked');
				}
			}
		}
	}
	
	SubmitLoginRequest() {
		this.setState({loading: true});
		
		resetGlobal();
		
		const me = this;

		var timer = { eclapsed: 0 };
		
		var detailsValid = false;
		
		var response = {dataSent:false,username:null,passcode:null}
		
		var interval = setInterval(function() {
			++timer.eclapsed;
			//console.log(timer, me.state.loading);
			
			//after 0.5 seconds
			if(timer.eclapsed >= 1 && response.dataSent==false) {
				//submit information
				response.dataSent = true;
				
				//do fetch
					
				detailsValid = checkDetails(me.state.companyAccount, me.state.companyBox, me.state.usernameBox, me.state.passwordBox);

				
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
					
					if(!detailsValid) {
						me.setState({loginError : GLOBAL[1]});
					}
					else {
						var niceError = getNiceError(GLOBAL[1]);
						me.setState({loginError : niceError});
					}
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
						<div id="innerbox_left">
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
						<div id="rightbox_inner">
						<div id="innerbox_right">
							<div style={{marginBottom:"30px"}}>
								<p style={{margin:"0", textAlign:"left", fontSize:"30px", fontWeight:"500", color:"white"}}>Login</p>
								<p style={{margin:"0", textAlign:"left", fontSize:"20px", color:"#fff9"}}>G'day, let's get started</p>
							</div>
							
							  <form id="LoginFields_Container">
							  
								 <label id="LoginErrorBox">{this.state.loginError}</label>
							  
								  <div id="Checkbox_Container">
									<div id="RememberMe_Container" className="form-check">
										<input name="companyAccount" type="checkbox" className="form-check-input" id="CompanyAccountCheck" checked={this.state.companyAccount} onChange={e => this.handleChange(e, true)}/>
										<label style={{color:'white', marginLeft:'10px', marginTop:'8px'}}>Company Account</label>
									</div>
									<div id="RememberMe_Container" className="form-check">
										<input name="localhost" type="checkbox" className="form-check-input" id="LocalHostCheck" checked={this.state.localhost} onChange={e => this.handleChange(e, true)}/>
										<label style={{color:'white', marginLeft:'10px', marginTop:'8px'}}>Localhost</label>
									</div>
								</div>
							  
								<div id="LoginFormGroup" className="form-group" >
								

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
											<button type="button" onClick={this.showHelp} id="forgotPasswordButton">?</button>
										</div>
								  </div>
								  </div>
								  <div id="Checkbox_Container">
									  <div id="RememberMe_Container" className="form-check">
										<input style={{width:"22px"}} type="checkbox" checked={this.state.rememberMeCheck} onChange={() => this.setRememberMe(!this.state.rememberMeCheck)} className="form-check-input"/>
										<label style={{color:'white', marginLeft:'10px', marginTop:'8px'}}>Remember me</label>
									  </div>
								  </div>
							</form>
						</div>
						<button type="button" onClick={this.SubmitLoginRequest} className="btn" id="submitButton">Submit</button>
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