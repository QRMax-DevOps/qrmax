/*search for account
   - Search (checks all - given, middle and surnames, company names, positions, usernames, etc.)
   - Admins of a company can only view that are A. accounts belonging to their own company (unless they're a system admin),
		and can only modify if they are also lower permission than them, so not including themselves (unless they are highest
		current permission in the company)
   
   -  all relevant details can be modified as long as the above is satisfied.
*/

import React, { useState, Component } from 'react';
import {log, RunFetch_GetStores, RunFetch_GetAccounts} from './../../services/am_middleware';
import {getApiURL} from './../../services/middleware_core';
import {useLocation} from "react-router-dom";

import {ListItem, Viewer} from './am_viewer';
import {Options} from './am_options';
import {CreateAccountForm, ModifyAccountForm, CreateStoreForm, ModifyStoreForm} from './am_forms';
import {Account} from './am_account';
import Sidebar from '../Sidebar';

import '../UniversalStyle.css';

class Modifications extends Component {
	constructor(props) {
		super(props);
		this.setParentState = this.props.setParentState;
		this.getParentState = this.props.getParentState;
		
				
		this.state = {account:this.props.curAccount}
	}

	
	render() {
		
        return (
			<div className="FloatingContainer" style={{height:"100%", width:"100%"}}>
				{this.props.toDo === "createaccount" &&
					<CreateAccountForm global={this.getParentState('global')} account={this.state.account}/>
				}
				{this.props.toDo === "modifyaccount" &&
					<ModifyAccountForm global={this.getParentState('global')} account={this.state.account}/>
				}
				{this.props.toDo === "createstore" &&
					<CreateStoreForm global={this.getParentState('global')} store={this.state.account}/>
				}
				{this.props.toDo === "modifystore" &&
					<ModifyStoreForm global={this.getParentState('global')} store={this.state.account}/>
				}
				<div className="SubmitButtonContainer">
					<button onClick={() => this.setParentState('toDo', null)}>Close</button>
				</div>
			</div>
        );
    }
}



function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
		console.log(e);
        return false;
    }
    return true;
}

class AccountsManagement extends Component {
	constructor(props) {
		super(props);
		
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		var isCompanyParam = urlParams.get('iscompany');
		var companynameParam = urlParams.get('companyname');
		var usernameParam = urlParams.get('username');
		var isLocalhostParam = urlParams.get('localhost');
		
		var userID_x = '';
		
		if(isCompanyParam==='true') {
			isCompanyParam = true;
		}
		else {
			isCompanyParam = false;
		}
		
		if(isCompanyParam===true) {
			userID_x = companynameParam;
		}
		else {
			userID_x = usernameParam;
		}
		
		this.state = {
			global : {isCompany:isCompanyParam, companyName:companynameParam, userID:userID_x, apiURL:getApiURL(isLocalhostParam)},

			toDo : null,
			curAccount: null, //Currently selected account.
			
			ACCOUNTSLIST:null,
			STORESLIST:null,
			
			loading:false,
			needSoftRefresh:false //Refresh the UI after fetching new data from the API.
		};
		
		this.setParentState = this.setParentState.bind(this)
		this.getParentState = this.getParentState.bind(this)
		this.Fetch = this.Fetch.bind(this)
		
		this.Fetch('accounts');
		this.Fetch('stores');
		
		
		
	}

	Fetch(type) {
		if(this.state.global) {
			var username = this.state.global.userID;
			var companyName = this.state.global.companyName;
			var apiURL = this.state.global.apiURL;
			var isCompany = this.state.global.isCompany;
			
			let request = null;
			let response = [null,null];

			if(!this.state.loading && type==='accounts') {
				request = RunFetch_GetAccounts(isCompany,apiURL,username,companyName,response);
			}
			else if(!this.state.loading && type==='stores') {
				request = RunFetch_GetStores(isCompany,apiURL,username,companyName,response);
			}
			
			var timer = { eclapsed: 0 };
			var me = this;
			
			var interval = setInterval(function() {
				timer.eclapsed++;
				
				//console.log(timer)
				
				if(response[0] !== null) {
					clearInterval(interval);
					me.setState({loading:false});

					if(response[0] === true && type==='accounts'){
						
						var json = JSON.parse(response[1]);
						
						for(var i = 0; i < json.length; i++) {
							json[i].type = 'storeaccount';
							
							var storesValid=IsJsonString(JSON.stringify(json[i].stores));
							
							
							if(!storesValid) {
								json[i].stores=null;
							}
						}
						
						
						me.setParentState('accountslist',JSON.stringify(json));
						me.setState({needSoftRefresh:true});
					}
					if(response[0] === true && type==='stores'){
						me.setParentState('storeslist',response[1]);
						me.setState({needSoftRefresh:true});
					}
					
				}

				//timeout after 3 seconds
				if(timer.eclapsed == 24) {
					console.log("Fetch-loop timeout!");
					me.setState({loading:false});
					clearInterval(interval);
				}
			}, 500);
		}
	}
	

