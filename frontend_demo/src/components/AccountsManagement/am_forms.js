import React, { useState, Component } from 'react';
import {Account} from './am_account';

import { 
	RunFetch_CreateStore, RunFetch_DeleteStore, RunFetch_UpdateStore,
	RunFetch_CreateStoreAccount, RunFetch_DeleteStoreAccount, RunFetch_UpdateStoreAccount
} from '../../services/middleware/accounts_mw';


// **************************************************************************************************
// **************************************************************************************************

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function isPositiveIntegerString(str) {
  if (typeof str !== 'string') {
    return false;
  }

  const num = Number(str);

  if (Number.isInteger(num) && num > 0) {
    return true;
  }

  return false;
}

function IsJsonString(str) {
    try { JSON.parse(str); }
	catch (e) { return false; }
    return true;
}

function verifyID(value) {
	if(isEmptyOrSpaces(value)) //if empty, null or whitespace
	{ return ([false, "Required field."]); }
	else if(!isPositiveIntegerString(value)) //if not a positive integer
	{ return ([false, "Field must contain a positive integer"]); }
	else
	{ return ([true, ""]); }
}

function verifyName(value) {
	if(isEmptyOrSpaces(value))
	{ return ([false, "Required field."]); }
	else
	{ return ([true, ""]); }
}

function verifyStoresList(value) {
	if (isEmptyOrSpaces(value))
	{ return ([true, "Not required field, but is suggested.", "orange"]); }
	else if(IsJsonString(value))
	{ return ([true, ""]); }
	else
	{ return ([false, "Data must be in \"stores list\" JSON format.", "red"]); }
}

function verifyPassword(value) {
	if(isEmptyOrSpaces(value))
	{ return ([false, "Required field."]); }
	else
	{ return ([true, ""]); }
}

