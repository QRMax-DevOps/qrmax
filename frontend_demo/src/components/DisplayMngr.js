import React, { Component } from 'react';
import Display from '../objects/DisplayObject';
import { getDisplays } from '../services/display_middleware';
import { HandleDisplay } from '../services/qr_middleware';
import './DisplayMngr.css';

import Sidebar from './Sidebar';

class DisplayMngr extends Component {
    constructor(props) {
        super(props);
        this.selectDisplay = this.selectDisplay.bind(this);
        this.fetchDisplays();
    }
    state = { 
        currentStore: "Some Store",
        currentObj: {displays: [{display: null}]},
        selectedDisplay: 0,
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

     fetchDisplays() {
        var url = "http://localhost:80/";
        var data = {company: "displayCompany", store: "displayStore"};

        let request = null;
        let response = [null,null];

        var me = this;
        var timer = {elapsed: 0};

        request = getDisplays("GETLIST", url, data, response);
        //request = HandleDisplay("GETLIST", url, data, response);
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
                    console.log(me.state.currentObj);
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
         this.fetchDisplays();
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
                    <input id="name-field" type="text" defaultValue={this.getSelectedDisplay().display}></input>
                    <br/>
                    <label htmlFor='status-field'>Status</label>
                    <input id="status-field" type="text" defaultValue={this.getSelectedDisplay().display}></input>
                    <br/>
                    <label htmlFor='cause-field' >Cause</label>
                    <input id="cause-field" type="text" defaultValue={this.getSelectedDisplay().display}></input>
                </div>
                <input type="button" id="update-button" className='buttons' value="Update"></input>
                <br/>
                <input type="button" id="create-button" className='buttons' value="Create New Display"></input>
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