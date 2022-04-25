import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

import {log, logWarn, fetchAPI} from '../core_mw';
import {enumToString, getDefaultHeaders, verifyFetchMethod} from '../utilities/common_util';

//Helper functions
import {prepDisplayCall} from './helpers/display_prep_call';
import {prepMediaCall} from './helpers/media_prep_call';

// ...................................................................................................
// ...................................................................................................

//DISPLAY HANDLER (POST,PUT,DELETE @ /api/v1/Display)
 
/*ACCEPTABLE "TARGET" INPUTS
 *      - 'display'					- (supports: PUT, DELETE, POST)
 *      - 'display/media'			- (supports: PUT, DELETE, POST, PATCH)
 *      - 'display/media/file'		- (supports: POST)
 *      - 'display/settings'		- (supports: POST, PATCH)
 *      - 'display/interactions'	- (supports: POST)
 *      - 'display/media/refresh'	- (supports: PATCH)
 *      - 'display/media/positions' - (supports: PUT, PATCH, POST DELETE)
 */
 
//ACCEPTABLE "TYPE" INPUTS : post, put, patch, delete, getlist, etc.



//CORE DISPLAY HANDLER
export async function handleDisplay(target, type, url, data, global) {
	//Enum handler
	target = enumToString(target);
	type = enumToString(type);
	
	//Verify type
	var typeValid = verifyFetchMethod(type);
	if(typeValid[0] === false) {
		logWarn( "In function --> \"handleDisplay\": "+typeValid[1] );
		return;
	} else if(typeValid[0] === true) {
		type = typeValid[2];
	}
	
	var requestOptions = null;
	
	switch(target.toLowerCase()) {
		case 'display':
		case 'display/interactions':
		case 'display/settings':
			requestOptions = prepDisplayCall(target, type, url, data, global);
			break;
		
		case 'display/media':
		case 'display/media/file':
		case 'display/media/refresh':
		case 'display/media/positions':
			requestOptions = prepMediaCall(target, type, url, data, global);
			break;
		
		default:
			global[0] = false;
			global[1] = "Forced rejection of request:\n      > In function \"handleDisplay()\": Unrecognised \"target\" ("+target+").\n      > Are you sure this references a valid endpoint?";	
			break;
	}
	
	if(global[0] != false) {
		//Doing the actual request.
		const asyncFetch = await fetchAPI(requestOptions.endpoint,requestOptions);
		//Note that: array values are references.
		
		/*References need to be used instead of a simple return since "fetchAPI" is asynchronous
		 * and may take a few milliseconds to actually return a value.*/
		global[0] = asyncFetch[0];
		global[1] = asyncFetch[1];
	}
	else {
		logWarn(global[1]);
	}
}