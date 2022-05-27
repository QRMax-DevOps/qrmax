import {arrayToString, getDefaultHeaders, getUnsupportedMethodMessage} from '../../utilities/common_util';

//HANDLES: display, display/settings and display/interactions.
export function prepDisplayCall(target, type, url, data, global) {
	
	var endpointGen = null; //Where this input is being sent to.
	var methodGen = null; //Generated 'method' (PATCH, GETLIST, PUT, POST, DELETE, ETC.)
	var inputGen  = null; //Generated 'input' or request body (The actual data or message we'll be sending)
	
	switch(target.toLowerCase()) {
		case 'display':
			endpointGen = url+'api/v2/display';
			switch(type.toUpperCase()) {
				case 'PUT':
					methodGen = 'PUT';
					inputGen  = JSON.stringify({
						company		: data.company,
						store		: data.store,
						display		: data.display,
						//location	: data.location,
						lat			: data.lat,
						lon			: data.lon,
						displayType	: data.displayType
					});
					break;

				case 'DELETE':
					methodGen = 'DELETE';
					inputGen  = JSON.stringify({
						company	: data.company,
						store	: data.store,
						display	: data.display
					});
					break;
					
				case 'POST':
					methodGen = 'POST';
					inputGen  = JSON.stringify({
						company	: data.company,
						store	: data.store
					});
					break;
					
				default:
					global[0] = false;
					global[1] = getUnsupportedMethodMessage(type, endpointGen);
					break;
			}
			break;
		
		case 'display/interactions':
			endpointGen = url+'api/v2/display/interactions';
			switch(type.toUpperCase()) {
				case 'POST':
					methodGen = 'POST';
					inputGen  = JSON.stringify({
						company	: data.company,
						store	: data.store,
						display	: data.display,
						period	: data.period
					});
					break;
					
				default:
					global[0] = false;
					global[1] = getUnsupportedMethodMessage(type, endpointGen);
					break;
			}
			break;
		
		case 'display/settings':
			endpointGen = url+'api/v2/display/settings';
			switch(type.toUpperCase()) {
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
						company	: data.company,
						store	: data.store,
						display	: data.display,
						fields	: arrayToString('BASIC',data.fields),
						values	: arrayToString('BASIC',data.values)
					});
					break;
				default:
					global[0] = false;
					global[1] = getUnsupportedMethodMessage(type, endpointGen);
					break;
			}
			break;
		case 'display/media/baseMedia':
			endpointGen = url+'api/v2/display/media/baseMedia';
			case 'PUT':
				methodGen = 'PUT';
				inputGen = JSON.stringify({
					company: data.company,
					store: data.store,
					display: data.display,
					baseMedia: data.baseMedia,
					baseMediaFile: data.baseMediaFile,
					TTL: data.TTL
				});
				break;
			break;
		default:
			global[0] = false;
			global[1] = "Forced rejection of request:\n      > In function --> \"handleDisplay()\" --> \"prepDisplayCall()\": Unrecognised \"target\" ("+target+")";	
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