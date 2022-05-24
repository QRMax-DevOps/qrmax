/*
    Contributing Authors:
        Name:               Trent Ruseell
        Student No.:        5454244

        
*/

import React, { Component } from 'react';
import { handleDisplay } from '../services/middleware/display_mw';
import { HandleDisplay } from '../services/middleware/qr_mw';
import './DisplayMngr.css';
import { ImageToBase64 } from '../services/utilities/base64_util';

import Sidebar from './Sidebar';

class DisplayMngr extends Component {
    constructor(props) {
        super(props);
        this.selectDisplay = this.selectDisplay.bind(this);
        this.changeCurrentDisplayInput = this.changeCurrentDisplayInput.bind(this);
        this.changeLat = this.changeLat.bind(this);
        this.changeLon = this.changeLon.bind(this);
        this.changeDisplayType = this.changeDisplayType.bind(this);
        this.changeCurrentBaseMediaNameInput = this.changeCurrentBaseMediaNameInput.bind(this);
        this.updateDsiplay = this.updateDsiplay.bind(this);
        this.createDisplay = this.createDisplay.bind(this);
        this.deleteDisplay = this.deleteDisplay.bind(this);
        this.setSelectedFile = this.setSelectedFile.bind(this);
    
    }
    state = { 
        currentStore: "demoStore2",
        currentObj: {status: '', displays: [{displayName: ''}]},
        selectedDisplay: 0,
        displayInput: 'default',
        createNewDisplayName: null,
        open: false,
        lat: null,
        lon: null,
        baseMediaNameInout: null,
        displayType: null,
        baseMedia: null,
        selectedFile: null,
        imgString: null
     }

     getDsiplayList() {
         //Get display list for relative store from database
         //displayList = the retrieved list
     }

     getCurrentStoreObj() {
         return this.state.currentStore;
     }

     getSelectedDisplay() {
         return this.state.currentObj.displays[this.state.selectedDisplay];
     }

     selectDisplay(e) {
        this.setState({
            selectedDisplay: e.target.value
        });
     }

     changeCurrentDisplayInput(e) {
        this.setState({
            displayInput: e.target.value
        })
     }

     changeCurrentBaseMediaNameInput(e) {
         this.setState({
            baseMediaNameInput: e.target.vlaue
         });
     }

     changeTTL(e) {
        this.setState({
            ttlInput: e.target.vlaue
         });
     }

     changeDisplayType(e) {
        this.setState({
            displayType: e.target.value
        });
     }

     changeLat(e) {
         this.setState({
             lat: e.target.value
         });
     }

     changeLon(e) {
        this.setState({
            lon: e.target.value
        });
    }

     async setSelectedFile(e) {
         const file = e.target.files[0];
         const base64 = await this.getBase64(file);
         this.setState({
             imgString: base64
         });
     }
    
     updateDsiplay(){
        var data = {
            id: "", 
            company: "demoCompany", 
            store: "demoStore", 
            displayName: this.state.displayInput};
        this.fetchDisplays("UPDATE", data);
        console.log("inside updateDisplay");
     }

     getNewName() {
         return this.state.displayInput;
     }

     getNewBaseMediaName() {
         return this.state.baseMediaNameInput;
     }

     getLat(){
         return this.state.lat;
     }

     getLon(){
         return this.state.lon;
     }

     getDisplayType() {
         return this.state.displayType;
     }

     getTTL(){
         return this.state.TTL;
     }

     createDisplay() {
        let newName = this.getNewName();
        let newBaseMediaName = this.getNewBaseMediaName();
        let newTTL = this.getTTL();
        let newLat = this.getLat();
        let newLon = this.getLon();
        let newDisplayType = this.getDisplayType();
        var data = {
            company: "demoCompany", 
            store: "demoStore2", 
            display: newName,
            lat: newLat,
            lon: newLon,
            displayType: newDisplayType
        };
        console.log(data);
            //baseMedia: newBaseMediaName,
            //baseMediaFile: this.state.imgString};
        this.fetchDisplays("CREATE", data);
        //this.fetchDisplays("GETLIST", data);
       /* data.baseMedia = newBaseMediaName;
        data.baseMediaFile = this.state.imgString;
        data.TTL = newTTL;
        this.fetchDisplays("CREATE", data);*/
     }

