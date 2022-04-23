/* This file, as well as its code, respective design, layout,
 * and structure (etc.) has been developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import {log, logWarn} from '../core_mw';

//If is symbol, will take e.g., Symbol("data") and return "data".
//This function is not exported and cannot be imported.
export function enumToString(value) {
	switch(typeof value) {
		case 'symbol':
			return value.description;
			
		case 'string':
			return value;
			
		default:
			return null;
	}
}

export function stringToBool(value) {
	if(typeof(value) === 'string') {
		if(value === 'true') {return true;}
		else {return false;}
	}
	else if (typeof(value) === 'boolean') {
		return value;
	}
}

export function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
		console.log(e);
        return false;
    }
    return true;
}

export function getUnsupportedMethodMessage(type, endpoint) {
	return ("Forced rejection of request:\n      > Request method/type ("+type+") is unsupported by endpoint: "+endpoint);
}

export function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

//Might seem unnecessary, but will be expanded upon later.
export function arrayToString(type,array){
	var strArray = array.toString();
	
	if(type.toUpperCase === 'BASIC') {
		return strArray;
	}
	else {
		strArray = "["+strArray+"]";
		return strArray;
	}
}

export function getDefaultHeaders() {
	var headersGen = new Headers({
		'Content-Type' : 'application/json'
	});
	return headersGen;
}



export function verifyFetchMethod(method) {
	if(typeof method === 'symbol') {
		method = enumToString(method);
	}
	if(isEmptyOrSpaces(method)) {
		return [false,"Request method/type provided is null, empty or whitespace."];
	}
	else if(typeof method === 'string'){
		switch(method.toUpperCase()) {
			case "PUT":
			case "CREATE":
				return [true, "Request method/type \""+method+"\" is valid.", "PUT"];
			
			case "POST":
			case "GETLIST":
				return [true, "Request method/type \""+method+"\" is valid.", "POST"];
			
			case "DELETE":
				return [true, "Request method/type \""+method+"\" is valid.", "DELETE"];
			
			case "PATCH":
			case "MODIFY":
				return [true, "Request method/type \""+method+"\" is valid.", "PATCH"];
				
			default:
				return [false, "Request method/type \""+method+"\" was not recgonised. (Accepted inputs: PUT || CREATE, POST || GETLIST, DELETE, PATCH || MODIFY)"];
		}	
	}
	else {
		return [false, "Request method/type is of unsupported datatype \""+typeof method+"\". Please provide a string."];
	}
}
