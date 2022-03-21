import React, { Component } from 'react';
import Sidebar from './Sidebar';
import './Homepage.css';
import '../App.css';
import {getApiURL} from "./../services/middleware_core"
import {HandleMedia} from "./../services/media_middleware"
import { getDisplays } from '../services/display_middleware';
import QRCode from 'qrcode.react';
import Draggable from 'react-draggable';


class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDisplay: 0,
            selectedMedia: 0,
            selectedMediaArray: [],
            currentObj: {displays: [{display: '', media: [{mediasrc: '', QRID: ''}], src: ''}]},
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
		//this.getMedia();
    }

    fillCurrentObject() {
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

	getMedia() {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		var companynameParam = urlParams.get('companyname');
		var isLocalhostParam = urlParams.get('localhost');
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

    componentDidMount() {
        this.fillCurrentObject();
        //this.selectedDisplay = this.state.currentObj.displays[0].display;
        console.log(this.state.currentObj);
        console.log("did mount");
    }

    getImage() {
        var image = new Image();
        image.src = this.state.currentObj.displays[0].src;
        return image;
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
                            <select onChange={this.setDisplay}>
                                {this.state.currentObj.displays.map((val,key) => {
                                    return (
                                        <option name={val.display} value={key} key={key}>{val.display}</option>
                                    );
                                })}
                                {console.log("Flag " + this.state.currentObj)}
                            </select>
                        </div>
                        <div className="DisplayContainer" id="display-preview">
                            {/* display media source inside this div */}
                            <div id="media-source-container">
                                <img src={this.state.media}/>
                                <br/>
                                <img className="image" src={this.state.currentObj.displays[this.state.selectedDisplay].src}/>
                                {this.state.currentObj.displays[this.state.selectedDisplay].media.map((val, key) => {
                                    return (
                                        <Draggable key={key}>
                                                <QRCode className="qr" value={"http://localhost:3000/inputresponse?company=displayCompany&store=displayStore&display=" + this.state.currentObj.displays[this.state.selectedDisplay].display + "&qrid=" + this.state.currentObj.displays[this.state.selectedDisplay].media[key].QRID}/>
                                        </Draggable>
                                    )
                                })}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            );
    }
    
}

export default Homepage;