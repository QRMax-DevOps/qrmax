import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';
import {log, logWarn, fetchAPI} from './middleware_core';

/*The mw_core suite contains all the fundamental functions
 * utilised by all middleware suites. */


 //*****************************************************************************************
 //*****************************************************************************************
 
 //data.company
 //data.store
 //data.display
 //data.mediaName
 //data.mediaFile
 //data.QRID
 
 /* Common arguments used in functions:
  *
  *     - Any "url parameters" described are usually produced automatically
  *       by the login screen upon successful login.
  *
  *     - url: Where is the server being hosted?
  *		   > Usually http://localhost:80 (localhost) or http://3.25.134.204
  *		   > Url parameters to help with this, e.g. : "islocalhost=80"
  *
  *     - id: As of 02/03, simply just the username of the logged in user.
  *		   > Url parameter, e.g. : "username=usernamehere"
  * 
  *     - type: The type of request being made. Refer to the switch-case in the function.
  *
  *     - data: An object which can hold the following values:
  *		   > tore: As of 02/03, simply just provide the store name.
  *		   > company: As of 02/03, simply just provide the company name.
  *		   > display: As of 02/03, simply just provide the display name.
  *		   > fields: Fields to be updated. Array type.
  *		   > values: Values to be updated, must align with fields. Array type.
  *
  *     - global: Excuse the name. This is basically the object which stores
  *       the response from the API and, hopefully, the database if all goes
  *       well.
  *		   > Should be a length=2 array.
  *		   > First value is either true or false, determining whether the request
  *		     was successful.
  *		   > Second value is the actual data or message. If a successful request,
  *          this should be a JSON.
  */



//If is symbol, will take e.g., Symbol("data") and return "data".
//This function is not exported and cannot be imported.
function enumToString(value) {
	switch(typeof value) {
		case 'symbol':
			return value.description;
			
		case 'string':
			return value;
			
		default:
			return null;
	}
}

function arrayToString(array){
	var strArray = array.toString();
	return strArray;
}

function handleTarget(target) {
	//Just in case an enum is provided.
	var v = enumToString(target);
	
	//If not null and a string
	if(v && typeof v === 'string') {
		switch(enumToString(target).toLowerCase()) {
			case 'companyaccount':
			case 'companyacc':
			case 'company':
				return 'companyaccount';
				
			case 'storeaccount':
			case 'storeacc':
			case 'store':
				return 'storeaccount'
				
			case 'display':
				return 'display';
				
			default:
				logWarn("Middleware error in \'getSettings() ... handleTarget()\'. A value of "+(typeof v)+" \'"+v+"\' was provided as the target. This was not recognised as a valid input. (Must be \'companyaccount\', \'storeaccount\', \'display\', etc.)")
				return v;
		}
	}
	else {
		logWarn("Middleware error in \'getSettings() ... handleTarget()\'. A value of "+(typeof v)+" \'"+v+"\' was provided as the target and does not meet conditions: (target && typeof target === \'string\')")
	}
}

function getEndpoint(url, target) {
	//If not null and a string
	
	if(target && typeof target === 'string') {
		switch(target.toLowerCase())  {
			case 'companyaccount':
				return url+'api/v1/Company/Account/Settings';
				
			case 'storeaccount':
				return url+'api/v1/Store/Account/Settings';
				
			case 'display':
				return url+'api/v1/Display/Settings';
				
			default:
				logWarn("Middleware error in \'getSettings() ... getEndpoint()\'. A value of "+(typeof target)+" \'"+target+"\' was provided as the target. This was not recognised as a valid input. (Must be \'companyaccount\', \'storeaccount\', \'display\', etc.)")
				return 'ENDPOINT_GEN_FAILURE';
		}
	}
	else {
		logWarn("Middleware error in \'getSettings() ... getEndpoint()\'. A value of "+(typeof target)+" \'"+target+"\' was provided as the target and does not meet conditions: (target && typeof target === \'string\')")
	}
}

export async function getSettings(target, type, url, data, global) {
	
	target = handleTarget(target); //Target handler
	type = enumToString(type); //Enum handler
	
	//Where this input is being sent to.
	var endpoint = getEndpoint(url, target); //Generating endpoint
	
	//For the request options.
	var methodGen = 'UNASSIGNED_METHOD';
	var inputGen  = 'UNASSIGNED_BODY';
	
	
	//Generating the request "method" and "body" (for request options).
	//Uppercase used to promote readability
	switch(target.toUpperCase()) {
		case 'COMPANYACCOUNT':
			switch(type.toUpperCase()) {
				case 'GETLIST':
					methodGen = 'POST';
					inputGen  = JSON.stringify({
						company	: data.company,
					});
					break;
				case 'MODIFY':
					methodGen = 'PATCH';
					inputGen  = JSON.stringify({
						company	: data.company,
						fields	: arrayToString(data.fields),
						values	: arrayToString(data.values)
					});
					break;
			}
			break;
		
		
		case 'STOREACCOUNT':
			switch(type.toUpperCase()) {
				case 'GETLIST':
					methodGen = 'POST';
					inputGen  = JSON.stringify({
						company		: data.company,
						username	: data.username
					});
					break;
				case 'MODIFY':
					methodGen = 'PATCH';
					inputGen  = JSON.stringify({
						company		: data.company,
						username	: data.username,
						fields		: arrayToString(data.fields),
						values		: arrayToString(data.values)
					});
					break;
			}
			break;
			
		case 'DISPLAY':
			switch(type.toUpperCase()) {
				case 'GETLIST':
					methodGen = 'POST';
					inputGen  = JSON.stringify({
						company	: data.company,
						store	: data.store,
						display	: data.display
					});
					break;
				case 'MODIFY':
					methodGen = 'PATCH';
					inputGen  = JSON.stringify({
						company	: data.company,
						store	: data.store,
						display	: data.display,
						fields	: arrayToString(data.fields),
						values	: arrayToString(data.values)
					});
					break;
			}
			break;
	}

	const requestOptions = {
		method	: methodGen,
		headers	: { 'Content-Type': 'application/json' },
		body	: inputGen
	};
	
	//Doing the actual request.
	const asyncFetch = await fetchAPI(endpoint,requestOptions);
	//Note that: array values are references.
	
	/*References need to be used instead of a simple return since "fetchAPI" is asynchronous
	 * and may take a few milliseconds to actually return a value.*/
	global[0] = asyncFetch[0];
	global[1] = asyncFetch[1];
}
//Company/Account/Settings
//Store/Account/Settings
//Display/Settings