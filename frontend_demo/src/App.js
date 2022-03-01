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

import 'bootstrap/dist/css/bootstrap.min.css';

//const browserHistory = createBrowserHistory();

function App() {
	document.title = "Test Application";
	
	return (
		<Routes>
			<Route exact path="/" element={<Home/>}/>
			
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
 		</Routes>
	)
}

export default App;
