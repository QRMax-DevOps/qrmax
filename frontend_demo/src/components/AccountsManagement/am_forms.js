/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, {useState} from 'react';

import { 

	RunFetch_CreateStore, RunFetch_DeleteStore, RunFetch_CreateStoreAccount,
	RunFetch_DeleteStoreAccount, RunFetch_UpdateStoreAccount

} from '../../services/middleware/accounts_mw';

import StoresEditor from "./elements/am_storeseditor";
import PasswordResetScreen from"./elements/am_passwordreset_screen";

import ResponsiveInputField from "./elements/am_forms_smart_input";
import LockedInputField from "./elements/am_forms_locked_input";
import StoresInputField from "./elements/am_forms_stores_input";
import PasswordResetField from "./elements/am_forms_passwordreset_field";

import "./am_style.css";


// **************************************************************************************************
// **************************************************************************************************


function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function IsJsonString(str) {
    try { JSON.parse(str); }
	catch (e) { return false; }
    return true;
}

/*//Deprecated
 *function isPositiveIntegerString(str) {
 *  if (typeof str !== 'string') {
 *    return false;
 *  }
 *
 *  const num = Number(str);
 *
 *  if (Number.isInteger(num) && num > 0) {
 *    return true;
 *  }
 *
 *  return false;
 *}
 */

/*//Deprecated
 *function verifyID(value) {
 *	if(isEmptyOrSpaces(value)) //if empty, null or whitespace
 *	{ return ([false, "Required field."]); }
 *	else if(!isPositiveIntegerString(value)) //if not a positive integer
 *	{ return ([false, "Field must contain a positive integer"]); }
 *	else
 *	{ return ([true, ""]); }
 *}
 */

/*//Deprecated
 *function verifyName(value) {
 *	if(isEmptyOrSpaces(value))
 *	{ return ([false, "Required field."]); }
 *	else
 *	{ return ([true, ""]); }
 *}
 */

/*//Deprecated
 *function verifyStoresList(value) {
 *	if (isEmptyOrSpaces(value))
 *	{ return ([true, "Not required field, but is suggested.", "orange"]); }
 *	else if(IsJsonString(value))
 *	{ return ([true, ""]); }
 *	else
 *	{ return ([false, "Data must be in \"stores list\" JSON format.", "red"]); }
 *}
 */
 
/*//Deprecated
 *function verifyPassword(value) {
 *	if(isEmptyOrSpaces(value))
 *	{ return ([false, "Required field."]); }
 *	else
 *	{ return ([true, ""]); }
 *}
 */

function HandleAccount(type, global, data) {
	var response = [null,null];
	//console.log("HandleAccount", type, global.apiURL, global.isCompany, global.userID, data);
	
	switch(type.toLowerCase()) {
		case 'create': 
			RunFetch_CreateStoreAccount(global.apiURL, global.isCompany, global.userID, data.company, data.username, data.stores, data.password, response);
			
			//loop until response
			
			
			var stopwatch = {eclapsed: 0};
			var me = this;
			
			var interval = setInterval(function() {
				stopwatch.eclapsed++;
				
				if(response[0] !== null) {
					clearInterval(interval);
					
					//Good response (account created)
					if(response[0] === true) {
						const oldAccount = {company:global.userID, username:data.username, stores:null};
						const newAccount = {company:global.userID, username:data.username, stores:data.stores, password:data.password};
						
						//Updating the stores field, as the account creation request (due to backend limitations) does not create the stores list.
						RunFetch_UpdateStoreAccount(global.apiURL, global.isCompany, global.userID, oldAccount, newAccount, response);
					}
				}
				//timeout after 12 seconds
				if(stopwatch.eclapsed === 64) {
					console.log("While waiting for account creation response: Fetch-loop timeout!");
					clearInterval(interval);
				}
			}, 500);
			
			break;
		case 'delete': RunFetch_DeleteStoreAccount(global.apiURL, global.isCompany, global.userID, data.company, data.username, response); break;
		case 'modify': 
			if(IsJsonString(data.newAccount.stores)) {
				data.newAccount.stores = JSON.parse(data.newAccount.stores);
				RunFetch_UpdateStoreAccount(global.apiURL, global.isCompany, global.userID, data.oldAccount, data.newAccount, response);
			}
			else {
				alert("Modify account request rejected! \"Store/s\" field does not contain valid json.");
			}
			break;
		default: 
			console.log("Error. In function Handle Account - Switch case defaulted due to unrecognised \"type\" ");
			break;
	}
	
}

export function ErrorOccured(props) {
	return (
		<p>An error has occured. Reason:{props.reason}</p>
	);
}

function doErrorCheck(arr) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] === true) {
			return true;
		}
	}
	return false;
}


//export async function RunFetch_DeleteStore( url, isCompany, data, global) {

