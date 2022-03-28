import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';
import {log, fetchAPI} from './middleware_core';

export async function RunFetch_Login(url, isCompanyAccount, data, global) {

		//console.log("Inside login call! Values are: ", url, isCompanyAccount, data, global);

		var endpoint = '';
		var bodyIn = '';

		if(isCompanyAccount) {
			endpoint = url + 'api/v1/Company/Account';
			var bodyIn = JSON.stringify({company:data.companyInput, password:data.passwordInput});
			
		} else /*is store account*/ {
			endpoint = url + 'api/v1/Store/Account';
			var bodyIn = JSON.stringify({company:data.companyInput, username:data.usernameInput, password:data.passwordInput});
		}
		
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: bodyIn
		};
		
		
		// GET request using fetch with basic error handling
		const asyncFetch = await fetchAPI(endpoint,requestOptions);
		
		global[0] = asyncFetch[0];
		global[1] = asyncFetch[1];
}
