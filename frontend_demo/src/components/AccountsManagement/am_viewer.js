/* This file and all contained code was developed by:
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
		this.state = {account:this.account};
		//console.log('Constructing ACCOUNT object from data: ',this.account);
	}
	
	getStoresString(stores) {
		var json = stores;
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

		console.log("account==",account);

		if(account.type.toLowerCase()==='storeaccount') {
			
			let classDesc = "";
			
			if(this.props.selected === true) {
				classDesc = "Selected"
			}
			
			return (
				<button
					id="AccountDisplayButton"
					onClick={() => this.UpdateCurrentSelected('account', this.state.account)}
					className={classDesc}>
					
					<label id="usernameField" className="DataField"><span style={{color:"rgb(0, 59, 117)", fontStyle:"italic"}}>Username:</span> {account.username}</label>
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
		let bgColor = '#E7E7E7';
		let classDesc = "";
		
		if(this.props.selected === true) {
			classDesc = "Selected"
		}
		
		return(
			<button		
				id="AccountDisplayButton"
				onClick={() => this.UpdateCurrentSelected('store', this.storeData)}
				className={classDesc}>
				<label id="storeID" className="DataField"><span style={{color:"rgb(0, 59, 117)", fontStyle:"italic"}}>ID:</span> {this.storeData.ID}</label>
				<label id="storeName" className="DataField"><span style={{color:"rgb(0, 59, 117)", fontStyle:"italic"}}>Store:</span> {this.storeData.store}</label>
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
		this.state = {ListItems:[], currentlySelected:''};
	}


	UpdateCurrentSelected(type, account) {
		//Close all forms (prevent data clashes when doing reselection)
		if(this.getParentState('currentForm') !== null) {
			this.setParentState('currentForm', null);
		}
		if(type.toLowerCase() ===  'store') {
			//If record is already selected, then deselect
			if(this.state.currentlySelected && (this.state.currentlySelected.ID === account.ID)) {
				this.setParentState('currentStore',null);
				this.setState({currentlySelected:null});
			}
			//Else, select record
			else {
				this.setParentState('currentStore',account);
				this.setState({currentlySelected:account});
			}
		}
		else if(type.toLowerCase() ===  'account') {
			if(this.state.currentlySelected && (this.state.currentlySelected.username === account.username)) {
				this.setParentState('currentaccount',null);
				this.setState({currentlySelected:null});
			}
			else {
				this.setParentState('currentaccount',account);
				this.setState({currentlySelected:account});
			}
		}
	}
	
	//Returns a mapped list of "ListItem" objects.
	BuildList(type, source) {
		if(source && source.length > 0) {
			return source.map((data) => this.BuildListItem(type, data));
		} else {
			return 'None';
		}
	}
	
	//Used in the above "BuildList" function.
	BuildListItem(type, data) {
		var isSelected = false;
		
		if(this.type==='accounts') {
			//Checking if the record is currently selected
			if(this.state.currentlySelected && (data.username === this.state.currentlySelected.username)) 
			{ isSelected = true; }
		
			//Construct and return the list item
			return (
				<li key={data.username}>
					<ListItem_Account UpdateCurrentSelected={this.UpdateCurrentSelected.bind(this)} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} selected={isSelected} account={data}/>
				</li>
			);
		}
		if(this.type==='stores') {
			if(this.state.currentlySelected && (data.ID === this.state.currentlySelected.ID))
			{ isSelected = true; }
			
			return  (
				<li key={data.store}>
					<ListItem_Store UpdateCurrentSelected={this.UpdateCurrentSelected.bind(this)} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} selected={isSelected} storeData={data}/>
				</li>
			);
		}
	}
	
	componentDidMount() { 
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}
	
	componentDidUpdate(prevProps, prevState) {
		this.ACCOUNTSLIST = this.getParentState('primaryaccountslist');
		this.STORESLIST = this.getParentState('primarystoreslist');

		if(prevState.currentlySelected !== this.state.currentlySelected) {
			this.setParentState('queueSoftRefresh',true);
		}
		if(this.getParentState('queueSoftRefresh') === true && this._mounted) {
			

			
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
			this.setState({currentlySelected:null});
			this.setParentState('currentForm',null);
				
			this.Fetch(this.type);
	}
	
	SoftRefresh(target) {
		if(IsJsonString(target)) {
			this.setParentState('currentForm',null);

			let results = [];
			var json =  JSON.parse(target);
			
			if(json) {
				if(this.type === 'stores' && !json.status) {
					//Safe guarding.  The API will sometimes return an object in an array instead of a single object.
					if(Array.isArray(json)) {
						json.forEach((element) => {
							results.push(element)
						});
					}
					else {
						json.forEach((element) => {
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
					this.setState({ListItems:this.BuildList('accounts', results)});
				}
				else if(this.type==='stores') {
					this.setState({ListItems:this.BuildList('stores', results)});
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
					<input
						className="ViewerSearch"
						disabled={true}
						onChange={(e) => this.SearchAccounts(e.target.value)}
						type="text"/>
						
					<button
						className="ViewerBtn"
						onClick={() => this.HardRefresh()}
						style={{marginLeft:"10px", marginTop:"10px", width:"100px"}}>
							Refresh
					</button>
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