function HandleAccount(type, global, data) {
	var response = [null,null];
	
	console.log("HandleAccount", type, global.apiURL, global.isCompany, global.userID, data);
	
	switch(type.toLowerCase()) {
		case 'create': 
			RunFetch_CreateStoreAccount(global.apiURL, global.isCompany, global.userID, data.company, data.username, data.stores, data.password, response);
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
	
	console.log(typeof global.isCompany)
	
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




/* STORE MODIFICATION FORM ..................................................................
 * ..................................................................................... */
export function ModifyStoreForm(props) {
	const global = props.global;
	const oldStore = {ID:props.store.ID,store:props.store.store,company:global.companyName}
	
	const validateAllFields = () => {
		
		var storeNameState = verifyName(storeName);
		setStoreNameError(storeNameState);
		
		var idSate = verifyID(id);
		setIdError(idSate);
		
		/* ID and company not included. Companies should not be able to give stores to other companies.
		 * ID is generated automatically by the database and cannot be modified.*/
		if(storeNameState[0] === true)
		{ return true; }
		else
		{ return false; }
	}
	
	const handleChange = (e) => {
		switch(e.target.id) {
			case "storename":
				setStoreName(e.target.value);
				setStoreNameError(verifyName(e.target.value));
				break;
		}
		
	}
	
	const handleSubmission = (e) => {
		if (validateAllFields()===true) {
			HandleStore('create', global, {ID:id, companyName:global.companyName, storeName});
		} else {
			//
		}
	}
	
	const [id, setId] = useState(oldStore.ID); 
	const [idError, setIdError] = useState([null,""]);
	
	const [storeName, setStoreName] = useState(oldStore.store);
	const [storeNameError, setStoreNameError] = useState([null,""]);
	
	const [companyName, setCompany] = useState(global.companyName);
	const [companyNameError, setCompanyNameError] = useState([null,""]);
	
	return (
		<form style={{height:"100%"}}>
		<div id="CreateAccountFormContainer">
			<div className="InputContainer">
				<label>UID</label>
				<input
					type="text" 
					value={id}
					readOnly
					disabled
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
				<div>
					<input
						id="storename"
						type="text" 
						value={storeName}
						onChange={(e) => handleChange(e)}
					/>
					<p style={{height:"30px", margin:"0", padding:"0", color:"red", fontSize:"14px", textAlign:"left"}}>{storeNameError[1]}</p>
				</div>
			</div>
			<div className="SubmitButtonContainer">
				<button type="button" onClick={()=>HandleStore('modify', global, {oldStore, newStore:{ID:id, store:storeName, company:companyName}})}>Submit Changes</button>
				<button type="button" style={{marginLeft:"10px"}} onClick={()=>HandleStore('delete', global, oldStore)}>Delete Store</button>
			</div>
		</div>
		</form>
	)
}




/* STORE CREATION FORM ..................................................................
 * ..................................................................................... */
 
 //Fully functional, but deprecated.
 /*
	{ !global.isCompany &&
	<div className="InputContainer">
		<label>ID</label>
		<div>
			<input
				id="storeid"
				type="text" 
				value={id}
				onChange={(e) => handleChange(e)}
			/>
			<p style={{height:"30px", margin:"0", padding:"0", color:"red", fontSize:"14px", textAlign:"left"}}>{idError[1]}</p>
		</div>
	</div>
	}
 */
 
export function CreateStoreForm(props) {
	const global = props.global;
	
	
	const validateAllFields = () => {
		var storeNameState = verifyName(store);
		setStoreNameError(storeNameState);
		
		var idSate = verifyID(id);
		setIdError(idSate);
		
		/* Company account creates a whole new store and the backend will automatically generate
		 * a new ID for it, therefor the ID field is not checked since it is ignored anyway.*/
		if(global.isCompany) {
			if(storeNameState[0] === true)
			{ return true; }
			else
			{ return false; }
		}
		
		/* Store accounts don't "create" a new store, rather they add an existing one to
		 * their records, therefor an ID is required to find the existing store in the database.*/
		else {
			if(storeNameState[0] === true && idSate[0] === true)
			{ return true; }
			else
			{ return false; }
		}
	}
	
	const handleChange = (e) => {
		switch(e.target.id) {
			case "storename":
				setStoreName(e.target.value);
				setStoreNameError(verifyName(e.target.value));
				break;
			case "storeid": 
				setId(e.target.value);
				setIdError(verifyID(e.target.value));
		}
		
	}
	
	const handleSubmission = (e) => {
		if (validateAllFields()===true) {
			HandleStore('create', global, {ID:id, companyName:global.companyName, store});
		} else {
			//
		}
	}
	
	
	console.log(global);
	
	const [id, setId] = useState(""); 
	const [idError, setIdError] = useState([null,""]);
	
	const [store, setStoreName] = useState("");
	const [storeError, setStoreNameError] = useState([null,""]);
	
	const [company, setCompany] = useState(global.companyName);
	const [companyError, setCompanyError] = useState([null,""]);
	
	return (
		
		<form style={{height:"100%"}}>
		<div id="CreateAccountFormContainer">
			<div className="InputContainer">
				<label>Company</label>
				<input
					id="company"
					type="text" 
					value={company}
					onChange={(e) => setCompany(e.target.value)}
					readOnly
					disabled
				/>
			</div>

			<div className="InputContainer">
				<label>Store name</label>
				<div>
					<input
						id="storename"
						type="text" 
						value={store}
						onChange={(e) => handleChange(e)}
					/>
					<p style={{height:"30px", margin:"0", padding:"0", color:"red", fontSize:"14px", textAlign:"left"}}>{storeError[1]}</p>
				</div>
			</div>
			<div className="SubmitButtonContainer">
				<button type="button" onClick={(e)=>handleSubmission(e)}>Submit</button>
			</div>
		</div>

		</form>
	)
}




/* ACCOUNT MODIFICATION FORM ..................................................................
 * ..................................................................................... */

export function ModifyAccountForm(props) {
	const global = props.global;
	const oldAccount = {company:global.userID, username:props.account.username, stores:JSON.stringify(props.account.stores)}

	const validateAllFields = () => {
		var nameState = verifyName(username);
		var storesState = verifyStoresList(stores);
		var passwordState = verifyPassword(password);
		
		setUsernameError(nameState);
		setStoresError(storesState);
		setPasswordError(passwordState);
		
		//console.log(nameState[0], storesState[0], passwordState[0])
		
		if(nameState[0] === true && storesState[0] === true && passwordState[0] === true)
		{ return true; }
		else
		{ return false; }
		
	}
	
	const handleChange = (e) => {
		
		console.log("handling change for:",e);
		
		switch(e.target.id) {
			case "username":
				setUsername(e.target.value);
				setUsernameError(verifyName(e.target.value));
				
				break;
			case "stores":
				setStores(e.target.value);
				setStoresError(verifyStoresList(e.target.value));
				break;
			case "password":
				setPassword(e.target.value);
				setPasswordError(verifyPassword(e.target.value));
				break;
		}
		
	}
	
	const handleSubmission = (e) => {
		if (validateAllFields()===true) {
			HandleAccount('modify', global, {oldAccount, newAccount:{company:oldAccount.company, username, stores, password}})
		} else {
			//
		}
	}
	
	var initialusername = oldAccount.username;

	const [company, setCompany] = useState(global.companyName);
	
	const [companyError, setCompanyError] = useState([null,""]);
	
	const [username, setUsername] = useState(oldAccount.username);
	
	const [usernameError, setUsernameError] = useState([null,""]);
	
	const [stores, setStores] = useState(oldAccount.stores);
	const [storesError, setStoresError] = useState([null,""]);
	
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState([null,""]);
	
	console.log(props);
	
	return (
		<form style={{height:"100%"}}>
		<div id="CreateAccountFormContainer">
			<div className="InputContainer">
				<label>Company</label>
				<div>
					<input
						id="company"
						type="text" 
						value={company}
						onChange={(e) => setCompany(e.target.value)}
						disabled={true}
						readOnly
					/>
					<p style={{height:"30px", margin:"0", padding:"0", color:"black", fontSize:"14px", textAlign:"left"}}></p>
				</div>
			</div>
			<div className="InputContainer">
				<label>Username</label>
				<div>
					<input
						id="username"
						type="text" 
						value={username}
						onChange={e => handleChange(e)}
					/>
					<p style={{height:"30px", margin:"0", padding:"0", color:"red", fontSize:"14px", textAlign:"left"}}>{usernameError[1]}</p>
				</div>
			</div>
			<div className="InputContainer">
				<label>Store/s</label>
				<div>
					<input
						id="stores"
						type="text" 
						value={stores}
						onChange={(e) => handleChange(e)}
					/>
					<p style={{height:"30px", margin:"0", padding:"0", color:storesError[2], fontSize:"14px", textAlign:"left"}}>{storesError[1]}</p>
				</div>
				
			</div>
			<div className="InputContainer">
				<label>New Password</label>
				<div>
					<input
						id="password"
						type="text" 
						value={password}
						onChange={(e) => handleChange(e)}
					/>
					<p style={{height:"30px", margin:"0", padding:"0", color:"red", fontSize:"14px", textAlign:"left"}}>{passwordError[1]}</p>
				</div>
			</div>
			
			<div className="SubmitButtonContainer">
				<button type="button" onClick={(e)=>handleSubmission(e)}>Submit changes</button>
				<button type="button" style={{marginLeft:"10px"}} onClick={()=>HandleAccount('delete', global, {company:oldAccount.company, username:oldAccount.username})}>Delete account</button>
			</div>
		</div>
		</form>

	)
}
		//data.stores = JSON.parse(data.stores);
		//data.newAccount.stores = JSON.stringify(data.newAccount.stores)




/* ACCOUNT CREATION FORM ..................................................................
 * ..................................................................................... */
export function CreateAccountForm(props) {
	const global = props.global;
	
	const validateAllFields = () => {
		var nameState = verifyName(username);
		var storesState = verifyStoresList(stores);
		var passwordState = verifyPassword(password);
		
		setUsernameError(nameState);
		setStoresError(storesState);
		setPasswordError(passwordState);
		
		//console.log(nameState[0], storesState[0], passwordState[0])
		
		if(nameState[0] === true && storesState[0] === true && passwordState[0] === true)
		{ return true; }
		else
		{ return false; }
	}
	
	const handleChange = (e) => {
		switch(e.target.id) {
			case "username":
				setUsername(e.target.value);
				setUsernameError(verifyName(e.target.value));
				break;
			case "stores":
				setStores(e.target.value);
				setStoresError(verifyStoresList(e.target.value));
				break;
			case "password":
				setPassword(e.target.value);
				setPasswordError(verifyPassword(e.target.value));
				break;
		}
	}
	
	const handleSubmission = (e) => {
		console.log("handling submission 1");
		e.preventDefault();
		console.log("handling submission 2");
		
		if (validateAllFields()===true) {
			console.log("handling submission 3")
			HandleAccount('create', global, {company:global.userID, username, stores, password})
		} else {
			//
		}
	}
	
	//const [company, setCompany] = useState(global.companyName);
	const [company, setCompany] = useState(global.companyName);
	const [companyError, setCompanyError] = useState([null,""]);
	
	const [username, setUsername] = useState("");
	const [usernameError, setUsernameError] = useState([null,""]);
	
	const [stores, setStores] = useState("");
	const [storesError, setStoresError] = useState([null,""]);
	
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState([null,""]);
	
	return (
		
		<form style={{height:"100%"}}>
		<div id="CreateAccountFormContainer" style={{height:"100%"}}>
			<div className="InputContainer">
				<label>Company</label>
				<div>
					<input
						id="company"
						type="text" 
						autoComplete="off"
						value={company}
						onChange={(e) => setCompany(e.target.value)}
						disabled={true}
						readOnly
					/>
					<p style={{height:"30px", margin:"0", padding:"0", color:"black", fontSize:"14px", textAlign:"left"}}></p>
				</div>
			</div>

			
			<div className="InputContainer">
				<label>Username</label>
				<div>
					<input
						id="username"
						type="text" 
						autoComplete="off"
						value={username}
						onChange={(e) => handleChange(e)}
					/>
					<p style={{height:"30px", margin:"0", padding:"0", color:"red", fontSize:"14px", textAlign:"left"}}>{usernameError[1]}</p>
				</div>
			</div>
			
			
			
			<div className="InputContainer">
				<label>Store/s</label>
				<div>
					<input
						id="stores"
						type="text" 
						autoComplete="off"
						value={stores}
						onChange={(e) => handleChange(e)}
					/>
					<p style={{height:"30px", margin:"0", padding:"0", color:storesError[2], fontSize:"14px", textAlign:"left"}}>{storesError[1]}</p>
				</div>
			</div>
			
			<div className="InputContainer">
				<label>Password</label>
				<div>
					<input
						id="password"
						type="password" 
						autoComplete="off"
						value={password}
						onChange={(e) => handleChange(e)}
					/>
					<p style={{height:"30px", margin:"0", padding:"0", color:"red", fontSize:"14px", textAlign:"left"}}>{passwordError[1]}</p>
				</div>
			</div>
			<div className="SubmitButtonContainer">
				<button type="button" onClick={(e)=>handleSubmission(e)}>Create Account</button>
			</div>
		</div>

		</form>
	)
}