     deleteDisplay() {
         var data = {company: "demoCompany", 
         store: "demoStore", 
         displayName: this.state.currentObj.displays[this.state.selectedDisplay].displayName
        };
         this.fetchDisplays("DELETE", data);
     }

     fetchDisplays(type, data) {
        //var url = "https://api.qrmax.app/";
        var url = "http://localhost:80/";
        var target = "display";
        var data = {company: "demoCompany", store: "demoStore2"};

        let request = null;
        let response = [null,null];

        var me = this; // what is this
        var timer = {elapsed: 0};

        request = handleDisplay(target, type, url, data, response);
        

        var interval = setInterval(function() {
            timer.elapsed++;
            
            //console.log(timer)
            
            if(response[0] !== null) {
                clearInterval(interval);
                me.setState({loading:false});

                if(response[0] === true){
                    
                    console.log("Check response NOTNULL "+response[1]);
                    var json = JSON.parse(response[1]);
                    
                    if(type == "GETLIST"){
                        me.setState({currentObj: json});
                    }
                    console.log("Object notNull check: "+me.state.currentObj);
                }
            }

            //timeout after 3 seconds
            if(timer.elapsed == 24) {
                console.log("Fetch-loop timeout!");
                me.setState({loading:false});
                clearInterval(interval);
            }
        }, 500);
     }

     getBase64(file) {
         return new Promise(function(resolve, reject){

             const reader = new FileReader();
             reader.readAsDataURL(file);
             reader.onload = () => {
                 resolve(reader.result);
             };

            reader.onerror = (error) => {
                reject(error);
            };
         });
     }

     componentDidMount() {
         var data;
         this.fetchDisplays("GETLIST",  data = {company: "demoCompany", store: "demoStore2"});
         console.log("did mount");
     }

     /*componentDidUpdate(){
        var data;
        this.fetchDisplays("GETLIST",  data = {company: "demoCompany", store: "demoStore"});
        console.log("did update");
     }*/

    render() { 
        return (
			<div className="background">
                <div>
                    <Sidebar/>
                </div>
            <div className="main-container">
                <h2 className="page-header">Display Management</h2>
                <h4 id="selected-store-header">Showing store: {this.getCurrentStoreObj()}</h4>
                <div id="styled-container">

                    <ul id="display-list">
                        {console.log(this.state.currentObj)}
                        {this.state.currentObj.displays.map((val, key) => {
                                return (
                                    <li className="display-list-item" key={key} value={key} onClick={this.selectDisplay}>{val.displayName}</li>
                                    
                                );
                            })}
                    </ul>
                    {console.log(this.state.selectedFile)}
                    <div id='settings-box'>
                        <h5 id="settings-box-header" ></h5>
                        <input id="name-field" type="text" placeholder='Display Name' onChange={this.changeCurrentDisplayInput}></input>
                        <input id="lat-field" type="text" placeholder='Lattitude' onChange={this.changeLat}></input>
                        <input id="lon-field" type="text" placeholder='Longitude' onChange={this.changeLon}></input>
                        <input id="displayType-field" type="text" placeholder='Display Type' onChange={this.changeDisplayType}></input>
                        <input id="mediaName-field" type="text" placeholder='Media Name' onChange={this.changeCurrentBaseMediaNameInput}></input>
                        <input id="mediaLength-field" type="text" placeholder='Media Length' onChange={this.changeDisplayType}></input>
                        <input type="file" onChange={this.setSelectedFile}/>
                    </div>
                    <button 
                        type="submit"
                        id="update-button" 
                        className='buttons' 
                        onClick={this.updateDsiplay}
                        >
                        Update
                    </button> 
                    
                    <br/>
                    <button 
                        type="button" 
                        id="create-button" 
                        className='buttons'
                        onClick={this.createDisplay}
                    >
                        Create New Display
                    </button>
                    <br/>
                    <button 
                        type="button" 
                        id="delete-button" 
                        className='buttons'
                        onClick={this.deleteDisplay}
                    >
                        Delete Display
                    </button>
                    <br/>
                    <button 
                        type="button" 
                        id="check-button" 
                        className='buttons'
                        onClick={this.uploadImage}
                        
                    >
                        Check Image
                    </button>
                    {console.log("image string " + this.state.imgString)}
                </div>
            </div>
			</div>
         );
    }
}
 
export default DisplayMngr;