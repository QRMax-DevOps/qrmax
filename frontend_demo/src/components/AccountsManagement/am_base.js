/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, {Component} from 'react';
import {RunFetch_GetStores, RunFetch_GetAccounts} from './../../services/middleware/accounts_mw';
import {getApiURL, log} from './../../services/core_mw';

import {Options} from './am_options';
import {CreateAccountForm, ModifyAccountForm, CreateStoreForm, ModifyStoreForm, ErrorOccured} from './am_forms';
import Sidebar from '../Sidebar';

import {isEmptyOrSpaces, IsJsonString, stringToBool} from './../../services/utilities/common_util';
import "./am_style.css";


/* ACCOUNTS MANAGEMENT FOUNDATION COMPONENT
 *
 * The primary/foundational component for the accounts management screen.
 * Stores all important properties and components.
 */
class AccountsManagement extends Component {
	constructor(props) {
		super(props);

		//Getting vitals from session storage (generated upon login)
		var companynameParam = sessionStorage.companyName;
		var usernameParam = sessionStorage.username;
		
		var isLocalhostParam = false;
		if(sessionStorage.isLocalhost==='true' || sessionStorage.isLocalhost===true)
		{ isLocalhostParam = true; }
		
		var isCompanyParam = false;
		if(sessionStorage.isCompanyAccount==='true' || sessionStorage.isCompanyAccount===true)
		{ isCompanyParam = true; }
		
		this.state = {
			global : {isCompany:isCompanyParam, companyName:companynameParam, userID:usernameParam, apiURL:getApiURL(isLocalhostParam)},

			currentForm:			null,	//Current form to be displayed (create account, modify store, etc.)
			currentAccount:	 		null,	//Currently selected account
			currentStore:			null,	//Currently selected store
			
			primaryAccountsList:	null,	//The primary generated accounts list
			primaryStoresList:		null,	//The primary generated stores list
			
			isLoading:				false,	//Is the screen currently loading/awaiting information from a request?
			queueSoftRefresh:		false	//Refresh the UI after fetching new data from the API.
		};
		
		this.setParentState = this.setParentState.bind(this)
		this.getParentState = this.getParentState.bind(this)
		this.Fetch = this.Fetch.bind(this)
		
		//Perform "fetch" (Call the API and request information)
		this.Fetch('accounts');
		this.Fetch('stores');
	}
	
	componentWillUnmount() {
		this._toUnmount = true;
	}

