import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

import {log, fetchAPI} from '../core_mw';
import {enumToString, getDefaultHeaders} from '../utilities/common_util';


// ...................................................................................................
// ...................................................................................................


//DISPLAY HANDLER (POST,PUT,DELETE @ /api/v1/Display)
export async function getDisplays(type, url, data, global) {
	//Enum handler
	type = enumToString(type);
	
	//Where this input is being sent to.
	var endpoint = url+'api/v1/Display';
	
	//For the request options.
	var methodGen = null;
	var inputGen  = null;
	
	//{company, store, display,linkedURI}
	
	
	//Generating the request "method" and "body" (for request options).
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
		
		case 'UPDATE':
			methodGen = 'PATCH';
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
		headers	: getDefaultHeaders(),
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