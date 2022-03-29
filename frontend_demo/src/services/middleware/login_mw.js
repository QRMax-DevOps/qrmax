import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

import {log, fetchAPI} from '../core_mw';
import {enumToString, getDefaultHeaders} from '../utilities/common_util';


// ...................................................................................................
// ...................................................................................................


export async function RunFetch_Login(url, isCompanyAccount, data, global) {
	//console.log("Inside login call! Values are: ", url, isCompanyAccount, data, global);
	
	var endpoint = '';
	var bodyGen = '';
	
	if(isCompanyAccount) {
		endpoint = url + 'api/v1/Company/Account';
		var bodyGen = JSON.stringify({company:data.companyInput, password:data.passwordInput});
		
	} else /*is store account*/ {
		endpoint = url + 'api/v1/Store/Account';
		var bodyGen = JSON.stringify({company:data.companyInput, username:data.usernameInput, password:data.passwordInput});
	}
	
	const requestOptions = {
		method: 'POST',
		headers: getDefaultHeaders(),
		body: bodyGen
	};
	
	
	// GET request using fetch with basic error handling
	const asyncFetch = await fetchAPI(endpoint,requestOptions);
	
	global[0] = asyncFetch[0];
	global[1] = asyncFetch[1];
}
