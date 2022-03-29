//If is symbol, will take e.g., Symbol("data") and return "data".
//This function is not exported and cannot be imported.
export function enumToString(value) {
	switch(typeof value) {
		case 'symbol':
			return value.description;
			
		case 'string':
			return value;
			
		default:
			return null;
	}
}

//Might seem unnecessary, but will be expanded upon later.
export function arrayToString(type,array){
	var strArray = array.toString();
	
	if(type.toUpperCase === 'BASIC') {
		return strArray;
	}
	else {
		strArray = "["+strArray+"]";
		return strArray;
	}
}
