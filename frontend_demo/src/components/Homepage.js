import React, { Component } from 'react';
import Sidebar from './Sidebar';
import './Homepage.css';
import '../App.css';
import {getApiURL} from "./../services/core_mw"
import {HandleMedia} from "./../services/middleware/media_mw"
import { getDisplays } from '../services/display_middleware';
import QRCode from 'qrcode.react';
import Draggable from 'react-draggable';
import { ListenTo } from '../services/deprecated/(demo) listener_mw';


class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: null,
            selectedDisplay: 0,
            selectedMedia: -1,
            selectedMediaArray: [],
            oldMediaVotes: [],
            mediaVotes: [],
            firstPass: true,
            currentObj: {displays: [{display: '', media: [{mediasrc: '', QRID: ''}], src: ''}]},
            //Example objects to setup dynamic display
			media: null
        }
        var interval = 0;
		this.store = "store1";
		this.display = "display1";
		this.mediaName = "london";
        this.setDisplay = this.setDisplay.bind(this);
        this.setMedia = this.setMedia.bind(this);
        this.setMediaVotes = this.setMediaVotes.bind(this);
        this.setVotedMedia = this.setVotedMedia.bind(this);
        //this.fillObject = this.fillObject.bind(this);
		//this.getMedia();
    }

    setMediaVotes() {
        console.log("Setting votes...")
        var newVotes = []; // to store qr vote numbers
        var tempMediaArray = this.state.currentObj.displays[this.state.selectedDisplay].media; //Assign media array as temp
        for (var i = 0; i < tempMediaArray.length; i++) {
            newVotes[i] = tempMediaArray[i].voteCount //store voteCount in temp array
        }
        if(this.state.firstPass == false) {
            this.setVotedMedia(newVotes);
        }
        
        this.setState({
            mediaVotes: newVotes //store voteCounts in state
        })
    }

    fillCurrentObject() {
        var url = "http://localhost:80/";
        var data = {company: "demoCompany", store: "demoStore"};

        let request = null;
        let response = [null, null];

        var me = this;
        var timer = {elapsed: 0};
        var json;

        request = getDisplays("GETLIST", url, data, response);
        console.log(data.company + " " + data.store);

        this.interval = setInterval(function() {
            timer.elapsed++;
            
            if(response[0] !== null) {
                
                me.setState({loading:false});

                if(response[0] === true){
                    
                    console.log("Inside fill")
                    json = JSON.parse(response[1]);
                    
                    me.setState({currentObj: json});
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

    async loadData() {
        var url = "http://localhost:80/";
        var data = {company: "demoCompany", store: "demoStore"};

        let request = null;
        let response = [null,null];

        var me = this;
        var timer = {elapsed: 0};

        request = getDisplays("GETLIST", url, data, response);


    }

	getMedia(_data) {

		//Marcus was here. Lol.
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
			
			//console.log(timer)
			
			if(response[0] !== null) {
				clearInterval(interval);
				me.setState({loading:false});

                
				if(response[0] === true){
					
                    var json = JSON.parse(response[1]);
                    //me.setState({media:"data:image/png;base64," + json.mediaFile});
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
                mediaName: this.state.currentObj.displays[this.state.selectedDisplay].display.media[this.state.selectedMedia].media
            }
            image_string = this.getMedia(_data);
        } else {
            console.log(this.state.currentObj.displays[this.state.selectedDisplay].src);
            console.log("Getting default image");
            image_string = this.state.currentObj.displays[this.state.selectedDisplay].src;
        }
        console.log(image_string);
        return image_string;
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

    //unused
    /*async fillObject() {
        var url = "http://localhost:80/";
        var data = {company: "demoCompany", store: "demoStore"};

        let request = null;
        let response = [null,null];
        request = await getDisplays("GETLIST", url, data, response);
        var json = JSON.parse(response[1]);
        return json;

    } */

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
        this.fillCurrentObject();
        console.log("Mount flag " + this.state.currentObj);
        this.setMediaVotes();
        this.setState({
            firstPass: false
        })
    }

    componentWillUnmount() {
        console.log("unmounting");
        this.setState({
            firstPass: true // reset first pass attrib
        })
        clearInterval(this.interval);
    }

    async getItems() {
        fetch("http://localhost:80/Display")
            .then(result => result.json())
            .then(result => this.setState({items: result}))
    }

    

    setVotedMedia(newVotes) {
        console.log("Choosing voted media...")
        var mediaChangedIndex = -1;  // var to track which qr vote increased
        for(var i = 0; i < newVotes.length; i++) {
            if(newVotes[i] > this.state.mediaVotes[i]) {
                mediaChangedIndex = i;
            }
        }
        if(mediaChangedIndex > -1) {
            mediaChangedIndex = this.state.currentObj.displays[this.selectedDisplay].media[mediaChangedIndex];
        }
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
                                                    <QRCode className="qr" value={"http://localhost:3000/inputresponse?company=demoCompany&store=demoStore&display=" + this.state.currentObj.displays[this.state.selectedDisplay].display + "&qrid=" + this.state.currentObj.displays[this.state.selectedDisplay].media[key].QRID}/>
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