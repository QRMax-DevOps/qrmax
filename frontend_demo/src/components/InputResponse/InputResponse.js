/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useLocation } from "react-router-dom";

import ResponseProcessing from './Response_Processing';
import ResponseGood from './Response_Good';
import ResponseBad from './Response_Bad';

import {log} from '../../services/core_mw';
import {ActionQRID} from '../../services/middleware/input_mw';

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

//Currently very basic. Will only check the null state of given values.

function logCheck(dataName, data, result) {
	if(!data) {
		console.warn("    - "+dataName+" failed (is null)");
		result[0] = false;
	} else {
		console.log("     - "+dataName+" passed");
	}
}

function checkFormat(data) {
	var result = [true];
	
	//logCheck("data.company", data.company, result)
	//logCheck("data.store", data.store, result)
	//logCheck("data.display", data.display, result)
	logCheck("data.QRID", data.QRID, result)
	
	if(result[0]===true) { console.log(" ^ Check passed\n\n"); }
	else { console.error(" ^ Check failed\n\n"); }
	
	return result[0];
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
	
	//const company = useQuery().get("company");
	//const store = useQuery().get("store");
	//const display = useQuery().get("display");
	const QRID = useQuery().get("qrid");
	//console.log("Input response check: " + QRID);
	
	const data = {QRID};
	
	  useInterval(() => {
		  
		setCounter(counter + 0.5);
		
		if(!checkComplete) {
			if(!checkBegun) {
				if(counter >= 0.5) {
					log("Performing format check on: \""+JSON.stringify(data)+"\"");
					setFormatState(checkFormat(data), processStatus);
					setCheckBegun(true);
				}
			} else {
				//Failure check
				if(GLOBAL[1]!="wait") {
					
					if(formatState === false || apiResponse === false) {
						setCheckPassed(false);
						setCheckComplete(true);
					}
					else if(formatState === true && apiResponse === true) {
						setCheckPassed(true);
						setCheckComplete(true);
					
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
				return ( <div><ResponseGood qrid={QRID}/></div> )
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