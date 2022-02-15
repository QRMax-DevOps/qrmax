import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Link, useLocation, BrowserRouter as Router } from "react-router-dom";

import ResponseProcessing from './Response_Processing';
import ResponseGood from './Response_Good';
import ResponseBad from './Response_Bad';

import './test.css';
import './login_style.css';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

async function fetchAPI(code, requestOptions) {
    return fetch('http://3.25.134.204/api/v1/QR/'+code, requestOptions)
        .then(response => {
            const data = response.json();
			
			// get error message from body or default to response statusText
			const info = (data && data.message) || response.statusText;
			
            if (!response.ok) {
				console.log(" - Log: API Response ... Fail! (response: "+info+")");
				return false;
				
            } else {
				console.log(" - Log: API Response ... Pass! (response: "+info+")");
				return true;
			}
        })
        .catch(info => {
            console.error(' - Log: API Response ... Unexpected error:', info);
			return false;
        });
}

var testGlobal = null;

async function RunFetch(code) {
	// GET request using fetch with basic error handling
	console.log(" - Log: Fetching via: \"http://3.25.134.204/api/v1/QR/"+code+"\"");
	
	const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };
	const asyncFetch = await fetchAPI(code, requestOptions);
	
	testGlobal=asyncFetch;
}


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function checkFormat(data) {
	if(data == null) {
		console.log(" - Log: Format check ... FAIL! (No data provided)")
		return false;
	}
	else {
		console.log(" - Log: Format check ... PASS!")
		return true;
	}
}

export default function InputResponse() {
	
	const [counter, setCounter] = useState(0);
	const [processStatus, setProcessStatus] = useState([]);
	
	const [formatState, setFormatState] = useState(null);
	const [apiResponse, setApiResponse] = useState(null);
	
	const [checkBegun, setCheckBegun] = useState(false);
	const [checkComplete, setCheckComplete] = useState(false);
	const [checkPassed, setCheckPassed] = useState(true);
	
	
	
	/*Note that: Const values are updated after an interval has completed*/
	
	const qrData = useQuery().get("code");
	
	  useInterval(() => {
		  
		setCounter(counter + 0.5);
		
		if(!checkComplete) {
			if(!checkBegun) {
				if(counter >= 0.5) {
					console.log("CHECKING QR DATA: \""+qrData+"\"")
					setFormatState(checkFormat(qrData), processStatus);
					setCheckBegun(true);
				}
			} else {
				//Failure check
				if(testGlobal!="wait") {
					if(formatState === false || apiResponse === false) {
						setCheckPassed(false);
						setCheckComplete(true);

						console.log(" - Log: Check failed.")
					}
					else if(formatState === true && apiResponse === true) {
						setCheckPassed(true);
						setCheckComplete(true);

						console.log(" - Log: Check passed.")
					}
					else if(formatState === true && testGlobal === null) {
						RunFetch(qrData);
						testGlobal = "wait";
					}
					else if(formatState === true && (testGlobal === true || testGlobal === false)) {
						setApiResponse(testGlobal);
					}
				}
			}
		}
	  }, 500);	

	//The use of the "counter" variable is simply for aesthetic purposes.
	//It allows for a much smoother transition between screens.

	if(counter < 0.5) {
		return(
			<div></div>
		)
	}
	else {
		if(checkComplete && counter > 2) {
			if(checkPassed) {
				return ( <div><ResponseGood/></div> )
			}
			else {
				return ( <div><ResponseBad/></div> )
			}
		}
		else {
			return ( <div>{ResponseProcessing(processStatus)}</div> )
		}
	}
};