/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, { useState, useEffect, useRef } from "react";

export function getNiceError(input) {
	try {
		var json = JSON.parse(input);
	}
	catch(err) {
		return "A backend error may have occured. Please check the console.";
	}
	
	if(json.cause) {
		switch(json.cause.toLowerCase()) {
			case 'incorrect password': return '(Incorrect details. Please try again)';
			case 'no such company': return "(This company does not exist)";
			case 'no such account': return "(Username does not exist in company records)";
			default: return '(Incorrect details. Please try again)';
		}
	}
	else if (json.error){
		return '(An API error has occured. Please contact QRMAX administration.)';
	}
	else {
		return input;
	}
	
	
}