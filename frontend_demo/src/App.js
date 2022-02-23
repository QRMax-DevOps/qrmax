import React from 'react';
import { createBrowserHistory } from "history";
import {Routes, Route} from "react-router-dom";

import Home from './components/Home';
import LoadLoginScreen from './components/Login';
import InputResponse from './components/InputResponse';
import GenerateQR from './components/GenerateQR';
import Homepage from './components/Homepage';
import Interactions from './components/Interactions';
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
			<Route path="/gen_qr" element={<GenerateQR/>}/>
			<Route path="/homepage" element={<Homepage/>}/>
			<Route path="/interactions" element={<Interactions/>}/>
			<Route path="/accounts" element={<AccountsManagement/>}/>
 		</Routes>
	)
}

export default App;
