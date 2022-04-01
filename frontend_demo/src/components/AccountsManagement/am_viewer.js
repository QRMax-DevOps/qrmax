import React, { Component } from 'react';

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
		this.UpdateCurrentSelectedAccount = this.props.UpdateCurrentSelectedAccount;
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
					style={{backgroundColor: this.state.bgColor }}
					onClick={() => this.setState({selected:this.UpdateCurrentSelectedAccount(this.state.account,this.state.selected)})}
					className="AccountDisplayButton">
					
					<label id="usernameField" className="DataField">{account.username}</label>
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
		this.UpdateCurrentSelectedAccount = this.props.UpdateCurrentSelectedAccount;
		
		//console.log('Constructing STORE object from data: ',this.storeData);
	}
	
	render() {
		//let bgColor = this.state.selected ? '#5EC0FF' : '#E7E7E7';
		let bgColor='#E7E7E7';
		
		return(
		
			<button		
				style={{backgroundColor: bgColor }}
				onClick={() => this.UpdateCurrentSelectedAccount(this.storeData)}
				className="AccountDisplayButton">
				<label id="storeID" className="DataField">ID: {this.storeData.ID}</label>
				<label id="storeName" className="DataField">Store: {this.storeData.store}</label>
			</button>

		);
	}
}

export class Viewer extends Component {
	constructor(props) {
		super(props);
		
		
		this.BuildList = this.BuildList.bind(this);
		this.BuildListItem = this.BuildListItem.bind(this);
		this.UpdateCurrentSelectedAccount = this.UpdateCurrentSelectedAccount.bind(this);
		
		this.setParentState = this.props.setParentState;
		this.getParentState = this.props.getParentState;
		this.Fetch = this.props.Fetch;
		
		this.ACCOUNTSLIST = this.props.ACCOUNTSLIST;
		this.STORESLIST = this.props.STORESLIST;
		this.type = this.props.type;
		this.state = {ListItems:[]};
		
	}
	
	UpdateCurrentSelectedAccount(account, selected) {
		let result = false;
		let stopLoop = false;

		if(this.getParentState('toDo') !== null) {
			this.setParentState('toDo', null);
		}

		this.setParentState('curAccount',account);

		
		return result;
	}

	
	BuildList(type, source) {
		
		//console.log("BUILDING LIST FROM: ",type,source)
		
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
			<ListItem_Account UpdateCurrentSelectedAccount={this.UpdateCurrentSelectedAccount.bind(this)} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} account={data}/>
		</li>;
		}
		if(this.type==='stores') {
			return  <li key={data.ID}>
			<ListItem_Store UpdateCurrentSelectedAccount={this.UpdateCurrentSelectedAccount.bind(this)} getParentState={this.getParentState.bind(this)} setParentState={this.setParentState.bind(this)} storeData={data}/>
		</li>;
		}
	}
	
	componentDidUpdate(prevProps, prevState) {
		this.ACCOUNTSLIST = this.getParentState('accountslist');
		this.STORESLIST = this.getParentState('storeslist');
		
		if(this.getParentState('needsoftrefresh') === true) {
			
			if(this.type === 'stores') {
				this.SoftRefresh(this.STORESLIST);
			}
			else if(this.type === 'accounts') {
				
				//console.log('THIS ACCOUNTSLIST === ',this.ACCOUNTSLIST)
				
				this.SoftRefresh(this.ACCOUNTSLIST);
			}
			
			this.setParentState('needsoftrefresh',false);
		}
	}
	
	HardRefresh() {
			if(this.getParentState('toDo') != 'createaccount' && this.getParentState('toDo') != null) {
				this.setParentState('toDo',null);
			}
			if(this.getParentState('curAccount') != null) {
				this.setParentState('curAccount',null);
			}
			
			

			this.Fetch(this.type);
	}
	
	SoftRefresh(target) {
		if(IsJsonString(target)) {		
			if(this.getParentState('toDo') != 'createaccount' && this.getParentState('toDo') != null) {
				this.setParentState('toDo',null);
			}
			
			if(this.getParentState('curAccount') != null) {
				this.setParentState('curAccount',null);
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
					<label htmlFor="searchaccount">Search</label>
					<input disabled={true} onChange={(e) => this.SearchAccounts(e.target.value)} type="text" id="searchaccount" name="searchaccount"/>
					
					<button onClick={() => this.HardRefresh()} style={{marginLeft:"10px", marginTop:"10px"}}>Refresh</button>
					
				</div>
				<nav>
					<ul>
						{this.state.ListItems.length > 0 ? this.state.ListItems : "None"}
					</ul>
				</nav>
			</div>
		);
	}
}