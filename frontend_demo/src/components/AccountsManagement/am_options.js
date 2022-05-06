/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, { Component } from 'react';
import {Viewer} from './am_viewer';
import {isEmptyOrSpaces} from './../../services/utilities/common_util';
import {log} from './../../services/core_mw';
import "./am_style.css";

export class Options extends Component {
	constructor(props) {
		super(props);
		
		this.accountSelected = this.accountSelected.bind(this);
		this.storeSelected = this.storeSelected.bind(this);
		this.openFormScreen = this.openFormScreen.bind(this);
		
		this.ACCOUNTSLIST = this.props.ACCOUNTSLIST;
		this.STORESLIST = this.props.STORESLIST;
		this.type = this.props.type;
		
		//Sourcing reference functions
		this.setParentState = this.props.setParentState;
		this.getParentState = this.props.getParentState;
		this.Fetch = this.props.Fetch; //Fetching function
		
		//Generating title
		if(this.type==='accounts') { this.title='Accounts Viewer'; }
		else if(this.type==='stores') { this.title='Stores Viewer'; }
		else { this.title='--invalid title--'; }
	}
	
	/* If an update has occured, then refresh the accountslist/storeslist.
	 *
	 * Although more efficient, "componentWillUpdate" is not being used as it is
	 * being renamed in a future React.js update*/
	componentDidUpdate(prevProps, prevState) {
		this.ACCOUNTSLIST = this.getParentState('primaryAccountsList');
		this.STORESLIST = this.getParentState('primaryStoresList');
	}


	/* The following two functions work in conjunction with "openFormScreen"
	 * I.e., you shouldn't be able to open the "modify account" form if
	 * there is no account selected. */
	accountSelected()
		{ return !isEmptyOrSpaces(this.getParentState('currentAccount')); }
	storeSelected()
		{ return !isEmptyOrSpaces(this.getParentState('currentStore')); }
	
	
	openFormScreen(type, target) {
		type	= type.toLowerCase();
		target	= target.toLowerCase();
		
		//Checking for invalid arguments + error reporting
		if(isEmptyOrSpaces(type)) {
			log("While performing \"openFormScreen(...)\" an invalid (null/undefined) \"type\" variable was provided.");
			return; 
		}
		if(isEmptyOrSpaces(target)) {
			log("While performing \"openFormScreen(...)\" an invalid (null/undefined) \"target\" variable was provided.");
			return; 
		}
		
		if(type === 'store') {
			if(target === 'modify' && this.storeSelected())
			{this.setParentState('currentForm', 'modifystore');}
		
			if(target === 'create')
			{this.setParentState('currentForm','createstore');}
		}
		else if(type === 'account') {
			if(target === 'modify' && this.accountSelected())
			{this.setParentState('currentForm', 'modifyaccount');}
		
			if(target === 'create')
			{this.setParentState('currentForm','createaccount');}
		}
	}


	render() {
		var createStoreTitle = 'Create Store';
		if (this.getParentState('iscompany')===false)
		{ createStoreTitle = 'Add Store'; }
		
        return (
			<div style={{width:"100%"}}>
				<div className="ViewerTitle">{this.title}</div>
				
				<div className="InternalViewerContainer">
					{ <Viewer Fetch={this.Fetch.bind(this)} type={this.type} STORESLIST={this.STORESLIST} ACCOUNTSLIST={this.ACCOUNTSLIST} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)}/> }
					<div className="SubmitButtonContainer">
						{this.getParentState('iscompany')!==false && <>
							{this.type==='accounts' && <>
								<button className="ViewerBtn"
									onClick={() => this.openFormScreen('account','create')}>
									Create Account
								</button>
								
								<button className="ViewerBtn"
									onClick={() => this.openFormScreen('account','modify')}
									disabled={this.props.accountSelected ? true : false}>
									Modify Account
								</button>
							</>}
								
							{this.type==='stores' && <>
								<button className="ViewerBtn"
									onClick={() => this.openFormScreen('store','create')}>
									{createStoreTitle}
								</button>
								
								<button className="ViewerBtn"
									onClick={() => this.openFormScreen('store','modify')}
									disabled={this.props.accountSelected ? true : false}>
									Modify Store
								</button>
							</>}
						</>}
						{this.getParentState('iscompany')===false && <>
							<div style={{width:"600px", marginLeft:"auto", marginRight:"auto", boxShadow:"0 0 10px #5A5A5A"}}>
								<div className="ViewerTitle"  style={{width:"100%"}}>Sorry!</div>
								<div style={{width:"100%"}}>
									<p>Accounts management restricted to <b>company accounts only</b>.</p>
									<p>Please contact your administrator or log in to a company account to access the full screen.</p>
								</div>
							</div>
						</>}
					</div>
				</div>
			</div>
        );
    }
}