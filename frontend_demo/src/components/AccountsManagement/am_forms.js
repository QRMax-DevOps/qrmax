import React, { useState, Component } from 'react';
import {Account} from './am_account';

import { 
	RunFetch_CreateStore, RunFetch_DeleteStore, RunFetch_UpdateStore,
	RunFetch_CreateStoreAccount, RunFetch_DeleteStoreAccount, RunFetch_UpdateStoreAccount
} from '../../services/am_middleware';


// **************************************************************************************************
// **************************************************************************************************


function IsJsonString(str) {
    try { JSON.parse(str); }
	catch (e) { return false; }
    return true;
}

function HandleAccount(type, global, data) {
	var response = [null,null];
	
	console.log("HandleAccount", type, global.apiURL, global.isCompany, global.userID, data);
	
	switch(type.toLowerCase()) {
		case 'create': 
			if(IsJsonString(data.stores)) {
				data.stores = JSON.parse(data.stores);
				//data.newAccount.stores = JSON.stringify(data.newAccount.stores);
				RunFetch_CreateStoreAccount(global.apiURL, global.isCompany, global.userID, data.company, data.username, data.stores, data.password, response);
			}
			else {
				alert("Modify account request rejected! \"Store/s\" field does not contain valid json.");
			}
			break;
			
		case 'delete': RunFetch_DeleteStoreAccount(global.apiURL, global.isCompany, global.userID, data.company, data.username, response); break;
		case 'modify': 
			if(IsJsonString(data.newAccount.stores)) {
				data.newAccount.stores = JSON.parse(data.newAccount.stores);
				//data.newAccount.stores = JSON.stringify(data.newAccount.stores);
				RunFetch_UpdateStoreAccount(global.apiURL, global.isCompany, global.userID, data.oldAccount, data.newAccount, response);
			}
			else {
				alert("Modify account request rejected! \"Store/s\" field does not contain valid json.");
			}
			break;
	}
	
}


//export async function RunFetch_DeleteStore( url, isCompany, data, global) {

function HandleStore(type, global, data) {
	
	console.log("HandleStore", type, global.apiURL, global.isCompany, global.userID, data);
	
	var response = [null,null];
	switch(type.toLowerCase()) {
		case 'create': RunFetch_CreateStore(global.apiURL, global.isCompany, global.userID, data, response); break;
		case 'delete': RunFetch_DeleteStore(global.apiURL, global.isCompany, global.userID, data, response); break;
		case 'modify':
			//RunFetch_UpdateStore(global.apiURL, global.isCompany, global.userID, data.oldStore, data.newStore, response);
			alert("Rejection: Store modification is currently unsupported by the API.\n\nInstead, please delete the store and re-create it with the desired data.");
			break;
	}
}



export function ModifyStoreForm(props) {
	const global = props.global;

	const oldStore = {ID:props.store.ID,store:props.store.store,company:global.companyName}
	
	const id = oldStore.ID;
	const [companyName, setCompany] = useState(global.companyName);
	const [storeName, setStore] = useState(oldStore.store);
	const [password, setPassword] = useState('');
	
	return (
		<form style={{height:"100%"}}>
		<div id="CreateAccountFormContainer">
			<div className="InputContainer">
				<label>UID</label>
				<input
					type="text" 
					value={id}
					readOnly
				/>
			</div>
			
			<div className="InputContainer">
				<label>Company</label>
				<input
					type="text" 
					value={companyName}
					onChange={(e) => setCompany(e.target.value)}
					readOnly
					disabled={true}
				/>
			</div>
			
			<div className="InputContainer">
				<label>Store</label>
				<input
					type="text" 
					value={storeName}
					onChange={(e) => setStore(e.target.value)}
				/>
			</div>
			<div className="SubmitButtonContainer">
				<button type="button" onClick={()=>HandleStore('modify', global, {oldStore, newStore:{ID:id, store:storeName, company:companyName}})}>Submit Changes</button>
				<button type="button" style={{marginLeft:"10px"}} onClick={()=>HandleStore('delete', global, oldStore)}>Delete Store</button>
			</div>
		</div>
		</form>
	)
}

