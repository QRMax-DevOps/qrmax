import React, { Component } from 'react';
import Display from '../objects/DisplayObject';
import { getDisplays } from '../services/display_middleware';
import { HandleDisplay } from '../services/qr_middleware';
import './DisplayMngr.css';
import Popup from './Popup';

import Sidebar from './Sidebar';

class DisplayMngr extends Component {
    constructor(props) {
        super(props);
        this.selectDisplay = this.selectDisplay.bind(this);
        this.changeCurrentDisplayInput = this.changeCurrentDisplayInput.bind(this);
        this.updateDsiplay = this.updateDsiplay.bind(this);
        //this.createDisplayPopup = this.createDisplayPopup.bind(this);
        this.createDisplay = this.createDisplay.bind(this);
        this.deleteDisplay = this.deleteDisplay.bind(this);
        this.setSelectedFile = this.setSelectedFile.bind(this);
    }
    state = { 
        currentStore: "Some Store",
        currentObj: {displays: [{display: ''}]},
        selectedDisplay: 0,
        displayInput: 'default',
        createNewDisplayName: null,
        open: false,
        selectedFile: null
     }

     togglePop() {
         this.setState({
             open: !this.state.open
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

     setSelectedFile(e) {
         this.setState({
             selectedDisplay: e.target.files[0]
         })
     }

     updateDsiplay(){
        var data = {id: "6232a8819d0e35f4708ad8e8", company: "displayCompany", store: "displayStore", display: this.state.displayInput};
        this.fetchDisplays("UPDATE", data);
        console.log("inside updateDisplay");
     }

     getNewName() {
         return this.state.displayInput;
     }

     createDisplay() {
        let newName = this.getNewName();
        var data = {company: "displayCompany", store: "displayStore", display: newName};
        this.fetchDisplays("CREATE", data);
     }

     deleteDisplay() {
         var data = {company: "displayCompany", store: "displayStore", display: this.state.currentObj.displays[this.state.selectedDisplay].display};
         this.fetchDisplays("DELETE", data);
     }

     createDisplayPopup() {
        console.log("Clicked");
        return (
            <Popup/>
        );
     }

     fetchDisplays(type, data) {
        var url = "http://localhost:80/";
        //var data = {company: "displayCompany", store: "displayStore"};

        let request = null;
        let response = [null,null];

        var me = this;
        var timer = {elapsed: 0};

        request = getDisplays(type, url, data, response);
        console.log(data.company + " " + data.store);

        var interval = setInterval(function() {
            timer.elapsed++;
            
            //console.log(timer)
            
            if(response[0] !== null) {
                clearInterval(interval);
                me.setState({loading:false});

                if(response[0] === true){
                    
                    var json = JSON.parse(response[1]);
                    
                    me.setState({currentObj: json});
                    //console.log(me.state.currentObj);
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

     componentDidMount() {
         var data;
         this.fetchDisplays("GETLIST",  data = {company: "displayCompany", store: "displayStore"});
         console.log("did mount");
     }

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
                                <li className="display-list-item" key={key} value={key} onClick={this.selectDisplay}>{val.display}</li>
                                );
                            })}
                    </ul>
                    <div id='settings-box'>
                        <h5 id="settings-box-header" ></h5>
                        <label htmlFor='name-field'>Name</label>
                        <input id="name-field" type="text"  onChange={this.changeCurrentDisplayInput}></input>
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
                </div>
            </div>
			</div>
         );
    }
}
 
export default DisplayMngr;

/*
    Passing objects to components
    Storing objects locally
    Creating QR
    Linking displays
    Writing interface design
    Similarity between adding codes and displays
    Using QR middleware
*/