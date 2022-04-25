/* This file, as well as its code, respective design, layout,
 * and structure (etc.) has been developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, { Component } from 'react';
import "./am_style.css";

function IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

class ListItem_Account extends Component {
	constructor(props) {
		super(props);
		this.account = this.props.account;
		
		this.setParentState = this.props.setParentState;
		this.getParentState = this.props.getParentState;
		this.UpdateCurrentSelected = this.props.UpdateCurrentSelected;
		this.buildAccountComponent = this.buildAccountComponent.bind(this);
		
		//console.log('Constructing ACCOUNT object from data: ',this.account);
		
		this.state = {selected:false, account:this.account, bgColor:'#E7E7E7'};
	}
	
	getStoresString(stores) {
		var json = stores;
		
		//console.log("generating stores string from: ",json);
		
		var toReturn ='';
		
		if(json && json.length>0) {
			for(var i = 0; i < json.length; i++) {
				var store = json[i];
				if(i===(json.length-1)) {
					toReturn=(toReturn+("(#"+store.ID+", "+store.store+")"));
					
				}
				else {
					toReturn=(toReturn+("(#"+store.ID+", "+store.store+"), "));
				}
				
			}
		}
		
		if(!json || json.length<1) {
			toReturn="No stores";
		}
		
		return toReturn;
	}
	
	buildAccountComponent() {
		this.state.account=this.props.account;
		
		var account = this.props.account;
		var stores = this.getStoresString(account.stores);
		
		//console.log('account===',account);
		
		if(account.type.toLowerCase()==='storeaccount') {
			
			
			
			return (
				<button		
					onClick={() => this.setState({selected:this.UpdateCurrentSelected('account', this.state.account)})}
					className="AccountDisplayButton">
					
					<label id="usernameField" className="DataField"><fade>Username:</fade> {account.username}</label>
					<label id="storeIdField" className="DataField"> {stores} </label>
				</button>
			);
		}
	}
	
	render() {
		return(
			< this.buildAccountComponent />
		);
	}
}


class ListItem_Store extends Component {
	constructor(props) {
		super(props);
		this.storeData = this.props.storeData;
		
		this.setParentState = this.props.setParentState;
		this.getParentState = this.props.getParentState;
		this.UpdateCurrentSelected = this.props.UpdateCurrentSelected;
		
		//console.log('Constructing STORE object from data: ',this.storeData);
	}
	
	render() {
		//let bgColor = this.state.selected ? '#5EC0FF' : '#E7E7E7';
		let bgColor='#E7E7E7';
		
		return(
		
			<button		
				onClick={() => this.setState({selected:this.UpdateCurrentSelected('store', this.storeData)})}
				className="AccountDisplayButton">
				<label id="storeID" className="DataField"><fade>ID:</fade> {this.storeData.ID}</label>
				<label id="storeName" className="DataField"><fade>Store:</fade> {this.storeData.store}</label>
			</button>

		);
	}
}

export class Viewer extends Component {
	constructor(props) {
		super(props);
		
		
		this.BuildList = this.BuildList.bind(this);
		this.BuildListItem = this.BuildListItem.bind(this);
		this.UpdateCurrentSelected = this.UpdateCurrentSelected.bind(this);
		
		this.setParentState = this.props.setParentState;
		this.getParentState = this.props.getParentState;
		this.Fetch = this.props.Fetch;
		
		this.ACCOUNTSLIST = this.props.ACCOUNTSLIST;
		this.STORESLIST = this.props.STORESLIST;
		this.type = this.props.type;
		this.state = {ListItems:[]};
		
	}
	
	UpdateCurrentSelected(type, account) {
		let result = false;
		
		console.log("Setting current: ",type,account);

		if(this.getParentState('currentForm') !== null) {
			this.setParentState('currentForm', null);
		}
		
		if(type.toLowerCase() ===  'store') {
			this.setParentState('currentStore',account);
			console.log(this.getParentState('currentStore'));
		}
		
		else if(type.toLowerCase() ===  'account') {
			this.setParentState('currentAccount',account);
			console.log(this.getParentState('currentAccount'));
		}
		
		return result;
	}

	
	BuildList(type, source) {
		if(source!=null) {
			return {ListItems:source.map((data) => this.BuildListItem(type, data))};
		} else {
			return 'none';
		}
	}
	
	BuildListItem(type, data) {
		
		//console.log("BUILDING ITEM FROM: ",type,data)
		
		if(this.type==='accounts') {
			return  <li key={data.username}>
			<ListItem_Account UpdateCurrentSelected={this.UpdateCurrentSelected.bind(this)} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} account={data}/>
		</li>;
		}
		if(this.type==='stores') {
			return  <li key={data.ID}>
			<ListItem_Store UpdateCurrentSelected={this.UpdateCurrentSelected.bind(this)} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} storeData={data}/>
		</li>;
		}
	}
	
	componentDidUpdate(prevProps, prevState) {
		this.ACCOUNTSLIST = this.getParentState('primaryaccountslist');
		this.STORESLIST = this.getParentState('primarystoreslist');
		
		if(this.getParentState('queueSoftRefresh') === true) {
			
			if(this.type === 'stores') {
				this.SoftRefresh(this.STORESLIST);
			}
			else if(this.type === 'accounts') {
				
				//console.log('THIS ACCOUNTSLIST === ',this.ACCOUNTSLIST)
				
				this.SoftRefresh(this.ACCOUNTSLIST);
			}
			
			this.setParentState('queueSoftRefresh',false);
		}
	}
	
	HardRefresh() {
			if(this.getParentState('currentForm') != 'createaccount' && this.getParentState('currentForm') != null) {
				this.setParentState('currentForm',null);
			}
			if(this.getParentState('currentAccount') != null) {
				this.setParentState('currentAccount',null);
			}
			
			

			this.Fetch(this.type);
	}
	
	SoftRefresh(target) {
		if(IsJsonString(target)) {		
			if(this.getParentState('currentForm') != 'createaccount' && this.getParentState('currentForm') != null) {
				this.setParentState('currentForm',null);
			}
			
			if(this.getParentState('currentAccount') != null) {
				this.setParentState('currentAccount',null);
			}
			
			let results = [];
			var json =  JSON.parse(target);
			
			//console.log(json)
			
			if(json) {
				if(this.type === 'stores' && !json.status) {
					//Safe guarding.  The API will sometimes return an object in an array instead of a single object.
					if(Array.isArray(json)) {
						json[0].stores.forEach((element) => {
							results.push(element)
						});
					}
					else {
						json.stores.forEach((element) => {
							results.push(element)
						});
					}
				}
				else if(this.type === 'accounts' && !json.status) {
					json.forEach((element) => {
							results.push(element)
					});
				}
				
				
				if(this.type==='accounts') {
					this.setState(this.BuildList('accounts', results));
				}
				else if(this.type==='stores') {
					this.setState(this.BuildList('stores', results));
				}
			}
		}
	}
	
	SearchAccounts(value) {
		let results = [];
		/*
		this.ACCOUNTSLIST.forEach((element) => {
			if(element.company.toLowerCase().includes(value.toLowerCase())) {
				results.push(element)
		}}
		);
		
		this.setState(this.BuildList(results));*/
		
		//console.log(this.state)
	}

	render() {

		return(
			<div id="ViewerContainer">
				<div id="SearchContainer">
					<input className="ViewerSearch" disabled={true} onChange={(e) => this.SearchAccounts(e.target.value)} type="text"/>
					
					<button className="ViewerBtn" onClick={() => this.HardRefresh()} style={{marginLeft:"10px", marginTop:"10px", width:"100px"}}>Refresh</button>
					
				</div>
				<nav >
					<ul className="ViewerNav">
						{this.state.ListItems.length > 0 ? this.state.ListItems : "None"}
					</ul>
				</nav>
			</div>
		);
	}
}