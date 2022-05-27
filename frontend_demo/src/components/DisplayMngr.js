/*
    Contributing Authors:
        Name:               Trent Russell
        Student No.:        5454244
*/

import React, { Component } from 'react';
import { handleDisplay } from '../services/middleware/display_mw';
import './DisplayMngr.css';
import { ImageToBase64 } from '../services/utilities/base64_util';

import Sidebar from './Sidebar';
import { RunFetch_GetStores } from '../services/middleware/accounts_mw';

class DisplayMngr extends Component {
    constructor(props) {
        super(props);
        this.selectDisplay = this.selectDisplay.bind(this);
        this.changeCurrentDisplayInput = this.changeCurrentDisplayInput.bind(this);
        this.changeLat = this.changeLat.bind(this);
        this.changeLon = this.changeLon.bind(this);
        this.changeTTL = this.changeTTL.bind(this);
        this.changeDisplayType = this.changeDisplayType.bind(this);
        this.changeCurrentBaseMediaNameInput = this.changeCurrentBaseMediaNameInput.bind(this);
        this.updateDsiplay = this.updateDsiplay.bind(this);
        this.createDisplay = this.createDisplay.bind(this);
        this.deleteDisplay = this.deleteDisplay.bind(this);
        this.setSelectedFile = this.setSelectedFile.bind(this);

        var company = sessionStorage.companyName;
        var user = sessionStorage.username;
        
    
    }
    state = { 
        storesObj: {stores: [{store: ""}]},
        currentObj: {status: '', displays: [{displayName: ''}]},
        selectedDisplay: 0,
        selectedStore: 0,
        displayInput: 'default',
        ttlInput: null,
        createNewDisplayName: null,
        addressInput: null,
        open: false,
        lat: null,
        lon: null,
        baseMediaNameInput: null,
        displayType: null,
        baseMedia: null,
        selectedFile: null,
        imgString: null,
        API_KEY: "AIzaSyDEmUfbp_5C6GgMRIFIY8kPRaX37bPb06g"
     }

     setStore(e) {
         this.setState({
             selectedStore: e.target.value
         });
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
            baseMediaNameInput: e.target.value
         });
     }

     changeTTL(e) {
        this.setState({
            ttlInput: e.target.value
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
            company: sessionStorage.companyName, 
            store: this.state.storesObj.stores[this.state.selectedStore].store, 
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
         return this.state.ttlInput;
     }

     async setLatAndLong(){
        return fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+this.state.addressInput+'&key='+this.state.API_KEY)
        .then(response => response.json())
        .then(data => {
          const latitude = data.results[0].geometry.location.lat;
          const longitude = data.results[0].geometry.location.lng;
        });
     }

     async createDisplay() {
        let newName = this.getNewName();
        let newBaseMediaName = this.getNewBaseMediaName();
        console.log(newBaseMediaName);
        let newTTL = this.getTTL();
        console.log(newTTL);
        let newLat = this.getLat();
        let newLon = this.getLon();
        let newDisplayType = this.getDisplayType();
        var data = {
            company: sessionStorage.companyName, 
            store: this.state.storesObj.stores[this.state.selectedStore].store, 
            display: newName,
            lat: newLat,
            lon: newLon,
            displayType: newDisplayType
        };
        console.log(data);
            //baseMedia: newBaseMediaName,
            //baseMediaFile: this.state.imgString};
        let completed = await this.fetchDisplays("display", "CREATE", data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        data = {
            company: sessionStorage.companyName, 
            store: this.state.storesObj.stores[this.state.selectedStore].store, 
            display: newName,
            lat: newLat,
            lon: newLon,
            baseMedia: this.state.baseMediaNameInput,
            baseMediaFile: this.state.imgString,
            TTL: this.state.ttlInput
        };
        var loops = 0;
        while ( completed != true) {
            loops++;
            console.log(loops + " " +completed);
            if(loops = 10000) {
                completed = true;
            }
        }
        console.log(data);
        completed = await this.fetchDisplays("display/media/basemedia","PUT", data);
        await new Promise(resolve => setTimeout(resolve, 1000));
     }

     deleteDisplay() {
         var data = {company: sessionStorage.companyName, 
         store: this.state.storesObj.stores[this.state.selectedStore].store, 
         display: this.state.currentObj.displays[this.state.selectedDisplay].displayName
        };
         this.fetchDisplays("display", "DELETE", data);
     }

     async fetchStores(isCompany, username, companyName) {
        var url = "http://localhost:4200/";
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

     async fetchDisplays(target, type, data) {
        //var url = "https://api.qrmax.app/";
        var url = "http://localhost:4200/";

        let request = null;
        let response = [null,null];

        var me = this; // what is this
        var timer = {elapsed: 0};

        request = handleDisplay(target, type, url, data, response);
        
        var completed = false;
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
                        completed = true;
                        me.setState({currentObj: json});
                    }

                    if(target == "display/media/basemedia"){
                        if(type == "PUT") {
                            completed = true;
                        }
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
        return completed;
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

     async componentDidMount() {
         var data = {myname: "Trent"};
         data.lastname = "russell";
         console.log(data);
         let auth = await this.fetchStores(false, sessionStorage.username, sessionStorage.companyName);
         await new Promise(resolve => {setTimeout(resolve, 10000);});
         let auth2 = await this.fetchDisplays("display", "GETLIST", {company: sessionStorage.companyName, store: this.state.storesObj.stores[this.state.selectedStore].store});
         console.log("did mount");
     }

     componentDidUpdate(){
         console.log("Rendering");
     }

     /*componentDidUpdate(prevProps, prevState) {
        var data;
        if (
          prevState.currentObj.displays.length() !==
          this.state.currentObj.displays.length()
        ) {
          this.fetchDisplays(
            "GETLIST",
            (data = { company: "sessionStorage.companyName", store: this.state.storesObj.stores[this.state.selectedStore].store })
          );
          console.log("did update");
        }
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
                <div>
                    <select onChange={this.setStore}>
                        {this.state.storesObj.stores.map((val,key) => {
                                    return (
                                        <option name={val.store} value={key} key={key}>{val.store}</option>
                                    );
                        })}
                    </select>
                </div>
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
                        <input id="mediaName-field" type="text" placeholder='Base Media Name' onChange={this.changeCurrentBaseMediaNameInput}></input>
                        <input id="mediaLength-field" type="text" placeholder='Base Media Length' onChange={this.changeTTL}></input>
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
                </div>
            </div>
			</div>
         );
    }
}
 
export default DisplayMngr;