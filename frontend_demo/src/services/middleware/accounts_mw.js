/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';


import {log, fetchAPI, getApiURL} from '../core_mw';
import {isEmptyOrSpaces, getDefaultHeaders} from '../utilities/common_util';

// ...................................................................................................
// ...................................................................................................

const DEFAULT_HEADERS = getDefaultHeaders(); //Default headers used by every request in this file.

/*
 * ACCOUNT RETRIEVAL
 *
 *
 *
 *
 */
 export async function RunFetch_GetStores(isCompany, url, id, companyName, global) {
	var endpoint = '';
	var bodyGen = '';
 
	if(isCompany) {
		endpoint = url+'api/v2/Company/Store';
		bodyGen = JSON.stringify({company:id});
	}
	else {
		endpoint = url+'api/v2/Store/Account/storesList';
		bodyGen = JSON.stringify({company:companyName,username:id});
	}
	
	const requestOptions = {
		method: 'POST',
		headers: DEFAULT_HEADERS,
		body: bodyGen
	};
	
	// GET request using fetch with basic error handling
	const asyncFetch = await fetchAPI(endpoint,requestOptions);
	
	global[0] = asyncFetch[0];
	global[1] = asyncFetch[1];
	
}

 export async function RunFetch_GetAccounts(isCompany, url, id, companyName, global) {
	if(isCompany) {
		var bodyGen = JSON.stringify({company:id});
		const endpoint = url+'api/v2/Company/Account/AccountList';
		
		const requestOptions = {
			method: 'POST',
			headers: DEFAULT_HEADERS,
			body: bodyGen
		};
		
		// GET request using fetch with basic error handling
		const asyncFetch = await fetchAPI(endpoint,requestOptions);
		
		global[0] = asyncFetch[0];
		global[1] = asyncFetch[1];
	}
	else {
		
		global[0] = false;
		log("\"RunFetch_GetAccounts\" failed conditions: You must be logged in as a company account to access accounts management.");
		global[1] = "You must be logged in as a company account to access accounts management.";
	}
}




/*
 * ACCOUNT CREATION
 *
 *
 *
 *
 */
export async function RunFetch_CreateCompanyAccount(url,newCompanyAccount, global) {
	var body = JSON.stringify ({	
		company		: newCompanyAccount.company,
		password	: newCompanyAccount.password
	});
	return RunFetch_CreateAccount(body, 'companyAccount', global);
}

export async function RunFetch_CreateStoreAccount(url, isCompany, user, companyName, userName, userStores, userPassword, global) {
	console.log("creating store acount w/ ",companyName,userName,userPassword,userStores)

	var betterStores = generateStoresList(userStores);
	
	
	var body = JSON.stringify({
		company		: companyName,
		username	: userName,
		password	: userPassword,
		stores		: betterStores
	});
	return RunFetch_CreateAccount(url, isCompany, body, 'storeAccount', global);
}

export async function RunFetch_CreateStore(url, isCompany, userID, data, global) {
	//console.log("creating store w/ ",data.companyName,data.store)
	
	var body = null;
	
	if(isCompany) {
		body = JSON.stringify ({	
			company		: data.companyName,
			store		: data.store
		});
	}
	else {
		body = JSON.stringify ({	
			company		: data.companyName,
			username	: userID,
			stores		: data.store
		});
	}
	
	return RunFetch_CreateAccount(url, isCompany, body, 'store', global);
}

async function RunFetch_CreateAccount(url, isCompany, bodyGen, type, global) {
		let endpoint=null
		let methodGen=null;

		//console.log('RunFetch_CreateAccount: ',url, isCompany,bod,type);

		switch(type.toLowerCase()){ 
			  case 'companyaccount':	methodGen='PUT';	endpoint=url+'api/v2/Company/Account';		break;
			  case 'storeaccount':		methodGen='PUT';	endpoint=url+'api/v2/Store/Account';		break;
			  case 'store':			
				methodGen='PUT';	
				if(isCompany) {
					endpoint=url+'api/v2/Company/Store';	
				}
				else {
					endpoint=url+'api/v2/Store/Account/StoresList';	
				}
				break;
		}
		
		//Setting parameters for the fetch request.
		const requestOptions = {
			method: methodGen,
			headers: DEFAULT_HEADERS,
			body: bodyGen
		}
		
		//console.log("requestOptions === ",requestOptions)
		//console.log("endpoint === ",endpoint)
		
		// GET request using fetch with basic error handling
		const asyncFetch = await fetchAPI(endpoint,requestOptions);
		
		global[0] = asyncFetch[0];
		global[1] = asyncFetch[1];
}




/*
 * ACCOUNT DELETION
 *
 *
 *
 *
 */
export async function RunFetch_DeleteCompanyAccount(url,account, global) {
	var body = JSON.stringify ({	
		company		: account.company,
	});
	return RunFetch_DeleteAccount(url,'companyaccount',body,global);
}


export async function RunFetch_DeleteStoreAccount( url, isCompany, user, companyName, userName, global) {
	var body = JSON.stringify ({	
		company		: companyName,
		username	: userName
	});
	
	return RunFetch_DeleteAccount(url, isCompany, 'storeaccount',body,global);
}


