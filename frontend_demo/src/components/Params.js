import React from 'react';

let ParamData = '';
export function setParamData(dataSent) {
	ParamData = dataSent;
    console.log("Param Data: " + ParamData);
    return true;
}

export function getParamData() {
	return ParamData;
}
