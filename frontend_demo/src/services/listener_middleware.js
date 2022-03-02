import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Route , withRouter} from 'react-router-dom';

import {log, fetchAPI, getApiURL} from './middleware_core';


/*

export async function fetchAPI(address, requestOptions) {
    return fetch(address, requestOptions)
        .then((response) => response.json())
		.then((res) => {
            if (res.error || (res.status && (res.status === "failure" || res.status === "fail"))) {
				log(requestOptions.method+" to API : Handled rejection! (response: "+JSON.stringify(res)+")");
				return [false,JSON.stringify(res),getBetterRejectionReason(res)];
            } 
			else {
				log(requestOptions.method+" to API : successful! (response: "+JSON.stringify(res)+")");
				return [true,JSON.stringify(res),"The API accepted the POST request!"];
			}
        })
        .catch(res => {
            log(requestOptions.method+" to API : Unhandled rejection! (response: "+res+")\n    > Double check that the server is running!\n    > Also check the correct url is being used for the FETCH function.");
			return [false,getBetterRejectionReason(res)];
        });
}

*/

// Receiving messages with long polling
function SubscribePane(elem, url) {

  function showMessage(message) {
    let messageElem = document.createElement('div');
    messageElem.append(message);
    elem.append(messageElem);
  }

  async function subscribe() {
    let response = await fetch(url);

    if (response.status == 502) {
      // Connection timeout
      // happens when the connection was pending for too long
      // let's reconnect
      await subscribe();
    } else if (response.status != 200) {
      // Show Error
      showMessage(response.statusText);
      // Reconnect in one second
      await new Promise(resolve => setTimeout(resolve, 1000));
      await subscribe();
    } else {
      // Got message
      let message = await response.text();
      showMessage(message);
      await subscribe();
    }
  }

  subscribe();

}