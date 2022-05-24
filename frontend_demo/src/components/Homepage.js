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
            selectedDisplay: 0,
            selectedMedia: -1,
            selectedMediaArray: [],
            oldMediaVotes: [],
            mediaVotes: [],
            displayMedia: {display: '', media: []},
            passes: 0,
            currentObj: {displays: [{display: '', media: [], baseMedia: ''}]}, // set default empty values allowing screen loading before fetch
			media: null
        }
        var interval = 0;
		this.store = "store1";
		this.display = "display1";
		this.mediaName = "london";
        this.setDisplay = this.setDisplay.bind(this);
        this.setMediaVotes = this.setMediaVotes.bind(this);
        this.setVotedMedia = this.setVotedMedia.bind(this);
        //this.fillObject = this.fillObject.bind(this);
		//this.getMedia();
    }

    // create an array of votes upon refresh to compare to previous votes and detect a change
    setMediaVotes() {
        
        var newVotes = []; // to store qr vote numbers
        var tempMediaArray = this.state.displayMedia.media; //Assign media array as temp
        for (var i = 0; i < tempMediaArray.length; i++) {
            newVotes[i] = tempMediaArray[i].voteCount //store voteCount in temp array
        }
        console.log(this.state.passes);
        if(this.state.passes > 1) {
            console.log("not first pass");
            this.setVotedMedia(newVotes);
        }
        
        console.log("Setting votes: " + newVotes);
        this.setState({
            passes: this.state.passes + 1,
            mediaVotes: newVotes //store voteCounts in state
        })
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

        var interval = setInterval(function() {
            timer++;
            console.log("Inside listen " + timer);
            console.log(response[1]);

            if(response[0] !== null) {
                clearInterval(interval)
                me.setState({loading:false});

                if(response[0] === true){
                    
                    console.log("Inside listen");
                    json = JSON.parse(response[1]);
                    console.log("Listen obj flag " + json);                    
                    me.setState({
                        listenObj: json,
                    });
                    //me.setMediaVotes();
                    
                }
            }

            //timeout after 3 seconds
            if(timer == 24) {
                console.log("Fetch-loop timeout!");
                me.setState({loading:false});
                clearInterval(interval);
            }
            console.log("Is it here now? " + me.state.listenObj);
        }, 5000);
    }

    async mediaListen() {
        var listenUrl = "http://localhost:80/api/v2/Display/media/listen";
        var requestOptions = {
            method: "POST",
            headers: getDefaultHeaders(),
            body: JSON.stringify({
                company: "demoCompany",
                store: "demoStore",
                display: "display1"
            })
        }

        var request = null;
        var response = [null, null];

        var me = this;
        var timer = 0;
        var json;

        response = await fetchAPI(listenUrl, requestOptions);
        
        var interval = setInterval(function() {
            timer++;
            console.log("Inside listen 1");
            
            if(response[0] !== null) {
                clearInterval(interval)
                me.setState({loading:false});

                if(response[0] === true){
                    
                    console.log("Inside listen");
                    json = JSON.parse(response[1]);
                                        
                    me.setState({
                        listenObj: json,
                    });
                    me.setMediaVotes();
                    console.log("Listen obj flag " + me.state.listenObj);
                }
            }

            //timeout after 3 seconds
            if(timer.elapsed == 24) {
                console.log("Fetch-loop timeout!");
                me.setState({loading:false});
                clearInterval(interval);
            }
            console.log("Is it here now? " + me.state.listenObj);
        }, 5000);
    }

    // Makes a fetch request to the API to set the current object the screen will work with
    fillCurrentObject() {
        //var url = "https://api.qrmax.app/";
        var url = "http://localhost:80/";
        var data = {company: "demoCompany", store: "demoStore2"};
        var data2 = {company: "dmeoCompany", store: "demoStore2", display: "display1"};

        let request = null;
        let request2 = null;
        let response = [null, null];
        let response2 = [null, null];

        var me = this;
        var timer = {elapsed: 0};
        var json;
        var json2;

        request = handleDisplay("display", "GETLIST", url, data, response);
        request2 = HandleMedia("GETLIST", url, data2, response2);
        console.log(data.company + " " + data.store);

        this.interval = setInterval(function() {
            timer.elapsed++;
            
            if(response[0] !== null) {
                
                me.setState({loading:false});

                if(response[0] === true){
                    
                    console.log("Inside fill");
                    json = JSON.parse(response[1]);
                    json2 = JSON.parse(response2[1]);
                    
                    me.setState({
                        currentObj: json,
                        displayMedia: json2
                    });
                    me.setMediaVotes();
                    console.log("Where is this " + me.state.currentObj);
                }
            }

            //timeout after 3 seconds
            if(timer.elapsed == 24) {
                console.log("Fetch-loop timeout!");
                me.setState({loading:false});
                clearInterval(this.interval);
            }
            console.log("Is it here now? " + me.state.currentObj);
        }, 5000);
    }

    // Fetch request that returns the image linked to the highest voted media
	getMedia(_data) {

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
		request = HandleMedia("GETMEDIAFILE", url, data, response);
		
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
        console.log(json);
        return json;
	}

    setDisplay(e) {
        this.setState({
            selectedDisplay: e.target.value
        })
    }

    getDisplayImage() {
        console.log("Retrieving display image..")
        var image_string = ""
        
        //console.log(this.state.selectedMedia);
        if(this.state.selectedMedia != -1 ) {
            console.log("Getting voted media");
            var _data = {
                company: "demoCompany",
                store: "demoStore",
                display: "display1",//this.state.currentObj.displays[this.state.selectedDisplay].display,
                mediaName: this.state.displayMedia.media[this.state.selectedMedia].mediaName
            }
            image_string = this.getMedia(_data);
        } else {
            console.log(this.state.currentObj.displays[this.state.selectedDisplay].baseMedia);
            console.log("Getting default image");
            image_string = this.state.currentObj.displays[this.state.selectedDisplay].baseMedia;
        }
        console.log(image_string);
        return image_string;
    }
    
    getQrArray() {
        return this.getMediaArray[this.state.selectedMedia].qrList;
    }

    getHighestVotedMedia() {
    
        let highestVote = 0;
        let media = null;
        this.state.currentObj.displays[this.state.selectedDisplay].media.forEach(element => {
            if(element.voteCount > highestVote){
                media = element;
                highestVote = element.voteCount;
            }
        });
        return media;
    }

    componentDidMount() {
        this.mediaListen2();
        //this.fillCurrentObject();
        console.log("Mount flag " + this.state.currentObj);
        //this.setMediaVotes();
        this.setState({
            passes: this.state.passes + 1
        })
    }

    componentWillUnmount() {
        console.log("unmounting");
        this.setState({
            passes: 0 // reset first pass attrib
        })
        clearInterval(this.interval);
    }

    setVotedMedia(newVotes) {
        
        var mediaChangedIndex = -1;  // var to track which qr vote increased
        for(var i = 0; i < newVotes.length; i++) {
            if(newVotes[i] > this.state.mediaVotes[i]) {
                mediaChangedIndex = i;
            }
        }
        if(mediaChangedIndex > -1) {
            mediaChangedIndex = this.state.displayMedia.media[mediaChangedIndex];
        }
        console.log("Media Chosen: " + mediaChangedIndex);
        this.setState({
            selectedMedia: mediaChangedIndex
        })
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
                            {/*console.log("Flag " + this.state.currentObj)*/}
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
                                                    <QRCode className="qr" value={"http://localhost:3000/inputresponse?company=demoCompany&store=demoStore&display=" + this.state.currentObj.displays[this.state.selectedDisplay].display + "&qrid=" + this.state.displayMedia.media[key].QRID}/>
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