function HandleStore(type, global, data) {
	var response = [null,null];
	switch(type.toLowerCase()) {
		case 'create': RunFetch_CreateStore(global.apiURL, global.isCompany, global.userID, data, response); break;
		case 'delete': RunFetch_DeleteStore(global.apiURL, global.isCompany, global.userID, data, response); break;
		case 'modify':
			//RunFetch_UpdateStore(global.apiURL, global.isCompany, global.userID, data.oldStore, data.newStore, response);
			alert("Rejection: Store modification is currently unsupported by the API.\n\nInstead, please delete the store and re-create it with the desired data.");
			break;
		default:
			console.log("Error. In function Handle Account - Switch case defaulted due to unrecognised \"type\" ");
			break;
	}
}




/* STORE MODIFICATION FORM ..................................................................
 * ..................................................................................... */
export function ModifyStoreForm(props) {
	const global = props.global;
	const oldStore = {ID:props.store.ID,store:props.store.store,company:global.companyName}
	
	/*
	const handleSubmission = (e) => {
		HandleStore('create', global, {ID:id, companyName:global.companyName, store});
	}
	*/
	
	const [id, setId] = useState(oldStore.ID); 
	const [idError, setIdError] = useState([null,""]);
	
	const [store, setStoreName] = useState(oldStore.store);
	const [storeError, setStoreNameError] = useState([null,""]);
	
	const [company, setCompany] = useState(global.companyName);
	const [companyError, setCompanyError] = useState([null,""]);
	
	var submissionDisabled = doErrorCheck([storeError]);
	
	return (
		<form className="FormBase" style={{height:"100%"}}>
	
		<div className="FormHeader">
			<div className="FormTitle"><b>UPDATE</b> -> Store Record</div>
		</div>
		<div className="FormInputContainer" style={{justifyContent:"flex-start"}}>
			<div style={{width:"875px"}}>
				<LockedInputField title="UID" setErrorPresent={setIdError} inputValue={id}/>
				<LockedInputField title="Company" setErrorPresent={setCompanyError} inputValue={company}/>
				<ResponsiveInputField title="Store name"	setErrorPresent={setStoreNameError}  maxChars="64" minChars="4" inputValue={store} setFormValue={setStoreName}/>
			</div>
		</div>
		<div className="FormButtonsContainer">
			<button type="button" className="EditorMainButton GreenButton" onClick={()=>HandleStore('modify', global, {oldStore, newStore:{ID:id, store:store, company:company}})}>Submit Changes</button>
			<button type="button" className="EditorMainButton GreyButton" onClick={() => props.setParentState('currentForm', null)}>Close</button>
			<button type="button"className="EditorMainButton RedButton" onClick={()=>HandleStore('delete', global, oldStore)}>Delete Store</button>
		</div>
		</form>
	);
}




/* STORE CREATION FORM ..................................................................
 * ..................................................................................... */
 
export function CreateStoreForm(props) {
	const global = props.global;
	
	const handleSubmission = (e) => {
			HandleStore('create', global, {companyName:global.companyName, store});
	}
	
	const [store, setStoreName] = useState("");
	const [storeError, setStoreNameError] = useState([null,""]);
	
	const [company, setCompany] = useState(global.companyName);
	const [companyError, setCompanyError] = useState([null,""]);
	
	var submissionDisabled = doErrorCheck([storeError]);
	
	return (
		<form className="FormBase" style={{height:"100%"}}>
	
		<div className="FormHeader">
			<div className="FormTitle"><b>CREATE</b> -> Store Record</div>
		</div>
		<div className="FormInputContainer" style={{justifyContent:"flex-start"}}>
			<div style={{width:"875px"}}>
				<LockedInputField title="Company" setErrorPresent={setCompanyError} inputValue={company}/>
				<ResponsiveInputField title="Store name"	setErrorPresent={setStoreNameError}  maxChars="64" minChars="4" inputValue={store} setFormValue={setStoreName}/>
			</div>
			
		</div>
		
		<div className="FormButtonsContainer">
			<button type="button" className="EditorMainButton GreenButton" disabled={submissionDisabled} onClick={(e)=>handleSubmission(e)}>Submit</button>
			<button type="button" className="EditorMainButton GreyButton" onClick={() => props.setParentState('currentForm', null)}>Close</button>
		</div>
		
		</form>
	);
}




/* ACCOUNT MODIFICATION FORM ..................................................................
 * ..................................................................................... */

