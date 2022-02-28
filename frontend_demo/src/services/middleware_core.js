import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

//flexible fetch
export function log(message) {
	let curTime = new Date().toLocaleTimeString();
	console.log(" - @"+curTime+" - UPD: "+message);
}

export function getApiURL(localhost) {
	if(localhost !== null) {
		return 'http://localhost:'+localhost+'/';
	}
	else {
		return 'http://3.25.134.204/';
	}
}

//Produces a much more user-friendly reason for rejection.
export function getBetterRejectionReason(res) {
	try {
		if(res.status.toLowerCase() === 'failure') {
			switch(res.cause.toLowerCase()) {
				case 'no such account': 
					return 'Sorry, we couldn\'t log you in. Please check your details and try again.'; break;
				default:
					return 'Unhandled response from API received. Update required.'; break;
			}
		}
	} catch {
		return 'An unexpected error has occured. Please check the console.';
	}
}

export async function fetchAPI(address, requestOptions) {
    return fetch(address, requestOptions)
        .then((response) => response.json())
		.then((res) => {
            if (res.error || (res.status && res.status === "failure")) {
				log("POST to API : Handled rejection! (response: "+JSON.stringify(res)+")");
				return [false,JSON.stringify(res),getBetterRejectionReason(res)];
            } 
			else {
				log("POST to API : successful! (response: "+JSON.stringify(res)+")");
				return [true,JSON.stringify(res),"The API accepted the POST request!"];
			}
        })
        .catch(res => {
            log("POST to API : Unhandled rejection! (response: "+res+")\n    > Double check that the server is running!\n    > Also check the correct url is being used for the FETCH function.");
			return [false,getBetterRejectionReason(res)];
        });
}

//Deprecated functions. Still in use by login and response screens.
export async function RunFetch(username, passCode, global) {

		const url = 'http://localhost:80/api/v1/Company/Account';
		
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({company:username,password:passCode})
		};
		
		// GET request using fetch with basic error handling
		log("Attempting POST:\n    > At: "+url+"\n    > With body: "+JSON.stringify({company:username,password:passCode}));
		
		const asyncFetch = await fetchAPI(url,requestOptions);
		
		global[0] = asyncFetch[0];
		global[1] = asyncFetch[1];
}



export async function RunFetch2(code, global) {

		const url = 'http://localhost:80/api/v1/QR/';
		
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: code
		};
		
		// GET request using fetch with basic error handling
		log("Attempting POST:\n    > At: "+url+"\n    > With body: "+code);
		
		const asyncFetch = await fetchAPI(url,requestOptions);
		
		global[0] = asyncFetch[0];
		global[1] = asyncFetch[1];
}