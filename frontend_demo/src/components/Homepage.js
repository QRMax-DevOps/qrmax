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
            prevPicture: null,
            newPicture: null,
            listenObj: null,
            baseMedia: {baseMedia: "", baseMediaFile: ""},
            selectedDisplay: 0,
            selectedMedia: 0,
            selectedMediaArray: [],
            displayMedia: {display: '', media: [{QRID: ""}]},
            currentObj: {displays: [{display: '', media: [], baseMedia: ''}]}, // set default empty values allowing screen loading before fetch
			media: null
        }
        this.setDisplay = this.setDisplay.bind(this);
		//this.getMedia();
    }

    mediaListen2() {
        var url = "http://localhost:4200/";
        var data = {company: "demoCompany", store: "demoStore2", display: "display1"};
        
        var response = [null, null];
        var request = null;
        
        var me = this;
        var timer = 0;
        var json;

        request = ListenFor("LISTEN", url, data, response);

        var interval = setInterval(function() {
            timer++;

            if(response[0] !== null) {
                clearInterval(interval);

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
                //me.setState({loading:false});
                clearInterval(interval);
            }
        }, 5000);
    }

    

    // Makes a fetch request to the API to set the current object the screen will work with
    fillCurrentObject(target, type, data) {
        //var url = "https://api.qrmax.app/";
        var url = "http://localhost:4200/";
        //var data = {company: "demoCompany", store: "demoStore2"};

        let request = null;
        let response = [null, null];

        var me = this;
        var timer = {elapsed: 0};
        var json;

        request = handleDisplay(target, type, url, data, response);

        var interval = setInterval(function() {
            timer.elapsed++;
            
            if(response[0] !== null) {
            
                clearInterval(interval);

                if(response[0] === true){
                    
                    json = JSON.parse(response[1]);
                    
                    switch(target) {
                        case "display":
                            me.setState({
                                currentObj: json
                            });
                            break;
                        case "display/media/basemedia":
                            me.setState({
                                prevPicture: this.state.newPicture,
                                newPicture: json.baseMediaFile
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
                //me.setState({loading:false});
                clearInterval(interval);
            }
        }, 2500);
    }

    // Fetch request that returns the image linked to the highest voted media
	async getMedia(type, _data) {

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
                
				if(response[0] === true){
					
                    json = JSON.parse(response[1]);
                    console.log("getMedia: ", json);
				}
				
			}
            
			//timeout after 3 seconds
			if(timer.eclapsed == 24) {
                console.log("Fetch-loop timeout!");
				//me.setState({loading:false});
				clearInterval(interval);
			}
		}, 5000);
        return json;
	}

    setDisplay(e) {
        this.setState({
            selectedDisplay: e.target.value
        })
    }

    async getDisplayImage() {
        var image_string = ""
    
        var _data = {
            company: "demoCompany",
            store: "demoStore2",
            display: "display1",//this.state.currentObj.displays[this.state.selectedDisplay].display,
        }

        console.log("Checking Listen status: " +this.state.listenObj);

        if(this.state.listenObj != null) {
            _data = {
                company: "demoCompany",
                store: "demoStore2",
                display: "display1",//this.state.currentObj.displays[this.state.selectedDisplay].display,
                mediaName: this.state.listenObj.display
            }
            console.log("_data:"+_data);
            image_string = await this.getMedia("GETMEDIAFILE", _data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } else {
            image_string = this.state.baseMedia.baseMediaFile;
        }
        console.log("Inside getMedia()");
        
        return image_string;
    }

    componentDidMount() {
        console.log("Component did mount!");
        // load displays
        this.fillCurrentObject("display", "POST", {company: "demoCompany", store: "demoStore2"});
        // load QR media
        this.fillCurrentObject("display/media", "POST", {company: "demoCompany", store: "demoStore2", display: "display1"});
        // load baseMedia
        this.fillCurrentObject("display/media/basemedia", "POST", {company: "demoCompany", 
                        store: "demoStore2", 
                        display: "display1"});
        this.mediaListen2();
    }

    componentDidUpdate(){
        console.log("Something is causing a re-render!");
    }

    componentWillUnmount() {
        console.log("Component is unmounting!");
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
                            {console.log(this.state.displayMedia.media[0].QRID)}
                                {this.state.currentObj.displays[0].media.map((val, key) => {
                                    return (
                                            <Draggable key={key}>
                                                    <QRCode className="qr" value={"http://localhost:3000/inputresponse?company=demoCompany&store=demoStore2&display=display1&qrid=" + this.state.displayMedia.media[0].QRID}/>
                                            </Draggable>
                                    )
                                })}
                            
                        </div>

                        <div className="DisplayContainer_Internal" id="display-preview">
                            {/* display media source inside this div */}
                            <div id="media-source-container">
                                <br/>
                                {console.log("Before calling the image")}
                                <img className="image" src={this.getDisplayImage()}/> 
                                {console.log("After calling the image")}
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        );
    }
    
    

}

const Child = ({data}) => (
    <img className='image' src={data.picture} />
);

export default Homepage;