/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React from 'react';
import { createBrowserHistory } from "history";
import {Routes, Route} from "react-router-dom";

import Home from './components/Home';
import LoadLoginScreen from './components/Login/Login';
import InputResponse from './components/InputResponse/InputResponse';
import InputResponse_Good from './components/InputResponse/Response_Good';
import InputResponse_Bad from './components/InputResponse/Response_Bad';
import InputResponse_Loading from './components/InputResponse/Response_Processing';
import GenerateQR from './components/GenerateQR';
import Homepage from './components/Homepage';
import Interactions from './components/Interactions';
import DisplayMngr from './components/DisplayMngr';
import AccountsManagement from './components/AccountsManagement/am_base';
import MediaMngr from './components/MediaMngr';
import TestEnv from './services/test_environment';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	document.title = "QRMAX | official web app";
	
	
	return (
		<Routes>
			<Route exact path="/" element={<LoadLoginScreen/>}/>
			
			<Route path="/login" element={<LoadLoginScreen/>}/>
			<Route path="/inputresponse" element={<InputResponse/>}/>
			<Route path="/inputresponse_good" element={<InputResponse_Good/>}/>
			<Route path="/inputresponse_bad" element={<InputResponse_Bad/>}/>
			<Route path="/inputresponse_processing" element={InputResponse_Loading(["dummyvalue"])}/>
			<Route path="/gen_qr" element={<GenerateQR/>}/>
			<Route path="/homepage" element={<Homepage/>}/>
			<Route path="/interactions" element={<Interactions/>}/>
			<Route path="/display_mngr" element={<DisplayMngr/>}/>
			<Route path="/accounts" element={<AccountsManagement/>}/>
			<Route path="/testenv" element={<TestEnv/>}/>
			<Route path="/media_mngr" element={<MediaMngr/>}/>
 		</Routes>
	)
}

export default App;