	/* This function is used to request and retrieve the stores and/or accounts
	 * from the database.
	 * Depending on what "type" argument it is provided, the function will either
	 * fetch a stores list or an accounts list. */
	Fetch(type) {
		if(this.state.global) {
			var username = this.state.global.userID;
			var companyName = this.state.global.companyName;
			var apiURL = this.state.global.apiURL;
			var isCompany = this.state.global.isCompany;
			
			let requestResponse = [null,null];

			if(!this.state.isLoading && type==='accounts') //Run an API request to fetch the accounts list
			{ RunFetch_GetAccounts(isCompany,apiURL,username,companyName,requestResponse); }
		
			else if(!this.state.isLoading && type==='stores') //Run an API request to fetch the stores list
			{ RunFetch_GetStores(isCompany,apiURL,username,companyName,requestResponse); }
			
			
			var stopwatch = { eclapsed: 0 };
			var me = this;
			
			var interval = setInterval(function() {
				stopwatch.eclapsed++;
				
				if(me._toUnmount) {
					log("Accounts Management Screen - screen switched, response from pending fetch will be ignored.");
					clearInterval(interval);
					return;
				}
				
				if(requestResponse[0] !== null) {
					clearInterval(interval);
					me.setState({isLoading:false});
					var json = '';
					
					//Good response for accounts (set accountslist)
					if(requestResponse[0] === true && type==='accounts'){
						json = JSON.parse(requestResponse[1]).Accounts;
						
						for(var i = 0; i < json.length; i++) {
							json[i].type = 'storeaccount';
							var storesValid=IsJsonString(JSON.stringify(json[i].stores));
							if(!storesValid)
								{ json[i].stores=null; }
						}
						
						console.log("new accounts == ",JSON.stringify(json));
						
						me.setParentState('primaryAccountsList',JSON.stringify(json));
						me.setState({queueSoftRefresh:true, currentAccount:null, currentStore:null});
					}
					//Good response for stores (set storeslist)
					if(requestResponse[0] === true && type==='stores'){
						json = JSON.parse(requestResponse[1]).stores;
						me.setParentState('primaryStoresList',JSON.stringify(json));
						me.setState({queueSoftRefresh:true, currentAccount:null, currentStore:null});
					}
				}
				//timeout after 12 seconds
				if(stopwatch.eclapsed === 24) {
					console.log("Fetch-loop timeout!");
					me.setState({isLoading:false});
					clearInterval(interval);
				}
			}, 500);
		}
	}
	
	
	/* This function is passed to child components, enabling them to
	 * SET primary/parent state variables. */
	setParentState(target, newValue) {
		switch(target.toLowerCase()) {	
			case 'currentform':			this.setState(()=>({ currentForm : newValue})); 			break;
			case 'currentaccount': 		this.setState(()=>({ currentAccount : newValue}));			break;
			case 'currentstore': 		this.setState(()=>({ currentStore : newValue}));			break;
			case 'primaryaccountslist':	this.setState(()=>({ primaryAccountsList : newValue}));		break;
			case 'primarystoreslist':	this.setState(()=>({ primaryStoresList : newValue}));		break;
			case 'queuesoftrefresh':	this.setState(()=>({ queueSoftRefresh : newValue}));		break;
			
			default: //Debug
				console.log("Warning: variable request ("+target+")"
				+ " not recognised with new Value ("+newValue+")");
				break;
			
		}
	}
	
	
	/* This function is passed to child components, enabling them to
	 * GET primary/parent state variables. */
	getParentState(target) {
		switch(target.toLowerCase()) {	
			case 'currentform':			return this.state.currentForm;
			case 'currentaccount': 		return this.state.currentAccount;
			case 'currentstore': 		return this.state.currentStore;
			case 'primaryaccountslist':	return this.state.primaryAccountsList;
			case 'primarystoreslist':	return this.state.primaryStoresList;
			case 'queuesoftrefresh':	return this.state.queueSoftRefresh;
			case 'global':				return this.state.global;
			case 'iscompany': 			return stringToBool(this.state.global.isCompany);
			
			default: //Debug
				console.log("Warning: variable request ("+target+")"
				+ " not recognised");
				return null;
		}
	}
	
	
    render() {
		//If NOT a company account
		if(this.state.global && !this.state.global.isCompany) {
			return (
				<div className="AmBackground SideBySide">
					<div style={{height:"100%"}}> <Sidebar/> </div>
					<div className="MainAccountsContainer">
						<div className="FloatingContainer" style={{flexDirection:"row", boxShadow:"0 0 10px #5A5A5A"}}>
							<Options
								type='stores'
								Fetch={this.Fetch.bind(this)}
								STORESLIST={this.state.primaryAccountsList}
								getParentState={this.getParentState.bind(this)}
								setParentState={this.setParentState.bind(this)}
								accountSelected={this.state.currentstore == null}
							/>
						</div>
						
						{this.state.currentForm != null &&
							<Modifications 
								curAccount={this.state.currentAccount}
								curStore={this.state.currentStore}
								getParentState={this.getParentState.bind(this)}
								setParentState={this.setParentState.bind(this)}
								currentForm={this.state.currentForm}
							/>
						}
					</div>
				</div>
			);
		}
		//If IS a company account
		else if(this.state.global && this.state.global.isCompany) {
			return (
				<div className="AmBackground SideBySide">
					<div style={{height:"100%"}}> <Sidebar/> </div>
					<div className="MainAccountsContainer">
						<div className="FloatingContainer" style={{flexDirection:"row", boxShadow:"0 0 10px #5A5A5A"}}>
							{ this.getParentState('iscompany') === true &&
								<Options
									type='accounts'
									Fetch={this.Fetch.bind(this)}
									ACCOUNTSLIST={this.state.primaryAccountsList}
									getParentState={this.getParentState.bind(this)}
									setParentState={this.setParentState.bind(this)}
									accountSelected={this.state.currentAccount == null}
								/>
							}
							<Options
								type='stores'
								Fetch={this.Fetch.bind(this)}
								STORESLIST={this.state.primaryAccountsList}
								getParentState={this.getParentState.bind(this)}
								setParentState={this.setParentState.bind(this)}
								accountSelected={this.state.currentStore == null}
							/>
						</div>
						

						{this.state.currentForm != null &&
							<Modifications
								curAccount={this.state.currentAccount}
								curStore={this.state.currentStore}
								getParentState={this.getParentState.bind(this)}
								setParentState={this.setParentState.bind(this)}
								currentForm={this.state.currentForm}
							/>
						}

					</div>
				</div>
			);
		}
		else {
			console.log('No global variable was provided, (I.e., user details from login, API address, etc.)'
			+'\n\nThe global variable is produced and provided via successful login. If you do not log in properly, the web-app will not function correctly.');
			
			return (
				<div className="FloatingContainer">
					<p> An error has occured. Please check the console. </p>
				</div>
			);
		}
    }
}
export default AccountsManagement;



/* MODIFICATIONS PANE
 *
 * Holds and manages the forms for creating and modifying account information
 * On creation, is to be provided a "currentForm" property variable, which will be
 * used to determine what form it will be displaying.
 */
class Modifications extends Component {
	constructor(props) {
		super(props);
		this.setParentState = this.props.setParentState;
		this.getParentState = this.props.getParentState;
	}
	
	render() {
		//Making sure that the "currentForm" variable is a string and is not null.
		if(typeof this.props.currentForm === 'string' && !isEmptyOrSpaces(this.props.currentForm)) {
			var formToDisplay;
			
			console.log("---------companyStoresList === ",this.getParentState('primarystoreslist'));
			
			console.log("this.props.curAccount==",this.props.curAccount);
			
			//Determining which form to display
			switch(this.props.currentForm.toLowerCase()) {
				case 'createaccount':	formToDisplay = <CreateAccountForm 	setParentState={this.setParentState.bind(this)} global={this.getParentState('global')} account	= {this.props.curAccount} companyStoresList = {this.getParentState('primarystoreslist')}/>; break;
				case 'modifyaccount':	formToDisplay = <ModifyAccountForm 	setParentState={this.setParentState.bind(this)} global={this.getParentState('global')} account	= {this.props.curAccount} companyStoresList = {this.getParentState('primarystoreslist')}/>;	break;
				case 'createstore':		formToDisplay = <CreateStoreForm 	setParentState={this.setParentState.bind(this)} global={this.getParentState('global')} store	= {this.props.curStore}/>; 	break;
				case 'modifystore':		formToDisplay = <ModifyStoreForm 	setParentState={this.setParentState.bind(this)} global={this.getParentState('global')} store	= {this.props.curStore}/>;	break;
				
				default: formToDisplay = <ErrorOccured reason={'Unrecognised "currentForm" value ('+this.props.currentForm+')'}/>; break;
			}
			//Rendering interface elements
			return(
				<div className="FloatingContainer" style={{marginTop:"30px"}}>
					{formToDisplay}
				</div>
			);
		}
	}
}