import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

import {log, fetchAPI, getApiURL} from './middleware_core';

/* This API listener is an example.
 *
 * I suggest you front-end boys take this example and 
 * write your own version of it for your own needs.
 */

/* Could call like:
 *
 * var parameters = {url:"endpointgoeshere", live:true};
 * ListenTo(parameters)
 *
 * Then just set parameters.live to false whenever you want to cancel the subscription.
 */
 
 //The specific endpoint we'll be listening to is: /api/v1/Display/media/listen

export function ListenTo(param) {
	
	//Param is object = {url:blahblah,active:true}
	async function subscribe(param) {
		console.log("Attempting subscription to: ",param.url);
		
		let response = await fetch(param.url);

		if(param.active === true) {
			if (response.status == 502) {
				// Code 502 means a timeout.
				// Resubscribe.
				console.log(" > Error: (502, timeout) occured. Retrying.");
				await subscribe();
				
			} else if (response.status != 200) {
				// Misc. error has occured.
				// Resubscribe after a 1 second delay.
				console.log(" > Error: ("+response.statusText+") occured. Retrying.");
				await new Promise(resolve => setTimeout(resolve, 1000));
				await subscribe();
				
			} else {
				// Response received.
				let message = await response.text();
				
				//Do stuff with response here.
				console.log(" > Response received! Message: ",message);
				console.log(" > Resubscribing. ",message);
				await subscribe();
			}
		} else {
			console.log(" ! Subscription ended.")
			return;
			//Subscription ended.
		}
	}
	
	if(param.active === true) {
		subscribe();
	}
}