export function ModifyAccountForm(props) {
	const global = props.global;
	const companyStoresList = props.companyStoresList;
	const oldAccount = {company:global.userID, username:props.account.username, stores:JSON.stringify(props.account.stores)}
	
	console.log("companyStoresList===",companyStoresList);
	
	const handleSubmission = (e) =>
		{ HandleAccount('modify', global, {oldAccount, newAccount:{company:oldAccount.company, username, stores, password}}); }
	
	const [screen, setScreen] = useState('main');
	const changeScreen = (value) => { setScreen(value); }

	const [company, setCompany] = useState(sessionStorage.companyName);
	const [companyError, setCompanyError] = useState(false);
	
	const [username, setUsername] = useState(oldAccount.username);
	const [usernameError, setUsernameError] = useState(false);
	
	const [stores, setStores] = useState(oldAccount.stores);
	const [storesError, setStoresError] = useState(false);
	
	const [password, setPassword] = useState("");
	const [passwordChanged, setPasswordChanged] = useState([null,""]);
	const [passwordError, setPasswordError] = useState(false);
	const changePassword = (value) => {
		setPassword(value);
		setPasswordChanged(true);
	}
	
	
	if(screen==='main') {
		var submissionDisabled = doErrorCheck([companyError,usernameError,storesError,passwordError]);
		
		return (
			<form className="FormBase" style={{height:"100%"}}>
		
			<div className="FormHeader">
				<div className="FormTitle" ><b>UPDATE</b> -> Store Account</div>
			</div>
			<div className="FormInputContainer" style={{justifyContent:"flex-start"}}>
				<div style={{width:"875px"}}>
					<LockedInputField title="Company" setErrorPresent={setCompanyError} inputValue={company}/>
					<ResponsiveInputField title="Username"setErrorPresent={setUsernameError}  maxChars="64" minChars="4" inputValue={username} setFormValue={setUsername}/>
					<StoresInputField title="Store/s" setErrorPresent={setStoresError} setScreen={changeScreen} inputValue={stores} setFormValue={setStores}/>
					<PasswordResetField title="Password" setScreen={changeScreen} passwordChanged={passwordChanged}/>
				</div>
			</div>
			
			<div className="FormButtonsContainer">
				<button type="button" className="EditorMainButton GreenButton" disabled={submissionDisabled} onClick={(e)=>handleSubmission(e)}>Submit changes</button>
				<button type="button" className="EditorMainButton GreyButton" onClick={() => props.setParentState('currentForm', null)}>Close</button>
				<button type="button" className="EditorMainButton RedButton" style={{marginLeft:"10px"}} onClick={()=>HandleAccount('delete', global, {company:oldAccount.company, username:oldAccount.username})}>Delete account</button>
			</div>
			
			</form>
			
		);
	}
	else if(screen==='editor') {
		return ( <StoresEditor setScreen={changeScreen} modType="UPDATE" company_storesRecords={JSON.parse(companyStoresList)} store_storesRecords={JSON.parse(stores)} setStores={setStores}/> );
	}
	else if(screen==='passwordreset') {
		return ( <PasswordResetScreen modType="UPDATE" setScreen={changeScreen} setPassword={changePassword}/> );
	}
}




/* ACCOUNT CREATION FORM ..................................................................
 * ..................................................................................... */
export function CreateAccountForm(props) {
	const global = props.global;
	const companyStoresList = props.companyStoresList;
	
	const handleSubmission = (e) => {
			HandleAccount('create', global, {company:global.userID, username, stores, password})
	}
	
	const [screen, setScreen] = useState('main');
	const changeScreen = (value) => { setScreen(value); }

	const [company, setCompany] = useState(sessionStorage.companyName);
	const [companyError, setCompanyError] = useState(false);
	
	const [username, setUsername] = useState('');
	const [usernameError, setUsernameError] = useState(false);
	
	const [stores, setStores] = useState('[]');
	const [storesError, setStoresError] = useState(false);
	
	const [password, setPassword] = useState("");
	const [passwordChanged, setPasswordChanged] = useState([null,""]);
	const [passwordError, setPasswordError] = useState(false);
	const changePassword = (value) => {
		setPassword(value);
		setPasswordChanged(true);
	}
	
	
	if(screen==='main') {
		var submissionDisabled = doErrorCheck([companyError,usernameError,storesError,passwordError]);
		
		return (
			<form className="FormBase" style={{height:"100%"}}>
		
			<div className="FormHeader">
				<div className="FormTitle"><b>CREATE</b> -> Store Account</div>
			</div>
			<div className="FormInputContainer" style={{justifyContent:"flex-start"}}>
				<div style={{width:"875px"}}>
					<LockedInputField title="Company" setErrorPresent={setCompanyError} inputValue={company}/>
					<ResponsiveInputField title="Username"setErrorPresent={setUsernameError}  maxChars="64" minChars="4" inputValue={username} setFormValue={setUsername}/>
					<StoresInputField title="Store/s" setErrorPresent={setStoresError} setScreen={changeScreen} inputValue={stores} setFormValue={setStores}/>
					<PasswordResetField title="Password" setErrorPresent={setPasswordError} setScreen={changeScreen} passwordChanged={passwordChanged} required={true}/>
				</div>
			</div>
			
			<div className="FormButtonsContainer">
				<button type="button" className="EditorMainButton GreenButton" disabled={submissionDisabled} onClick={(e)=>handleSubmission(e)}>Submit</button>
				<button type="button" className="EditorMainButton GreyButton" onClick={() => props.setParentState('currentForm', null)}>Close</button>
			</div>
			</form>
		);
	}
	else if(screen==='editor') {
		return ( <StoresEditor modType="CREATE" setScreen={changeScreen} company_storesRecords={JSON.parse(companyStoresList)} store_storesRecords={JSON.parse(stores)} setStores={setStores}/> );
	}
	else if(screen==='passwordreset') {
		return ( <PasswordResetScreen modType="CREATE" setScreen={changeScreen} setPassword={changePassword}/> );
	}
}
