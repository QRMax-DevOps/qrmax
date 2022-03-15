import React, { Component } from 'react';
import Sidebar from './Sidebar';
import './Homepage.css';
import '../App.css';
import QRCode from 'qrcode.react';
import Card from 'react-bootstrap/Card';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import GenerateQR from "./GenerateQR";
import DisplayMngr from './DisplayMngr';
import Login from "./Login/Login";

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
            ]
        }
        this.setDisplay = this.setDisplay.bind(this);
        this.setMedia = this.setMedia.bind(this);

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
        //var QRCode = require('qrcode.react');
        return (
            <div className="background">
                <div>
                    <Sidebar/>  
                </div>
                <div className="MainContainer">
                    <div className="DisplayContainer">
                    <h2 className="page-header">Display Preivew</h2>
                        
                        <div id="dropContainer">
                            <label htmlFor='displays-dropdown'>Select Display</label>
                            <select className="displays-dropdown dropdown" id="displays-dropdown" onChange={this.setDisplay}>
                                {/* Dynamically return options based on displays */}
                                {this.state.displayList.map((val, key) => {
                                    return (
                                        <option value={key} key={key}>
                                            {val.display} 
                                        </option>
                                    )
                                })}
                            </select>
                            <label htmlFor='media-dropdown'>Select Media</label>
                            <select className="media-dropdown dropdown" id="media-dropdown" onChange={this.setMedia}>
                                {/* Dynamically return options based on displays' media */}

                                {this.state.displayList[this.state.selectedDisplay].media.map((val, key) => {
                                    return (
                                        <option value={key} key={key}>
                                            {val.name} 
                                        </option>
                                    )
                                })}
                                
                            </select>
                        </div>
                        <div className="DisplayContainer" id="display-preview">
                            {/* display media source inside this div */}
                            <div id="media-source-container">
                                {/* get the array of qr codes from the currently selected media */} 
                                {/* cut out this bit of code to have the screen actually display */}
                                <div>
                                    <QRCode value="http://localhost:3000/inputresponse?company=testCompany&store=testStore&display=display1&qrid=123"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            );
    }
    
}

export default Homepage;