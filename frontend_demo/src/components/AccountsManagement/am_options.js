/* This file, as well as its code, respective design, layout,
 * and structure (etc.) has been developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, { Component } from 'react';
import {Viewer} from './am_viewer';
import "./am_style.css";

export class Options extends Component {
	constructor(props) {
		super(props);
		
		this.createAccountCheck = this.createAccountCheck.bind(this);
		this.modifyAccountCheck = this.modifyAccountCheck.bind(this);
		this.createStoreCheck = this.createStoreCheck.bind(this);
		this.modifyStoreCheck = this.modifyStoreCheck.bind(this);
		
		
		this.ACCOUNTSLIST = this.props.ACCOUNTSLIST;
		this.STORESLIST = this.props.STORESLIST;
		this.type = this.props.type;
		
		//Fetching function from parent "AccountsManagement"
		this.setParentState = this.props.setParentState;
		this.getParentState = this.props.getParentState;
		this.Fetch = this.props.Fetch;
		
		if(this.type==='accounts') {
			this.title='Accounts Viewer';
		}
		else if(this.type==='stores') {
			this.title='Stores Viewer';
		}
	}
	
	componentDidUpdate(prevProps, prevState) {
		this.ACCOUNTSLIST = this.getParentState('primaryAccountsList');
		this.STORESLIST = this.getParentState('primaryStoresList');
	}
	
	createAccountCheck() {
		this.setParentState('currentForm', 'createaccount');
	}	

	modifyAccountCheck() {
		let accountSelected = this.getParentState('currentAccount');
		
		if(accountSelected != null) {
			//console.log('An account is selected!')
			this.setParentState('currentForm', 'modifyaccount');
		}
	}
	
	createStoreCheck() {
		this.setParentState('currentForm', 'createstore');
	}	

	modifyStoreCheck() {
		console.log("Performing store mod");
		
		let accountSelected = this.getParentState('currentStore');
		
		if(accountSelected != null) {
			console.log('A store is selected!')
			console.log(accountSelected);
			this.setParentState('currentForm', 'modifystore');
		}
	}

	render() {
		
		//console.log(this.getParentState('iscompany'));
		var createStoreTitle = 'Create Store';
		if (this.getParentState('iscompany')===false) {
			createStoreTitle = 'Add Store';

		}
		
		console.log("disabled? "+this.type+" "+this.props.accountSelected);
		
        return (
		
			
			
			<div style={{width:"100%"}}>
				<div className="ViewerTitle">{this.title}</div>
				<div className="InternalViewerContainer">
					
					
					{ <Viewer Fetch={this.Fetch.bind(this)} type={this.type} STORESLIST={this.STORESLIST} ACCOUNTSLIST={this.ACCOUNTSLIST} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)}/> }
					<div className="SubmitButtonContainer">
					{
						this.type==='accounts' && <>
						<button className="ViewerBtn" onClick={() => this.createAccountCheck()}>Create Account</button>
						<button className="ViewerBtn" onClick={() => this.modifyAccountCheck()} disabled={this.props.accountSelected ? true : false}>Modify Account</button> </>
					}
					{
						this.type==='stores' && <>
						<button className="ViewerBtn" onClick={() => this.createStoreCheck()}>{createStoreTitle}</button>
						<button className="ViewerBtn" onClick={() => this.modifyStoreCheck()} disabled={this.props.accountSelected ? true : false}> Modify Store </button> </>
					}
					
					</div>
				</div>
			</div>
        );
    }
}