export function CreateStoreForm(props) {
	const global = props.global;
	
	
	console.log(global);
	
	const [id, setId] = useState(""); 
	const [store, setStoreName] = useState("");
	const [company, setCompany] = useState(global.companyName);
	
	
	return (
		
		<form style={{height:"100%"}}>
		<div id="CreateAccountFormContainer">
			{ !global.isCompany &&
			<div className="InputContainer">
				<label>ID</label>
				<input
					type="text" 
					value={id}
					onChange={(e) => setId(e.target.value)}
				/>
			</div>
			}
			<div className="InputContainer">
				<label>Company</label>
				<input
					type="text" 
					value={company}
					onChange={(e) => setCompany(e.target.value)}
					readOnly
					disabled={true}
				/>
			</div>
			<div className="InputContainer">
				<label>Store name</label>
				<input
					type="text" 
					value={store}
					onChange={(e) => setStoreName(e.target.value)}
				/>
			</div>
			<div className="SubmitButtonContainer">
				<button type="button" onClick={()=>HandleStore('create', global, {ID:id, companyName:global.companyName, store})}>Submit</button>
			</div>
		</div>

		</form>
	)
}

function visualiseStores(json) {
	
}

function processStores(str) {
	
}

export function ModifyAccountForm(props) {
	const global = props.global;
	
	console.log(props)
	
	const oldAccount = {company:global.userID, username:props.account.username, stores:JSON.stringify(props.account.stores)}

	const [company, setCompany] = useState(global.companyName);
	const [username, setUsername] = useState(oldAccount.username);
	const [stores, setStores] = useState(oldAccount.stores);
	const [password, setPassword] = useState("");
	
	console.log(props);
	
	return (
		<form style={{height:"100%"}}>
		<div id="CreateAccountFormContainer">
			<div className="InputContainer">
				<label>Company</label>
				<input
					type="text" 
					value={company}
					onChange={(e) => setCompany(e.target.value)}
					disabled={true}
					readOnly
				/>
			</div>
			<div className="InputContainer">
				<label>Username</label>
				<input
					type="text" 
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				
			</div>
			<div className="InputContainer">
				<label>Store/s</label>
				<input
					type="text" 
					value={stores}
					onChange={(e) => setStores(e.target.value)}
				/>
				
			</div>
			<div className="InputContainer">
				<label>New Password</label>
				<input
					type="text" 
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			
			<div className="SubmitButtonContainer">
				<button type="button" onClick={()=>HandleAccount('modify', global, {oldAccount, newAccount:{company:oldAccount.company, username, stores, password}})}>Submit changes</button>
				<button type="button" style={{marginLeft:"10px"}} onClick={()=>HandleAccount('delete', global, {company:oldAccount.company, username:oldAccount.username})}>Delete account</button>
			</div>
		</div>
		</form>

	)
}

export function CreateAccountForm(props) {
	const global = props.global;
	
	//const [company, setCompany] = useState(global.companyName);
	
	const [company, setCompany] = useState(global.companyName);
	const [username, setUsername] = useState("");
	const [stores, setStores] = useState("");
	const [password, setPassword] = useState("");
	
	return (
		
		<form style={{height:"100%"}}>
		<div id="CreateAccountFormContainer" style={{height:"100%"}}>
			<div className="InputContainer">
				<label>Company</label>
				<input
					type="text" 
					value={company}
					onChange={(e) => setCompany(e.target.value)}
					disabled={true}
					readOnly
				/>
			</div>

			
			<div className="InputContainer">
				<label>Username</label>
				<input
					type="text" 
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			
			<div className="InputContainer">
				<label>Store/s</label>
				<input
					type="text" 
					value={stores}
					onChange={(e) => setStores(e.target.value)}
				/>
			</div>
			
			<div className="InputContainer">
				<label>Password</label>
				<input
					type="text" 
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<div className="SubmitButtonContainer">
			<button type="button" onClick={()=>HandleAccount('create', global, {company:global.userID, username, stores, password})}>Create Account</button>
			</div>
		</div>

		</form>
	)
}