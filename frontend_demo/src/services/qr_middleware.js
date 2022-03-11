import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

/*The mw_core suite contains all the fundamental functions
 * utilised by all middleware suites. */
import {log, fetchAPI} from './middleware_core';

/*To fetch the stores/storeslist, as is required in QR
 * management (since stores hold displays), refer to the
 * am_middleware.js suite (accounts management). */
 
 //*****************************************************************************************
 //*****************************************************************************************
 
 
 
 /* Common arguments used in functions:
  *
  *     - Any "url parameters" described are usually produced automatically
  *       by the login screen upon successful login.
  *
  *     - url: Where is the server being hosted?
  *		   > Usually http://localhost:80 (localhost) or http://3.25.134.204
  *		   > Url parameters to help with this, e.g. : "islocalhost=80"
  *
  *     - id: As of 24/02, simply just the username of the logged in user.
  *		   > Url parameter, e.g. : "username=usernamehere"
  * 
  *     - type: The type of request being made. Must be either: "DELETE","CREATE" or "GETLIST"
  *
  *     - data: An object which can hold the following values:
  *		   > store: As of 24/02, simply just provide the store name.
  *		   > company: As of 24/02, simply just provide the company name.
  *		   > display: As of 24/02, simply just provide the display name.
  *
  *     - global: Excuse the name. This is basically the object which stores
  *       the response from the API and, hopefully, the database if all goes
  *       well.
  *		   > Should be a length=2 array.
  *		   > First value is either true or false, determining whether the request
  *		     returned data from the database.
  *		   > Second value is the actual data or message. If a successful request,
  *          this will be a JSON.
  */



//If is symbol, will take e.g., Symbol("data") and return "data".
//This function is not exported and cannot be imported.
function EnumToString(value){
	switch(typeof value) {
		case 'symbol':
			return value.description;
			
		case 'string':
			return value;
			
		default:
			return null;
	}
}




//DISPLAY HANDLER (POST,PUT,DELETE @ /api/v1/Display)
 export async function HandleDisplay(type, url, data, global) {
	//Enum handler
	type = EnumToString(type);
	
	//Where this input is being sent to.
	const endpoint = url+'api/v1/Display';
	
	//For the request options.
	var methodGen = null;
	var inputGen  = null;
	
	switch(type.toUpperCase()) {
		case 'GETLIST':
			methodGen = 'POST';
			inputGen  = JSON.stringify({
				company	: data.company,
				store	: data.store
			});
			break;
		
		case 'CREATE':
			methodGen = 'PUT';
			inputGen  = JSON.stringify({
				company	: data.company,
				store	: data.store,
				display	: data.display
			});
			break;
			
		case 'DELETE':
			methodGen = 'DELETE';
			inputGen  = JSON.stringify({
				company	: data.company,
				store	: data.store,
				display	: data.display
			});
			break;
	}

	const requestOptions = {
		method	: methodGen,
		headers	: { 'Content-Type': 'application/json' },
		body	: inputGen
	};
	
	//Doing the actual request.
	log("Attempting "+requestOptions.method+":\n    > At: "+endpoint+"\n    > With body: "+requestOptions.body);
	const asyncFetch = await fetchAPI(endpoint,requestOptions);

	//Note that: array values are references.
	
	/*References need to be used instead of a simple return since "fetchAPI" is asynchronous
	 * and may take a few milliseconds to actually return a value.*/
	global[0] = asyncFetch[0];
	global[1] = asyncFetch[1];
}