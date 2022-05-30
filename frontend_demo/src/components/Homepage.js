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
import { RunFetch_GetStores } from '../services/middleware/accounts_mw';

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: null,
            fullscreen: false,
            unmounted: false,
            prevPicture: "",
            newPicture: "",
            listenObj: null,
            baseMedia: {baseMedia: "", baseMediaFile: ""},
            storesObj: {stores: [{store: ""}]},
            selectedDisplay: 0,
            selectedMedia: 0,
            selectedStore: 0,
            selectedMediaArray: [],
            displayMedia: {display: '', media: [{QRID: ""}]},
            currentObj: {displays: [{display: '', media: [], baseMedia: ''}]}, // set default empty values allowing screen loading before fetch
			media: null,
            imageString: null,
            qrStyle: "qr",
            imageStyle: "image",
            draggableStyle: "drag",
            listenCounter: 0
        }
        this.setDisplay = this.setDisplay.bind(this);
        this.getDisplayImage = this.getDisplayImage.bind(this);
        this.goFullscreen = this.goFullscreen.bind(this);
		//this.getMedia();
    }

    goFullscreen() {
        this.setState({
            qrStyle: "fullscreen-qr",
            imageStyle: "fullscreen-image",
            fullscreen: true
        })
    }

    incrementListenCount() {

    }

    setStore(e) {
        this.setState({
            selectedStore: e.target.value
        })
    }

    fetchStores(isCompany, username, companyName) {
        var url = "https://api.qrmax.app/";
        //var url = "http://localhost:4200/";
        let request = null;
        let response = [null, null];

        var timer = 0;
        let me = this;

        request = RunFetch_GetStores(isCompany, url, username, companyName, response);

        var completed = false;

        var interval = setInterval(function() {
            timer++;
            
            //console.log(timer)
            
            if(response[0] !== null) {
                clearInterval(interval);
                me.setState({loading:false});

                if(response[0] === true){
                    
                    console.log("Check response NOTNULL "+response[1]);
                    var json = JSON.parse(response[1]);
                    
                    completed = true;
                    me.setState({storesObj: json});
                }
            }

            //timeout after 3 seconds
            if(timer == 24) {
                console.log("Fetch-loop timeout!");
                me.setState({loading:false});
                clearInterval(interval);
            }
        }, 500);
        return completed;
     }

    mediaListen2() {
        var url = "https://api.qrmax.app/";
        //var url = "http://localhost:4200/";
        var data = {company: sessionStorage.companyName, store: this.state.storesObj.stores[this.state.selectedStore].store, display: this.state.currentObj.displays[this.state.selectedDisplay].display};
        
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
                    
                    me.fillCurrentObject("display/media/file", "POST", {company: sessionStorage.companyName,
                        store: this.state.storesObj.stores[this.state.selectedStore].store,
                        display: this.state.currentObj.displays[this.state.selectedDisplay].display,
                        mediaName: json.display});
                    
                }
            }

            //timeout after 3 seconds
            if(timer == 24) {
                console.log("Fetch-loop timeout!");
                //me.setState({loading:false});
                clearInterval(interval);
            }
        }, 500);
    }

    

    // Makes a fetch request to the API to set the current object the screen will work with
    fillCurrentObject(target, type, data) {
        var url = "https://api.qrmax.app/";
        //var url = "http://localhost:4200/";
        //var data = {company: sessionStorage.companyName, store: this.state.storesObj.stores[this.state.selectedStore].store};

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
                                baseMedia: json.baseMediaFile,
                                //prevPicture: this.state.newPicture
                            });
                            break;
                        case "display/media":
                            me.setState({
                                displayMedia: json
                            });
                            break;
                        case "display/media/file":
                            me.setState((prevState, props) => ({
                                //listenCounter: prevState.listenCounter + 1,
                                baseMedia: json.mediaFile
                            })); 
                            break;
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
        }, 500);
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
                
				if(response[0] === true){
					
                    json = JSON.parse(response[1]);
                    console.log("getMedia: ", json);
                    this.setState({
                        imageString: json
                    })
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

    getDisplayImage() {
        var image_string = ""
    
        var _data = {
            company: sessionStorage.companyName,
            store: this.state.storesObj.stores[this.state.selectedStore].store,
            display: this.state.currentObj.displays[this.state.selectedDisplay].display,//this.state.currentObj.displays[this.state.selectedDisplay].display,
        }

        console.log("Checking Listen status: " +this.state.listenObj);

        if(this.state.listenObj != null) {
            _data = {
                company: sessionStorage.companyName,
                store: this.state.storesObj.stores[this.state.selectedStore].store,
                display: this.state.currentObj.displays[this.state.selectedDisplay].display,//this.state.currentObj.displays[this.state.selectedDisplay].display,
                mediaName: this.state.listenObj.display
            }
            console.log("_data:"+_data);
            image_string = this.fillCurrentObject("display/media/file", "POST", _data);
            //await new Promise(resolve => setTimeout(resolve, 1000));
            
        } else {
            this.setState({
                imageString: this.state.baseMedia.baseMediaFile
            }); 
        }
        console.log("Inside getMedia()");
        
    }

    componentDidMount() {
        console.log("Component did mount!");
        //load stores
        this.fetchStores(false, sessionStorage.username, sessionStorage.companyName);
        // load displays
        this.fillCurrentObject("display", "POST", {company: sessionStorage.companyName, store: this.state.storesObj.stores[this.state.selectedStore].store});
        // load QR media
        this.fillCurrentObject("display/media", "POST", {company: sessionStorage.companyName, store: this.state.storesObj.stores[this.state.selectedStore].store, display: this.state.currentObj.displays[this.state.selectedDisplay].display});
        // load baseMedia
        this.fillCurrentObject("display/media/basemedia", "POST", {company: sessionStorage.companyName, 
                        store: this.state.storesObj.stores[this.state.selectedStore].store, 
                        display: this.state.currentObj.displays[this.state.selectedDisplay].display});
        //this.getDisplayImage();
        this.mediaListen2();
    }

    componentDidUpdate(){
        console.log("Something is causing a re-render!");
        /*if(this.state.listenCounter > 0 && this.state.listenCounter % 2 == 0 ) {
            this.mediaListen2();
        }*/
    }

    componentWillUnmount() {
        this.setState({
            unmounted: true
        })
        console.log("Component is unmounting!");
    }

    render() {
        if(this.state.fullscreen == false) {

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
                            <select onChange={this.setStore}>
                                {this.state.storesObj.stores.map((val, key) => {
                                    return (
                                        <option name={val.store} value={key} key={key}>{val.store}</option>
                                    );
                                })}
                            </select>
                            <select onChange={this.setDisplay}>
                                {console.log(this.state.currentObj)}
                                {this.state.currentObj.displays.map((val,key) => {
                                    return (
                                        <option name={val.displayName} value={key} key={key}>{val.displayName}</option>
                                    );
                                })}
                                
                            </select>
                            <input type="button" value="Full Screen" onClick={this.goFullscreen}/>
                        </div>

                        <div>
                            {console.log(this.state.displayMedia.media[0].QRID)}
                                {this.state.currentObj.displays[this.state.selectedDisplay].media.map((val, key) => {
                                    return (
                                        <Draggable key={key} >
                                            <QRCode className={this.state.qrStyle} value={"https://qrmax.app/inputresponse?company="+sessionStorage.companyName+"&store=demoStore1&display="+this.state.currentObj.displays[this.state.selectedDisplay]+"&qrid=" + this.state.displayMedia.media[key].QRID}/>
                                        </Draggable>
                                    )
                                })}
                            
                        </div>

                        <div className="DisplayContainer_Internal" id="display-preview">
                            {/* display media source inside this div */}
                            <div id="media-source-container">
                                <br/>
                                {console.log("The render image: " + this.state.imageString)}
                                <img className={this.state.imageStyle} src={this.state.baseMedia}/> 
                                {console.log("After calling the image")}
                            </div>
                        </div>                        
                    </div>
                </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div>
                            {this.state.currentObj.displays[this.state.selectedDisplay].media.map((val, key) => {
                                return (
                                    <Draggable key={key} >
                                        <QRCode className={this.state.qrStyle} value={"http://localhost:3000/inputresponse?company="+sessionStorage.companyName+"&store=demoStore1&display=display1&qrid=" + this.state.displayMedia.media[key].QRID}/>
                                    </Draggable>
                                    )
                                })}
                            
                    </div>
                    <div id="media-source-container">
                            <br/>
                            {console.log("The render image: " + this.state.imageString)}
                            <img className={this.state.imageStyle} src={this.state.baseMedia}/> 
                            {console.log("After calling the image")}
                    </div>
                </div>
            );
        }
    }
    
    

}

export default Homepage;