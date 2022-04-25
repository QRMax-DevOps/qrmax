import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

import {log, fetchAPI} from '../core_mw';
import {enumToString, getDefaultHeaders} from '../utilities/common_util';


// ...................................................................................................
// ...................................................................................................

export async function RefreshQR(url, data, global) {
	
	//Where this input is being sent to.
	const endpoint = url+'api/v1/Display/Media/Refresh';
	var methodGen = 'PATCH';
	
	var inputGen = {
		company	: data.company,
		store	: data.store
	};
	//Optional value
	if(data.display) {
		inputGen.display = data.display;
	}
	//Optional value
	if(data.media) {
		inputGen.media = data.media;
	}
	
	inputGen = JSON.stringify(inputGen);

	
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

