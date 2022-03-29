import {log, logWarn} from '../core_mw';

//Checks for null, unassigned or whitespace-only input
function isEmpty(str){
	return !str || str === null || str.match(/^ *$/) !== null;
}

export function saveLoginToken(input) {
	if(isEmpty(input)) {
		logWarn("Authentication (\"saveLoginToken\") - Denied (Input is empty, unassigned, null or whitespace)");
	}
	else {
		sessionStorage.setItem('token',input);
		log("Authentication (\"saveLoginToken\") - Accepted");
	}
}

export function checkLoginToken() {
	if(isEmpty(sessionStorage.token)) {
		logWarn("Authentication (\"checkLoginToken\") - Token is empty, unassigned, null or whitespace");
		return false;
	}
	else {
		//log("Authentication (\"checkLoginToken\") - Token is valid");
		return true;
	}
}


export function getLoginToken() {
	if(isEmpty(sessionStorage.token)) {
		logWarn("Authentication (\"getLoginToken\") - Denied, default value returned (Input is empty, unassigned, null or whitespace)");
		
	}
	else {
		//log("Authentication (\"getLoginToken\") - Accepted, token returned ("+sessionStorage.token+")");
		return sessionStorage.token;
	}
}


export function clearLoginToken() {
	if(isEmpty(sessionStorage.token)) {
		logWarn("Authentication (\"clearLoginToken\") - Denied (Input is empty, unassigned, null or whitespace)");
	}
	else {
		sessionStorage.token=null;
		//log("Authentication (\"clearLoginToken\") - Accepted. Token has been nullified.");
	}
}