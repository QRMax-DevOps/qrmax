import React, { Component } from 'react';
import Sidebar from './Sidebar';
import './Homepage.css';
import '../App.css';
import Card from 'react-bootstrap/Card';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import GenerateQR from "./GenerateQR";
import DisplayMngr from './DisplayMngr';
import Login from "./Login/Login";
import {getApiURL} from "./../services/core_mw"
import {HandleMedia} from "./../services/middleware/media_mw"

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDisplay: 0,
            selectedMedia: 0,
            selectedMediaArray: [],
            //Example objects to setup dynamic display
            displayList: [
                {id: 0, display: "display 1", media: [{id: 0, name: "media 1", mediaSource: "source", qrList: [{qrID: 0, qrCode: 0}, {qrID: 1, qrCode: 1}, {qrID: 2, qrCode: 2}]}, {id: 1, name: "media 2", mediaSource: "source", qrList: [{qrID: 0, qrCode: 0}, {qrID: 1, qrCode: 1}, {qrID: 2, qrCode: 2}]}]},
                {id: 1, display: "display 3", media: [{id: 0, name: "media 1", mediaSource: "source", qrList: [{qrID: 0, qrCode: 0}, {qrID: 1, qrCode: 1}, {qrID: 2, qrCode: 2}]}, {id: 1, name: "media 2", mediaSource: "source", qrList: [{qrID: 0, qrCode: 0}, {qrID: 1, qrCode: 1}, {qrID: 2, qrCode: 2}]}]},
                {id: 2, display: "display 2", media: [{id: 0, name: "media 1", mediaSource: "source", qrList: [{qrID: 0, qrCode: 0}, {qrID: 1, qrCode: 1}, {qrID: 2, qrCode: 2}]}, {id: 1, name: "media 2", mediaSource: "source", qrList: [{qrID: 0, qrCode: 0}, {qrID: 1, qrCode: 1}, {qrID: 2, qrCode: 2}]}]}
            ],
			media: null
        }
		this.store = "store1";
		this.display = "display1";
		this.mediaName = "cat2";
        this.setDisplay = this.setDisplay.bind(this);
        this.setMedia = this.setMedia.bind(this);
		this.getMedia();
    }

	getMedia() {

		//Marcus was here. Lol.
		//I am no longer supplying the parameters through URL params. They're stored in "Session Storage" now.
		var companynameParam = sessionStorage.companyName;
		var usernameParam = sessionStorage.username;
		
		var isLocalhostParam = false;
		if(sessionStorage.isLocalhost==='true' || sessionStorage.isLocalhost===true)
		{ isLocalhostParam = true; }
		
		var isCompanyParam = false;
		if(sessionStorage.isCompanyAccount==='true' || sessionStorage.isCompanyAccount===true)
		{ isCompanyParam = true; }
	
	
		var url = getApiURL(isLocalhostParam);
		let data = {
			company: companynameParam,
			store: this.store,
			display: this.display,
			mediaName: this.mediaName
		};
		let response = [null, null];
		HandleMedia("GETMEDIAFILE", url, data, response);
		
		var timer = { eclapsed: 0 };
		var me = this;
		
		var interval = setInterval(function() {
			timer.eclapsed++;
			
			//console.log(timer)
			
			if(response[0] !== null) {
				clearInterval(interval);
				me.setState({loading:false});

                
				if(response[0] === true){
					
                    var json = JSON.parse(response[1]);
                    me.setState({media:"data:image/png;base64," + json.mediaFile});
					console.log(me.state.media);
				}
				
			}

			//timeout after 3 seconds
			if(timer.eclapsed == 24) {
				console.log("Fetch-loop timeout!");
				me.setState({loading:false});
				clearInterval(interval);
			}
		}, 500);
	}

    setDisplay(e) {
        this.setState({
            selectedDisplay: e.target.value
        })
    }

    setMedia(e) {
        this.setState({
            selectedMedia: e.target.value
        })
        this.setMediaArray();
    }

    setMediaArray() {
        this.setState({
            selectedMediaArray: this.getMediaArray()
        })
        
    }

    getMediaArray() {
        return this.state.displayList[this.state.selectedDisplay].media;
    }
    
    getQrArray() {
        return this.getMediaArray[this.state.selectedMedia].qrList;
    }

    render() {
        
        return (
            <div className="background">
                <div>
                    <Sidebar/>   
                </div>
                <div className="MainContainer">
                    <div className="DisplayContainer">
                    <h2 className="page-header">Display Preivew</h2>
                        
                        <div id="dropContainer">
							<p>Currently showing store: {this.store}, display: {this.display}</p>
                        </div>
                        <div className="DisplayContainer" id="display-preview">
                            {/* display media source inside this div */}
                            <div id="media-source-container">
							<img src={this.state.media}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            );
    }
    
}

export default Homepage;