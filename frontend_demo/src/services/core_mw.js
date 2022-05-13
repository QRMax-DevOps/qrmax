import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';
import {checkLoginToken, getLoginToken} from './utilities/auth_util';

//flexible fetch
export function log(message) {
	let curTime = new Date().toLocaleTimeString();
	console.log("["+curTime+"] : "+message);
}

export function logWarn(message) {
	let curTime = new Date().toLocaleTimeString();
	console.warn("["+curTime+"] : "+message);
}

function isInt(value) {
	var x = parseFloat(value);
	return !isNaN(value) && (x | 0) === x;
}

export function getApiURL(localhost) {
	if(localhost !== null && localhost !== false && localhost !== 'false') {
		if(localhost === true || localhost === 'true') {
			return 'http://localhost:80/';
		} else if (isInt(localhost)) {
			return 'http://localhost:'+localhost+'/';
		}
	}
	else {
		return 'https://api.qrmax.app/';
	}
}

function isUnassigned(str){
    return str === null || str.match(/^ *$/) !== null || str === 'UNASSIGNED_BODY' || str === 'UNASSIGNED_METHOD';
}

//Produces a much more user-friendly reason for rejection.
export function getBetterRejectionReason(res) {
	try {
		if(res.status.toLowerCase() === 'failure' || res.status.toLowerCase() === 'fail') {
			switch(res.cause.toLowerCase()) {
				case 'no such account': 
					return 'Sorry, we couldn\'t log you in. Please check your details and try again.';
				case 'regex failed': 
					return 'Regex failure. QRID was not recognised.';
				default:
					return 'Unhandled response from API received. Update required.';
			}
		}
	} catch {
		return 'An unexpected error has occured. Please check the console.';
	}
}

function getHeadersString(headers) {
	var str = "";
	
	if(headers["Content-Type"]) {
		str=str+"\"Content-Type\":\""+headers["Content-Type"]+"\"";
	}
	if(headers["Authorization"]) {
		str=str+",\"Authorization\":\""+headers["Authorization"]+"\"";
	}
	
	return str;
}

export async function fetchAPI(address, requestOptions) {
	if(isUnassigned(requestOptions.body) || isUnassigned(requestOptions.method)) {
		logWarn(requestOptions.method+" to API : Forced rejection of request. Request will not be performed.\n    > The request \'method\' and/or \'body\' is unassigned.");
		return [false, getBetterRejectionReason("")];
	}
	else {
		//If login token exists, then create/append Authorization field to headers
		
		//JSON.stringify({company:id});
		
		var headersShown = requestOptions.headers;
		
		if(checkLoginToken()===true) {
			var loginToken = getLoginToken();
			
			
			requestOptions.headers.append('Authorization','Bearer '+loginToken);
			
			/*console.log("\n\nActual header data below:");
			for (let entry of requestOptions.headers) { // <-- response header iterable
			  console.log(entry);
			}*/
			
			var reducedToken = (loginToken.substring(0, 5)+"..."+loginToken.substring(loginToken.length-5,loginToken.length));
			headersShown = {'Content-Type': 'application/json', 'Authorization':'Bearer '+reducedToken};
			//console.log("updated: ", requestOptions);
		}
		
		log("Attempting "+requestOptions.method+":\n    > At: "+address+"\n    > With body: "+requestOptions.body+"\n    > And headers: "+getHeadersString(headersShown));
		
		return fetch(address, requestOptions)
			.then((response) => response.json())
			.then((res) => {
				if (res.error || (res.status && (res.status === "failure" || res.status === "fail"))) {
					logWarn(requestOptions.method+" to API : Handled rejection! (response: "+JSON.stringify(res)+")");
					return [false,JSON.stringify(res),getBetterRejectionReason(res)];
				} 
				else {
					log(requestOptions.method+" to API : successful! (response: "+JSON.stringify(res)+")");
					return [true,JSON.stringify(res),"The API accepted the POST request!"];
				}
			})
			.catch(res => {
				logWarn(requestOptions.method+" to API : Unhandled rejection! (response: "+res+")\n    > Double check that the server is running!\n    > Also check the correct url is being used for the FETCH function.");
				return [false,getBetterRejectionReason(res)];
			});
	}
}