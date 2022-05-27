/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import {checkLoginToken, getLoginToken} from './utilities/auth_util';

//Basic, but more appropriate logging function used to maintain logging format standard.
export function log(message) {
	let curTime = new Date().toLocaleTimeString();
	console.log("["+curTime+"] : "+message);
}

//Similar to the above function, but will highlight the log in the console in a bright yellow.
//Typically used to notify the reader of a notable, but not critical issue.
export function logWarn(message) {
	let curTime = new Date().toLocaleTimeString();
	console.warn("[",curTime,"] : ",message);
}

//Note that if provided a floating number, this function will round it down.
function isInt(value) {
	var x = parseFloat(value);
	return !isNaN(value) && (x | 0) === x;
}

//Returns the URL / address for the backend API
export function getApiURL(localhost) {
	//If localhost enabled
	if(localhost != null && localhost !== false && localhost !== 'false' && localhost !== 'False') {
		return 'http://localhost:4200/';
	}
	//If localhost not enabled
	else {
		return 'https://api.qrmax.app/';
	}
}

function isUnassigned(str){
    return str === null
		|| str.match(/^ *$/) !== null
		|| str === 'UNASSIGNED_BODY'
		|| str === 'UNASSIGNED_METHOD';
}

//Used for logging. Returns a nicer/readable headers string.
function getHeadersString(headers, shortenToken) {
	var str = "{";
	var arr = [];
	
	for (let entry of headers.entries()) { 
	
		if(shortenToken === true && entry[0].toLowerCase() === 'authorization') {
			var reducedToken = (entry[1].substring(0, 12)+"..."+entry[1].substring(entry[1].length-5,entry[1].length));
			arr.push('"'+entry[0]+'":"'+reducedToken);
		}
		else
		{arr.push('"'+entry[0]+'":"'+entry[1]);}
	}
	
	for(let i = 0; i < arr.length; i++) {
		if(i===(arr.length-1)) {
			str=str+arr[i]+"\"}";
		} else {
			str=str+arr[i]+"\",";
		}
	}
	
	return str;
}

//The workhorse of the middleware. The function used to send requests to the API.
export async function fetchAPI(address, requestOptions) {
	//console.log(requestOptions);
	if(isUnassigned(requestOptions.body) || isUnassigned(requestOptions.method)) {
		logWarn(requestOptions.method+" to API : Forced rejection of request. Request will not be performed.\n    > The request 'method' and/or 'body' is unassigned.");
		return [false, 'An unexpected error has occured. Please check the console.'];
	}
	else {
		
		let curTime = new Date().toLocaleTimeString();
		
		//If login token exists, then create/append Authorization field to headers
		if(checkLoginToken()===true && !requestOptions.headers.get('Authorization')) {
			var loginToken = getLoginToken();
			requestOptions.headers.append('Authorization','Bearer '+loginToken);
		}

		//Logging request data
		console.log("["+curTime+"] : ",requestOptions.method," to API"
			,"\n    > Target  = ",address
			,"\n    > Data    = ",requestOptions
			,"\n    > Headers = ",getHeadersString(requestOptions.headers, false)
			,"\n ");
		
		//Doing the actual request

		return fetch(address, requestOptions)
			.then((response) => response.json())
			.then((res) => {
				if (res.error || (res.status && (res.status === "failure" || res.status === "fail"))) {
					if(typeof res === 'string') {
						logWarn(requestOptions.method+" to API has FAILED. Handled rejection encountered."
						,"\n    > Response = ",res);
						return [false,res];
					}
					else {
						logWarn(requestOptions.method+" to API has FAILED. Handled rejection encountered."
						+"\n    > Response = "+JSON.stringify(res));
						return [false,JSON.stringify(res)];
					}
				} 
				else {
					console.log("["+curTime+"] : ",requestOptions.method," to API was SUCCESSFUL!\n   > Received: ",res,"\n ");
					return [true,JSON.stringify(res),"The API accepted the POST request!"];
				}
			})
			.catch(res => {
				logWarn(requestOptions.method+" to API : Unhandled rejection! (response: "+res+")");
				return [false,res];
			});
	}
}