/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React from "react";
import {Row, Col, Image} from 'react-bootstrap';
import LoadingGif from '../../graphics/loading_response.gif'

export default function InputResponse(curState) {
         return (
			<div id="MainBox">
				<Image src={LoadingGif} style={{width:"60%", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
			</div>
         );
};