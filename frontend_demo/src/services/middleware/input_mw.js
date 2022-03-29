import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

import {log, fetchAPI, getApiURL} from '../core_mw';

 export async function ActionQRID(data, global, isLocalHost) {
			//json:{company, store, display, QRID}
		var url = getApiURL(isLocalHost);
		var endpoint = url+'api/v1/QR/';
		var input = JSON.stringify({
			company: data.company,
			store: data.store,
			display: data.display,
			QRID: data.QRID
		})
		
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: input
		};
		
		// GET request using fetch with basic error handling	
		const asyncFetch = await fetchAPI(endpoint,requestOptions);
		
		global[0] = asyncFetch[0];
		global[1] = asyncFetch[1];
}