	setParentState(target, newValue) {
		if(target.toLowerCase()==='todo') {
			this.setState( () => ({
			 toDo : newValue
			}));
		}
		if(target.toLowerCase()==='curaccount') {
			this.setState( () => ({
			 curAccount : newValue
			}));
		}
		if(target.toLowerCase()==='accountslist') {
			this.setState( () => ({
			 ACCOUNTSLIST : newValue
			}));
		}
		if(target.toLowerCase()==='storeslist') {
			this.setState( () => ({
			 STORESLIST : newValue
			}));
		}
		if(target.toLowerCase()==='needsoftrefresh') {
			this.setState( () => ({
			 needSoftRefresh : newValue
			}));
		}
		//console.log("State set to: ",this.state);
	}
	
	getParentState(target) {
		if(target.toLowerCase()==='todo') {
			return this.state.toDo;
		}
		if(target.toLowerCase()==='curaccount') {
			return this.state.curAccount;
		}
		if(target.toLowerCase()==='accountslist') {
			return this.state.ACCOUNTSLIST;
		}
		if(target.toLowerCase()==='storeslist') {
			return this.state.STORESLIST;
		}
		if(target.toLowerCase()==='needsoftrefresh') {
			return this.state.needSoftRefresh;
		}
		if(target.toLowerCase()==='global') {
			return this.state.global;
		}
		if(target.toLowerCase()==='iscompany') {
			
			if(typeof(this.state.global.isCompany) === 'string') {
				if(this.state.global.isCompany.toLowerCase() === 'true') {
					return true;
				}
				else if(this.state.global.isCompany.toLowerCase() === 'false') {
					return false;
				}
			}
			else if (typeof(this.state.global.isCompany) === 'boolean'){
				return this.state.global.isCompany;
			}
		}
		else {
			return this.state;
		}
	}
	
    render() {
		if(this.state.global && !this.state.global.isCompany) {
			return (
				<div class="background">
				<div>
                    <Sidebar/>
                </div>
			
				<div className="MainAccountsContainer">
					<div className="FloatingContainer" style={{flexDirection:"row"}}>

					<Options type='stores' Fetch={this.Fetch.bind(this)} ACCOUNTSLIST={this.state.ACCOUNTSLIST} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} accountSelected={this.state.curAccount == null}/>
					
					</div>
					
					<div className="FloatingContainer">
					{this.state.toDo != null &&
						<Modifications curAccount={this.state.curAccount} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} toDo={this.state.toDo}/>
					}
					</div>
				</div>
				</div>
			);
		}
		else if(this.state.global && this.state.global.isCompany) {
			return (
				<div class="background">			
				<div className="MainAccountsContainer">
					<div className="FloatingContainer" style={{flexDirection:"row"}}>
					
					{ this.getParentState('iscompany') === true &&
						<Options type='accounts' Fetch={this.Fetch.bind(this)} ACCOUNTSLIST={this.state.ACCOUNTSLIST} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} accountSelected={this.state.curAccount == null}/>
					}
					<Options type='stores' Fetch={this.Fetch.bind(this)} ACCOUNTSLIST={this.state.ACCOUNTSLIST} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} accountSelected={this.state.curAccount == null}/>
					
					</div>
					
					<div className="FloatingContainer">
					{this.state.toDo != null &&
						<Modifications curAccount={this.state.curAccount} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} toDo={this.state.toDo}/>
					}
					</div>
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