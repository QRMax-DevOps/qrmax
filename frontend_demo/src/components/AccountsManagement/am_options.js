import React, { Component } from 'react';
import {Viewer} from './am_viewer';

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
		this.ACCOUNTSLIST = this.getParentState('accountslist');
		this.STORESLIST = this.getParentState('storeslist');
	}
	
	createAccountCheck() {
		this.setParentState('toDo', 'createaccount');
	}	

	modifyAccountCheck() {
		let accountSelected = this.getParentState('curAccount');
		
		if(accountSelected != null) {
			//console.log('An account is selected!')
			this.setParentState('toDo', 'modifyaccount');
		}
	}
	
	createStoreCheck() {
		this.setParentState('toDo', 'createstore');
	}	

	modifyStoreCheck() {
		let accountSelected = this.getParentState('curStore');
		
		if(accountSelected != null) {
			//console.log('A store is selected!')
			this.setParentState('toDo', 'modifystore');
		}
	}

	render() {
		
		//console.log(this.getParentState('iscompany'));
		var createStoreTitle = 'Create Store';
		if (this.getParentState('iscompany')===false) {
			createStoreTitle = 'Add Store';

		}
		
		
        return (
		
			<div className="FloatingContainer">
				
				<p>{this.title}</p>
				
				{ <Viewer Fetch={this.Fetch.bind(this)} type={this.type} STORESLIST={this.STORESLIST} ACCOUNTSLIST={this.ACCOUNTSLIST} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)}/> }
				<div className="SubmitButtonContainer">
				{
					this.type==='accounts' && <>
					<button onClick={() => this.createAccountCheck()} className="InteractButton">Create Account</button>
					<button onClick={() => this.modifyAccountCheck()} disabled={this.props.accountSelected ? true : false}>Modify Account</button> </>
				}
				{
					this.type==='stores' && <>
					<button onClick={() => this.createStoreCheck()} className="InteractButton">{createStoreTitle}</button>
					<button onClick={() => this.modifyStoreCheck()} disabled={this.props.accountSelected ? true : false}> Modify Store </button> </>
				}
				
				</div>
			</div>
        );
    }
}