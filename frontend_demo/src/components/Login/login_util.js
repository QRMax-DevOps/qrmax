import React, { useState, useEffect, useRef } from "react";

export function getNiceError(input) {
	console.log(input);
	try {
		var json = JSON.parse(input);
	}
	catch(err) {
		return input;
	}
	
	
	
	if(json.cause) {
		switch(json.cause.toLowerCase()) {
			case 'incorrect password': return 'Incorrect details. Please try again.';
			case 'no such company': return "This company does not exist.";
			case 'no such account': return "Username does not exist in company records.";
			default: return 'Incorrect details. Please try again.';
		}
	}
	else if (json.error){
		return 'An API error has occured. Please contact QRMAX administration.';
	}
	else {
		return input;
	}
	
	
}