import React from 'react';
import {Routes, Route} from "react-router-dom";

import Home from './components/Home';
import Load_LoginScreen from './components/Login';
import InputResponse from './components/InputResponse';
import GenerateQR from './components/GenerateQR';
import Homepage from './components/Homepage';
import Interactions from './components/Interactions';
import DisplayMngr from './components/DisplayMngr';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	document.title = "Test Application";
	
	return (
		<Routes>
			<Route exact path="/" element={<Home/>}/>
			<Route path="/login" element={<Load_LoginScreen/>}/>
			<Route path="/inputresponse" element={<InputResponse/>}/>
			<Route path="/gen_qr" element={<GenerateQR/>}/>
			<Route path="/homepage" element={<Homepage/>}/>
			<Route path="/interactions" element={<Interactions/>}/>
			<Route path="/display_mngr" element={<DisplayMngr/>}/>
 		</Routes>
	)
}

export default App;
