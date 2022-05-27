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
	var endpoint = 'https://api.qrmax.app/api/v2/QR/';
	var bodyGen = JSON.stringify({
		QRID: data.QRID
	})
	
	const requestOptions = {
		method: 'POST',
		headers: getDefaultHeaders(),
		body: bodyGen
	};

	console.log("body: " + requestOptions.body);
	
	// GET request using fetch with basic error handling	
	const asyncFetch = await fetchAPI(endpoint,requestOptions);
	
	global[0] = asyncFetch[0];
	global[1] = asyncFetch[1];
}

export async function registerVote(type, url, data, global) {
	var endpoint = url+'api/v1/QR/'+data.QRID;

	var methodGen = null;
	var inputGen  = null;

	if(type == "VOTE") {
		methodGen = 'POST';
		inputGen = JSON.stringify({
			voteCount: data.QRID
		})
	}

	const requestOptions = {
		method	: methodGen,
		headers	: { 'Content-Type': 'application/json' },
		body	: inputGen
	};

	log("Attempting "+requestOptions.method+":\n    > At: "+endpoint+"\n    > With body: "+requestOptions.body);
	const asyncFetch = await fetchAPI(endpoint,requestOptions);

	global[0] = asyncFetch[0];
	global[1] = asyncFetch[1];
}