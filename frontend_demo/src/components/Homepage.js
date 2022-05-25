/*
    Contributing Authors:
        Name:           Trent Russell
        Student No.:    5454244
*/

import React, { Component } from 'react';
import Sidebar from './Sidebar';
import './Homepage.css';
import '../App.css';
import {fetchAPI, getApiURL} from "./../services/core_mw"
import {HandleMedia} from "./../services/middleware/media_mw"
import { handleDisplay } from '../services/middleware/display_mw';
import QRCode from 'qrcode.react';
import Draggable from 'react-draggable';
import { getDefaultHeaders } from '../services/utilities/common_util';
import { ListenFor } from '../services/middleware/listen_mw';


class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: null,
            listenObj: null,
            baseMedia: {baseMedia: "", baseMediaFile: ""},
            selectedDisplay: 0,
            selectedMedia: 0,
            selectedMediaArray: [],
            displayMedia: {display: '', media: [{QRID: ""}]},
            currentObj: {displays: [{display: '', media: [], baseMedia: ''}]}, // set default empty values allowing screen loading before fetch
			media: null
        }
        var interval = 0;
        var interval2 = 0;
		this.store = "store1";
		this.display = "display1";
		this.mediaName = "london";
        this.setDisplay = this.setDisplay.bind(this);
		//this.getMedia();
    }

    mediaListen2() {
        var url = "http://localhost:80/";
        var data = {company: "demoCompany", store: "demoStore2", display: "display1"};
        
        var response = [null, null];
        var request = null;
        
        var me = this;
        var timer = 0;
        var json;

        request = ListenFor("LISTEN", url, data, response);

        this.interval2 = setInterval(function() {
            timer++;

            if(response[0] !== null) {
                //clearInterval(interval);
                me.setState({loading:false});

                if(response[0] === true){
                    
                    json = JSON.parse(response[1]);                   
                    me.setState({
                        listenObj: json,
                    });
                    
                }
            }

            //timeout after 3 seconds
            if(timer == 24) {
                console.log("Fetch-loop timeout!");
                me.setState({loading:false});
                clearInterval(this.interval2);
            }
        }, 5000);
    }

    

    // Makes a fetch request to the API to set the current object the screen will work with
    fillCurrentObject(target, type, data) {
        //var url = "https://api.qrmax.app/";
        var url = "http://localhost:80/";
        //var data = {company: "demoCompany", store: "demoStore2"};

        let request = null;
        let response = [null, null];

        var me = this;
        var timer = {elapsed: 0};
        var json;

        request = handleDisplay(target, type, url, data, response);

        this.interval = setInterval(function() {
            timer.elapsed++;
            
            if(response[0] !== null) {
                
                me.setState({loading:false});

                if(response[0] === true){
                    
                    json = JSON.parse(response[1]);
                    
                    switch(target) {
                        case "display":
                            me.setState({
                                currentObj: json
                            });
                            break;
                        case "display/media/basemedia":
                            console.log("setState baseMedia!");
                            me.setState({
                                baseMedia: json
                            });
                            break;
                        case "display/media":
                            me.setState({
                                displayMedia: json
                            });
                        default:
                            break;
                    }
                }
            }

            //timeout after 3 seconds
            if(timer.elapsed == 24) {
                console.log("Fetch-loop timeout!");
                me.setState({loading:false});
                clearInterval(this.interval);
            }
        }, 2500);
    }

    // Fetch request that returns the image linked to the highest voted media
	getMedia(type, _data) {

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
			company: _data.company,
			store: _data.store,
			display: _data.display,
			mediaName: _data.mediaName
		};

        let request = null
		let response = [null, null];
		request = HandleMedia(type, url, data, response);
		
		var timer = { eclapsed: 0 };
		var me = this;
        var json = null;
		
		var interval = setInterval(function() {
			timer.eclapsed++;
			
			if(response[0] !== null) {
				clearInterval(interval);
				me.setState({loading:false});

                
				if(response[0] === true){
					
                    var json = JSON.parse(response[1]);
				}

                console.log("getMedia: " + json)
                if(type = "GETLIST") {
                    me.setState({
                        displayMedia: json
                    });
                }
				
			}

			//timeout after 3 seconds
			if(timer.eclapsed == 24) {
				console.log("Fetch-loop timeout!");
				me.setState({loading:false});
				clearInterval(interval);
			}
		}, 500);
        return json;
	}

    setDisplay(e) {
        this.setState({
            selectedDisplay: e.target.value
        })
    }

    getDisplayImage() {
        console.log("Retrieving display image..");
        var image_string = ""
    
        var _data = {
            company: "demoCompany",
            store: "demoStore2",
            display: "display1",//this.state.currentObj.displays[this.state.selectedDisplay].display,
        }

        console.log("Checking Listen status: " +this.state.listenObj);

        if(this.state.listenObj != null) {
            _data.mediaName = this.state.listenObj.mediaName;
            image_string = this.getMedia("GETMEDIAFILE", _data);
        } else {
            image_string = this.state.baseMedia.baseMediaFile;
        }
        
        
        return image_string;
    }

    componentDidMount() {
        // load displays
        this.fillCurrentObject("display", "POST", {company: "demoCompany", store: "demoStore2"});
        // load QR media
        this.fillCurrentObject("display/media", "POST", {company: "demoCompany", store: "demoStore", display: "display1"});
        // load baseMedia
        this.fillCurrentObject("display/media/basemedia", "POST", {company: "demoCompany", 
                        store: "demoStore2", 
                        display: "display1"});
        //this.mediaListen2();
        console.log("Component did mount!");
    }

    componentWillUnmount() {
        console.log("Component is unmounting!");
        this.setState({
            passes: 0 // reset first pass attrib
        })
        clearInterval(this.interval);
        clearInterval(this.interval2);
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
							<p>Currently showing store: demoStore, display: {this.state.currentObj.displays[this.state.selectedDisplay].display}</p>
                            <select onChange={this.setDisplay}>
                                {this.state.currentObj.displays.map((val,key) => {
                                    return (
                                        <option name={val.display} value={key} key={key}>{val.display}</option>
                                    );
                                })}
                                
                            </select>
                        </div>

                        <div>
                            
                                {this.state.currentObj.displays[this.state.selectedDisplay].media.map((val, key) => {
                                    return (
                                        //<li className="qr-list-item" key={key}>
                                            <Draggable key={key}>
                                                    <QRCode className="qr" value={"http://localhost:3000/inputresponse?company=demoCompany&store=demoStore2&display=" + this.state.currentObj.displays[this.state.selectedDisplay].display + "&qrid=" + this.state.displayMedia.media[key].QRID}/>
                                            </Draggable>
                                        //</li>
                                    )
                                })}
                            
                        </div>

                        <div className="DisplayContainer" id="display-preview">
                            {/* display media source inside this div */}
                            <div id="media-source-container">
                                <br/>
                                <img className="image" src={this.getDisplayImage()}/> 
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
            );
    }
    
}

export default Homepage;