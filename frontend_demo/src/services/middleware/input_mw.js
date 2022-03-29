import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

import {log, fetchAPI, getApiURL} from '../core_mw';
import {enumToString, getDefaultHeaders} from '../utilities/common_util';


// ...................................................................................................
// ...................................................................................................


 export async function ActionQRID(data, global, isLocalHost) {
	//json:{company, store, display, QRID}
	var url = getApiURL(isLocalHost);
	var endpoint = url+'api/v1/QR/';
	var bodyGen = JSON.stringify({
		company: data.company,
		store: data.store,
		display: data.display,
		QRID: data.QRID
	})
	
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