export async function RunFetch_DeleteStore( url, isCompany, userID, data, global) {
	
	isCompany = (isCompany === "true" || isCompany === true);
	
	
	
	var body = null;
	
	if(isCompany===true) {
		body = JSON.stringify ({	
			company		: data.company,
			store		: data.store
		});
	}
	else {
		body = JSON.stringify ({	
			company		: data.company,
			username	: userID,
			stores		: data.store
		});
	}
	
	
	return RunFetch_DeleteAccount(url, isCompany, 'store',body,global);
}

export async function RunFetch_DeleteAccount(url, isCompany, type, bodyGen, global) {
	let endpoint=null
	let methodGen=null;
		
	switch(type) {
			  case 'companyaccount':
				methodGen='DELETE';
				endpoint=url+'api/v2/Company/Account';
				break;
				
			  case 'storeaccount':
				methodGen='DELETE';
				endpoint=url+'api/v2/Store/Account';
				break;
				
			  case 'store':	
				methodGen='DELETE';
				if(isCompany) {
					endpoint=url+'api/v2/Company/Store';
				} else {
					endpoint=url+'api/v2/Store/Account/storesList';
				}
				break;
	}

	const requestOptions = {
		method: methodGen,
		headers: DEFAULT_HEADERS,
		body: bodyGen
	}
			
	// GET request using fetch with basic error handling
	const asyncFetch = await fetchAPI(endpoint,requestOptions);
		
	global[0] = asyncFetch[0];
	global[1] = asyncFetch[1];
}





/*
 * ACCOUNT MODIFICATION (inc. deletion)
 *
 *
 *
 *
 */
export async function RunFetch_UpdateCompanyAccount(oldAccount, newAccount, global) {
		var body = JSON.stringify({
			company:oldAccount.company,
			fields:['company','password'],
			values:[newAccount.company,newAccount.password]
		})
		return RunFetch_UpdateAccount('company',body,global);
}

function generateStoresList(stores) {
	var result = '[';
	
	if(typeof stores === 'string') {
		try {
			stores = JSON.parse(stores);
		}
		catch(e) {
			
		}
	}
	
	if(!stores || stores.length < 1) {
		return "[]";
	}
	
	for (var i = 0; i < stores.length; i++) {
        result = result+('{ID:'+stores[i].ID+',store:'+stores[i].store+'}');
		if(i<stores.length-1) {
			 result = result+',';
		}
		else {
			result = result+']';
		}
    } 
	return result;
}

function generateStoresModificaiton(stores) {
	var result = '';
	
	if(typeof stores === 'string') {
		try {
			stores = JSON.parse(stores);
		}
		catch(e) {
			
		}
	}
	
	if(!stores || stores.length < 1) {
		return "";
	}
	
	for (var i = 0; i < stores.length; i++) {
        result = result+(stores[i].store);
		
		if(i+1 < stores.length) {
			result = result+';'; 
		}
    } 
	return result;
}

export async function RunFetch_UpdateStoreAccount( url, isCompany, user, oldAccount, newAccount, global) {
		var stores = generateStoresModificaiton(newAccount.stores);

		var passwordField = '';
		var passwordValue = '';
		
		let doNotUpdate = false;
		
		if(!isEmptyOrSpaces(newAccount.password)) {
			passwordField='password,';
			passwordValue=newAccount.password+",";
		}
		
		var body = '';

		if(oldAccount.username === newAccount.username) {
			if(!isEmptyOrSpaces(newAccount.password)) {
				body = JSON.stringify({
				company:oldAccount.company,
				username:oldAccount.username,
				fields:(passwordField+'stores'),
				values:(passwordValue+stores)});
			}
			else {
				body = JSON.stringify({
				company:oldAccount.company,
				username:oldAccount.username,
				fields:('stores'),
				values:(stores)});
			}
			
		} else {
			body = JSON.stringify({
			company:oldAccount.company,
			username:oldAccount.username,
			fields:(passwordField+'username,'+'stores'),
			values:(passwordValue+newAccount.username+','+stores)});
		}
		
		return RunFetch_UpdateAccount(url, 'storeAccount',body,global);
}

//Not yet supported by the API.
export async function RunFetch_UpdateStore( url, isCompany, user, oldStore, newStore, global) {
		/*
		console.log('RunFetch_UpdateStore ',url,isCompany,user,oldStore,newStore);
		
		var body=null;
		
		if(isCompany) {
			body = JSON.stringify({
				company:oldStore.company,
				username:oldStore.store,
				fields:['company,store'],
				values:[newStore.company,newStore.store]
			});
		}
		else {
			body = JSON.stringify({
				company:oldStore.company,
				username:oldStore.store,
				fields:['store'],
				values:[newStore]
			});
		}
		
		
		return RunFetch_UpdateAccount(url, 'store',body,global);
		*/
}

export async function RunFetch_UpdateAccount(url, type, bodyGen, global) {
	let endpoint=null
	let methodGen=null;

	switch(type.toLowerCase()) {
		  case 'companyaccount':			methodGen='PATCH';		endpoint=url+'api/v2/Company/Account';				break;
		  case 'storeaccount':				methodGen='PATCH';		endpoint=url+'api/v2/Store/Account';				break;
	}
		
	const requestOptions = {
		method: methodGen,
		headers: DEFAULT_HEADERS,
		body: bodyGen
	}
			
	// GET request using fetch with basic error handling
	const asyncFetch = await fetchAPI(endpoint,requestOptions);
		
	global[0] = asyncFetch[0];
	global[1] = asyncFetch[1];
}
