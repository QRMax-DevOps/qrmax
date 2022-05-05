import {arrayToString, getDefaultHeaders, getUnsupportedMethodMessage} from '../../utilities/common_util';

//HANDLES: display/media, display/media/file, display/media/refresh, display/media/positions
export function prepMediaCall(target, type, url, data, global) {

	var endpointGen = null; //Where this input is being sent to.
	var methodGen = null; //Generated 'method' (PATCH, GETLIST, PUT, POST, DELETE, ETC.)
	var inputGen  = null; //Generated 'input' or request body (The actual data or message we'll be sending)
	
	switch(target.toLowerCase()) {
		case 'display/media':
			endpointGen = url+'api/v1/display/media';
			switch(type.toUpperCase()) {
				case 'PUT':
					methodGen = 'PUT';
					inputGen  = JSON.stringify({
						company		: data.company,
						store		: data.store,
						display		: data.display,
						mediaName	: data.mediaName,

						mediaFile	: data.mediaFile
					});
					break;

				case 'POST':
					methodGen = 'POST';
					inputGen  = JSON.stringify({
						company	: data.company,
						store	: data.store,
						display	: data.display
					});
					break;
					
				case 'PATCH':
					methodGen = 'PATCH';
					inputGen  = JSON.stringify({
						company		: data.company,
						store		: data.store,
						display		: data.display,
						mediaName	: data.mediaName,
						fields		: arrayToString('BASIC',data.fields),
						values		: arrayToString('BASIC',data.values)

					});
					break;
					
				case 'DELETE':
					methodGen = 'DELETE';
					inputGen  = JSON.stringify({
						company		: data.company,
						store		: data.store,
						display		: data.display,
						mediaName	: data.mediaName,
						
					});
					break;
					
				default: //default should never be reached - improper methods are detected in base function
					global[0] = false;
					global[1] = getUnsupportedMethodMessage(type, endpointGen);
					break;
			}
			break;
		
		case 'display/media/file':
			endpointGen = url+'api/v1/display/media/file';
			switch(type.toUpperCase()) {
				case 'POST':
					methodGen = 'POST';
					inputGen  = JSON.stringify({
						company		: data.company,
						store		: data.store,
						display		: data.display,
						mediaName	: data.mediaName
					});
					break;
				
				default:
					global[0] = false;
					global[1] = getUnsupportedMethodMessage(type, endpointGen);
					break;
			}
			break;
		
		case 'display/media/refresh':
			endpointGen = url+'api/v1/display/media/refresh';
			switch(type.toUpperCase()) {
				case 'PATCH':
					methodGen = 'PATCH';
					inputGen  = JSON.stringify({
						company	: data.company,
						store	: data.store,
						display	: data.display,
						mediaName	: data.mediaName
					});
					break;
					
				default:
					global[0] = false;
					global[1] = getUnsupportedMethodMessage(type, endpointGen);
					break;
			}
			break;
		
		case 'display/media/positions':
			endpointGen = url+'api/v1/display/media/positions';
			switch(type.toUpperCase()) {
				case 'PUT':
					methodGen = 'PUT';
					inputGen  = JSON.stringify({
						company		: data.company,
						store		: data.store,
						display		: data.display,
						QRID		: data.QRID,
						position	: data.position
					});
					break;
					
				case 'PATCH':
					methodGen = 'PATCH';
					inputGen  = JSON.stringify({
						company		: data.company,
						store		: data.store,
						display		: data.display,
						QRID		: data.QRID,
						fields	: arrayToString('BASIC',data.fields),
						values	: arrayToString('BASIC',data.values)
					});
					break;
					
				case 'POST':
					methodGen = 'POST';
					inputGen  = JSON.stringify({
						company		: data.company,
						store		: data.store,
						display		: data.display,
						QRID		: data.QRID
					});
					break;
					
				case 'DELETE':
					methodGen = 'DELETE';
					inputGen  = JSON.stringify({
						company		: data.company,
						store		: data.store,
						display		: data.display,
						QRID		: data.QRID
					});
					break;
					
				default:
					global[0] = false;
					global[1] = getUnsupportedMethodMessage(type, endpointGen);
					break;
			}
			break;
			
		default:
			global[0] = false;
			global[1] = "Forced rejection of request:\n      > In function --> \"handleDisplay()\" --> \"prepMediaCall()\": Unrecognised \"target\" ("+target+")";	
			return;
	}
	
	const requestOptions = {
		endpoint	: endpointGen,
		method		: methodGen,
		headers		: getDefaultHeaders(),
		body		: inputGen
	};
	
	return requestOptions;
}