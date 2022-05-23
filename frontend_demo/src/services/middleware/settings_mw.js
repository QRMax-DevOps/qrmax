import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

import {log, logWarn, fetchAPI} from '../core_mw';
import {enumToString, arrayToString, getDefaultHeaders} from '../utilities/common_util';


// ...................................................................................................
// ...................................................................................................


function handleTarget(target) {
	//Just in case an enum is provided.
	var tgt_str = enumToString(target);
	
	//If not null and a string
	if(tgt_str && typeof tgt_str === 'string') {
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
				logWarn("Middleware error in \'getSettings() ... handleTarget()\'. A value of "
					+(typeof tgt_str)+" \'"+tgt_str+"\' was provided as the target. This was not" 
					+"recognised as a valid input. (Must be \'companyaccount\', \'storeaccount\'"
					+", \'display\', etc.)");
				return tgt_str;
		}
	}
	else {
		logWarn("Middleware error in \'getSettings() ... handleTarget()\'. A value of "+(typeof tgt_str)
			+" \'"+tgt_str+"\' was provided as the target and does not meet conditions: (target && "
			+"typeof target === \'string\')");
	}
}


function getEndpoint(url, target) {
	//If not null and a string
	if(target && typeof target === 'string') {
		switch(target.toLowerCase())  {
			case 'companyaccount':
				return url+'api/v2/Company/Account/Settings';
				
			case 'storeaccount':
				return url+'api/v2/Store/Account/Settings';
				
			case 'display':
				return url+'api/v2/Display/Settings';
				
			default:
				logWarn("Middleware error in \'getSettings() ... getEndpoint()\'. A value of "
					+(typeof target)+" \'"+target+"\' was provided as the target. This was not recognised "
					+"as a valid input. (Must be \'companyaccount\', \'storeaccount\', \'display\', etc.)");
				return 'ENDPOINT_GEN_FAILURE';
		}
	}
	else {
		logWarn("Middleware error in \'getSettings() ... getEndpoint()\'. A value of "+(typeof target)+" \'"
			+target+"\' was provided as the target and does not meet conditions: (target && typeof target === "
			+"\'string\')")
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
						fields	: arrayToString('BASIC', data.fields),
						values	: arrayToString('BASIC',data.values)
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
						fields		: arrayToString('BASIC',data.fields),
						values		: arrayToString('BASIC',data.values)
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
						fields	: arrayToString('BASIC',data.fields),
						values	: arrayToString('BASIC',data.values)
					});
					break;
			}
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