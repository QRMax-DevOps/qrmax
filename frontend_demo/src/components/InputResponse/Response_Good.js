/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React from "react";
import {Container, Row, Col, Image} from 'react-bootstrap';
import { useLocation } from "react-router-dom";
import GreenTickImage from '../../graphics/tick.png'
import { registerVote } from "../../services/ir_middleware";
import './InputResponse.css';

class ResponseGood extends React.Component {

	componentDidMount() {

		var _display = new URLSearchParams(useLocation.search).get("display");
		var _QRID = new URLSearchParams(useLocation.search).get("qrid")

		var url = "http://localhost:80/";
        var data = {company: "displayCompany", store: "displayStore", display: _display, QRID: _QRID};

        let request = null;
        let response = [null,null];

        var me = this;
        var timer = {elapsed: 0};

        request = registerVote("VOTE", url, data, response);
        

        var interval = setInterval(function() {
            timer.elapsed++;
            
            //console.log(timer)
            
            if(response[0] !== null) {
                clearInterval(interval);
                me.setState({loading:false});

                if(response[0] === true){
                    
                    var json = JSON.parse(response[1]);
                    
                    me.setState({currentObj: json});
                    //console.log(me.state.currentObj);
                }
            }

            //timeout after 3 seconds
            if(timer.elapsed == 24) {
                console.log("Fetch-loop timeout!");
                me.setState({loading:false});
                clearInterval(interval);
            }
        }, 500);

	}
 render() {
         return (
             <div>
				<div id="MainBox">
					<div style={{margin:"0", marginTop:"15vh"}}>
						<div id="TopRow">
							<Image src={GreenTickImage} style={{width:"150px", display:"block", marginLeft:"auto", marginRight:"auto"}}/>
						</div>
						<p style={{marginTop:"10px", fontSize:"25px", fontWeight:"bold", color:"rgb(0,153,0)"}}>
								Your input has<br/>
								been received
						</p>
					</div>
					
					<div style={{marginTop:"20px"}}>
						<div className="text-center" style={{margin:"0", height:"100%"}}>
							
							<p style={{fontSize:"20px", fontWeight:"500", color:"#949494"}}>
								Your opinion really is<br/> valuable and helps us<br/>improve our service.
								
							</p>
							<div style={{marginTop:"5vh"}}>
								<button id="GiveFeedbackButton">Give Feedback</button>
							</div>
						</div>
					</div>
				</div>
				
				<div className="footer">
					<p style={{textAlign:"center", color:"grey", fontSize:"12px", fontWeight:"500"}}>
						We acknowledge the Traditional Custodians of the Land, and pay respects to their Elders past and present.
					</p>
				</div>
            </div>

         );
     }
 }
 
 export default ResponseGood;