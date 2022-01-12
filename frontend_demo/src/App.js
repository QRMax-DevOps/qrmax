import React from 'react';
import {Routes, Route} from "react-router-dom";

import Home from './components/Home';
import Login from './components/Login';
import ResponseGood from './components/Response_Good';
import ResponseBad from './components/Response_Bad';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	document.title = "Test Application";
	
	return (
		<Routes>
			<Route exact path="/" element={<Home/>}/>
			<Route path="/login" element={<Login/>}/>
			<Route path="/response_good" element={<ResponseGood/>}/>
			<Route path="/response_bad" element={<ResponseBad/>}/>
		</Routes>
	)
}

export default App;
