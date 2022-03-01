import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Link, useLocation, BrowserRouter as Router } from "react-router-dom";

import ResponseProcessing from './Response_Processing';
import ResponseGood from './Response_Good';
import ResponseBad from './Response_Bad';

import {log} from '../../services/middleware_core';
import {ActionQRID} from '../../services/ir_middleware';

import '../test.css';
import '../Login/login_style.css';

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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function checkFormat(data) {
	var result = true;
	
	if(!data.company) {
		console.log(" - data.company failed");
		result = false;
	}
	if(!data.store) {
		console.log(" - data.store failed");
		result = false;
	}
	if(!data.display) {
		console.log(" - data.display failed");
		result = false;
	}
	if(!data.QRID) {
		console.log(" - data.QRID failed");
		result = false;
	}
	return result;
}

var GLOBAL = [null,null]

export default function InputResponse() {
	
	const [counter, setCounter] = useState(0);
	const [processStatus, setProcessStatus] = useState([]);
	
	const [formatState, setFormatState] = useState(null);
	const [apiResponse, setApiResponse] = useState(null);
	
	const [checkBegun, setCheckBegun] = useState(false);
	const [checkComplete, setCheckComplete] = useState(false);
	const [checkPassed, setCheckPassed] = useState(true);
	
	
	
	/*Note that: Const values are updated after an interval has completed*/
	
	//json:{company, store, display, QRID}
	
	const company = useQuery().get("company");
	const store = useQuery().get("store");
	const display = useQuery().get("display");
	const QRID = useQuery().get("qrid");
	
	const data = {company, store, display, QRID};
	
	  useInterval(() => {
		  
		setCounter(counter + 0.5);
		
		if(!checkComplete) {
			if(!checkBegun) {
				if(counter >= 0.5) {
					console.log("CHECKING QR DATA: \""+JSON.stringify(data)+"\"")
					setFormatState(checkFormat(data), processStatus);
					
					setCheckBegun(true);
				}
			} else {
				//Failure check
				if(GLOBAL[1]!="wait") {
					if(formatState === false || apiResponse === false) {
						setCheckPassed(false);
						setCheckComplete(true);

						console.log("CHECK FAILED!")
					}
					else if(formatState === true && apiResponse === true) {
						setCheckPassed(true);
						setCheckComplete(true);

						console.log("CHECK PASSED!")
					}
					else if(formatState === true && GLOBAL[0] === null) {
						ActionQRID(data,GLOBAL,true);
						GLOBAL[1] = "wait";
					}
					else if(formatState === true && (GLOBAL[0] === true || GLOBAL[0] === false)) {
						setApiResponse(GLOBAL[0]);
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