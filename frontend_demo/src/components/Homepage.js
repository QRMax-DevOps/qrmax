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
            displayMedia: {display: '', media: [{QRID: ""}]},
            currentObj: [{displayName: '', media: []}], // set default empty values allowing screen loading before fetch
            imageString: null,
            qrStyle: "qr",
            imageStyle: "image",
            draggableStyle: "drag"
        }
        this.setDisplay = this.setDisplay.bind(this);
        this.goFullscreen = this.goFullscreen.bind(this);
        this.setStore = this.setStore.bind(this);
        this.listenCounter = 0;
        this.prevCount = 0;
        this.hidden = false;
    }

    goFullscreen() {
        if(this.state.fullscreen == false) {

            this.setState({
                qrStyle: "fullscreen-qr",
                imageStyle: "fullscreen-image",
                fullscreen: true
            })
        } else {
            this.setState({
                qrStyle: "qr",
                imageStyle: "image",
                fullscreen: false
            })
        }
    }



    setStore(e) {
        this.setState({
            selectedStore: e.target.value
        })
    }

    async fetchStores(isCompany, username, companyName) {
        var url = "https://api.qrmax.app/";
        //var url = "http://localhost:4200/";
        let request = null;
        let response = [null, null];

        var timer = 0;
        let me = this;

        request = await RunFetch_GetStores(isCompany, url, username, companyName, response);

        var completed = false;

        //var interval = setInterval(function() {
            //timer++;
            
            //console.log(timer)
            
            if(response[0] !== null) {
                //clearInterval(interval);
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
                //clearInterval(interval);
            }
        //}, 500);
        //return completed;
     }


    async fillCurrentObject(target, type, data) {
        var url = "https://api.qrmax.app/";
        //var url = "http://localhost:4200/";
        let request = null;
        let response = [null, null];

        var timer = 0;
        let me = this;

        request = await handleDisplay(target, type, url, data, response);

        var completed = false;

        //var interval = setInterval(function() {
            //timer++;
            
            //console.log(timer)
            
            if(response[0] !== null) {
                //clearInterval(interval);
                //me.setState({loading:false});

                if(response[0] === true){
                    
                    console.log("Check response NOTNULL "+response[1]);
                    var json = JSON.parse(response[1]);
                    switch(target) {
                        case "display":
                            completed = true;
                            me.setState({currentObj: json.displays});
                            break;
                        case "display/media":
                            completed = true;
                            me.setState({displayMedia: json, baseMedia: json.currentMedia});
                            break;
                        case "display/media/basemedia":
                            completed = true;
                            me.setState({baseMedia: json.baseMediaFile});
                            break;
                        case "display/media/file":
                            completed = true;
                            if(me.hidden == false) {
                                me.setState({baseMedia: json.mediaFile});
                            } else {
                                me.setState({baseMedia: json.mediaFile, qrStyle: "hidden"})
                            }
                            break;
                        default:
                            break;
                    }
                    
                }
            }

            //timeout after 3 seconds
            if(timer == 24) {
                console.log("Fetch-loop timeout!");
                //me.setState({loading:false});
                //clearInterval(interval);
            }
        //}, 500);
        //return completed;
     }

    async mediaListen2() {
        var url = "https://api.qrmax.app/";
        //var url = "http://localhost:4200/";
        var data = {company: sessionStorage.companyName, store: this.state.storesObj.stores[this.state.selectedStore].store, display: this.state.currentObj[this.state.selectedDisplay].displayName};
        
        var response = [null, null];
        var request = null;
        
        var me = this;
        var timer = 0;
        var json;

        request = await ListenFor("LISTEN", url, data, response);

        //var interval = setInterval(function() {
            //timer++;

            if(response[0] !== null) {
                //clearInterval(interval);

                me.prevCount = me.listenCounter;
                me.listenCounter++;
                me.hidden = !me.hidden;

                if(response[0] === true){
                    
                    json = JSON.parse(response[1]);                   

                    console.log("flag1");
                    me.fillCurrentObject("display/media/file", "POST", {company: sessionStorage.companyName,
                        store: me.state.storesObj.stores[me.state.selectedStore].store,
                        display: me.state.currentObj[me.state.selectedDisplay].displayName,
                        mediaName: json.display});
                    console.log("flag 2");
                }
            }

            //timeout after 3 seconds
            if(timer == 1000) {
                console.log("Fetch-loop timeout!");
                //clearInterval(interval);
            }
        //}, 500);
    }

    

    // Makes a fetch request to the API to set the current object the screen will work with
    fillCurrentObject1(target, type, data) {
        var url = "https://api.qrmax.app/";
        //var url = "http://localhost:4200/";
        //var data = {company: sessionStorage.companyName, store: this.state.storesObj.stores[this.state.selectedStore].store};

        let request = null;
        let response = [null, null];

        var me = this;
        var timer = {elapsed: 0};
        var completed = false;

        request = handleDisplay(target, type, url, data, response);

        var interval = setInterval(function() {
            timer.elapsed++;
            
            if(response[0] !== null) {
            
                clearInterval(interval);

                if(response[0] === true){
                    console.log("Before json def");
                    var json = JSON.parse(response[1]);
                    
                    console.log("Before switch");
                    switch(target) {
                        case "display":
                            console.log("Before set currentObj", json);
                            completed = true;
                            me.setState({
                                currentObj: json.displays,
                            });
                            console.log("after set currentObj");
                            break;
                        case "display/media/basemedia":
                            completed = true;
                            me.setState({
                                baseMedia: json.baseMediaFile,
                            });
                            break;
                        case "display/media":
                            completed = true;
                            me.setState({
                                baseMedia: json.currentMedia,
                                displayMedia: json
                            });
                            break;
                        case "display/media/file":
                            completed = true;
                            me.setState((prevState, props) => ({
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
        return completed;
    }

    setDisplay(e) {
        this.setState({
            selectedDisplay: e.target.value
        })
    }

    getQRID(index) {
        if(this.state.displayMedia.display != '') {
            return "https://qrmax.app/inputresponse?company=company&store=store&display=display&qrid=" + this.state.displayMedia.media[index].QRID;
        } else {
            return "https://qrmax.app/inputresponse?company=company&store=store&display=display&qrid= + this.state.displayMedia.media[key].QRID";
        }
    }

    async componentDidMount() {
        console.log("Component did mount!");
        console.log("Server has restarted 1");
        //load stores
        await this.fetchStores(false, sessionStorage.username, sessionStorage.companyName);
        //await new Promise(resolve => setTimeout(resolve, 500));
        if(this.state.storesObj.stores !=0) {
            // load displays
            await this.fillCurrentObject("display", "POST", {company: sessionStorage.companyName, store: this.state.storesObj.stores[this.state.selectedStore].store});
            //await new Promise(resolve => setTimeout(resolve, 500));
            if(this.state.storesObj.stores.length != 0 && this.state.currentObj.length != 0) {
                // load QR media
                await this.fillCurrentObject("display/media", "POST", {company: sessionStorage.companyName, store: this.state.storesObj.stores[this.state.selectedStore].store, display: this.state.currentObj[this.state.selectedDisplay].displayName});
                //await new Promise(resolve => setTimeout(resolve, 500));
                // load baseMedia
                await this.fillCurrentObject("display/media/file", "POST", {company: sessionStorage.companyName, 
                            store: this.state.storesObj.stores[this.state.selectedStore].store, 
                            display: this.state.currentObj[this.state.selectedDisplay].displayName, mediaName: this.state.baseMedia});
                //await new Promise(resolve => setTimeout(resolve, 500));
                // listen for user interaction
                await this.mediaListen2();
            }
        }
    }

    componentDidUpdate(){
        console.log("Something is causing a re-render!");

        console.log(this.prevCount + " " + this.listenCounter);
        if(this.prevCount < this.listenCounter) {
            this.listenCounter = 0;
            this.prevCount = 0;
            this.mediaListen2();
        }

    }

    /*componentWillUnmount() {
        console.log("Component is unmounting!", this.state.currentObj);
    }*/

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
							<p>Currently showing store: demoStore, display: {this.state.currentObj[this.state.selectedDisplay].displayName}</p>
                            <select onChange={this.setStore}>
                                {this.state.storesObj.stores.map((val, key) => {
                                    return (
                                        <option name={val.store} value={key} key={key}>{val.store}</option>
                                        );
                                    })}
                            </select>
                            <select onChange={this.setDisplay}>
                                {this.state.currentObj.map((val,key) => {
                                    return (
                                        <option name={val.displayName} value={key} key={key}>{val.displayName}</option>
                                        );
                                    })}
                                
                            </select>
                            <input type="button" value="Full Screen" onClick={this.goFullscreen}/>
                        </div>

                        <div>
                                {this.state.currentObj[this.state.selectedDisplay].media.map((val, key) => {
                                    return (
                                        <Draggable key={key} >
                                            <QRCode className={this.state.qrStyle} id={key} value={this.getQRID(key)}/>
                                        </Draggable>
                                    )
                                })}
                            
                        </div>

                        <div className="DisplayContainer_Internal" id="display-preview">
                            {/* display media source inside this div */}
                            <div id="media-source-container">
                                <br/>
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
                <div onClick={this.goFullscreen}>
                            {this.state.currentObj[this.state.selectedDisplay].media.map((val, key) => {
                                return (
                                    <Draggable key={key} >
                                        <label htmlFor={key}>{val.mediaName}</label>
                                        <QRCode className={this.state.qrStyle} id={key} value={this.getQRID(key)}/>
                                    </Draggable>
                                    )
                                })}
                    <div id="media-source-container">
                            <br/>
                            <img className={this.state.imageStyle} src={this.state.baseMedia}/> 
                            {console.log("After calling the image")}
                    </div>
                </div>
            );
        }
    }
    
    

}

export default Homepage;