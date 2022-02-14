import React from 'react';
import {Routes, Route} from "react-router-dom";

import Home from './components/Home';
import Load_LoginScreen from './components/Login';
import InputResponse from './components/InputResponse';
import GenerateQR from './components/GenerateQR';
import Homepage from './components/Homepage';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	document.title = "Test Application";
	
	return (
		<Routes>
			<Route exact path="/" element={<Home/>}/>
			<Route path="/login" element={Load_LoginScreen()}/>
			<Route path="/inputresponse" element={<InputResponse/>}/>
			<Route path="/gen_qr" element={<GenerateQR/>}/>
			<Route path="/homepage" element={<Homepage/>}/>
		</Routes>
	)
}

export default App;
