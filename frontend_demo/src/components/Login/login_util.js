import React, { useState, useEffect, useRef } from "react";

export function getNiceError(input) {
	
	var json = JSON.parse(input);
	
	console.log(input);
	
	switch(json.cause.toLowerCase()) {
		case 'incorrect password': return 'Incorrect details. Please try again.';
		case 'no such company': return "This company does not exist.";
		case 'no such account': return "Username does not exist in company records.";
		default: return 'Incorrect details. Please try again.';
	}
}