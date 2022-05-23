/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Cody Spicer
 *  - Student ID: 6486125 */

import React, {Component} from 'react'; //including the reactjs package
import './MediaMngr.css'; //including the media manager CSS styling
import { ImageToBase64 } from '../services/utilities/base64_util'; //importing package to convert image to a string

import Sidebar from './Sidebar'; //including the navigation sidebar
import { handleDisplay } from '../services/middleware/display_mw'; //including the middleware to send requests and recieve data
import { Dropdown, DropdownButton } from 'react-bootstrap'; //includinf package for dropdown button

class MediaMngr extends Component {
    //initializing a constructor
    constructor(props) {
        super(props);
        this.selectMedia = this.selectMedia.bind(this);
        this.changeCurrentMediaInput = this.changeCurrentMediaInput.bind(this);
        this.changeCurrentMediaLength = this.changeCurrentMediaLength.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
        this.createMedia = this.createMedia.bind(this);
        this.deleteMedia = this.deleteMedia.bind(this);
        this.setSelectedFile = this.setSelectedFile.bind(this);
        this.fetchMedia = this.fetchMedia.bind(this);
        this.selectDisplay = this.selectDisplay.bind(this);
    }
    state = { //initializing the state
        currentDisplay: "None Selected",
        currentObj: {media: [{mediaName: ''},{TTL: '0'}]}, 
        currentObjDisplay: {displays: [{displayName: ""}]},
        selectedMedia: 0,
        mediaInput: '',
        mediaUpdate: 'default',
        mediaLength: '',
        open: false,
        imgString: null,
        mediaCount: 0
    }
    //retrieveing currentDisplay
    getCurrentDisplayObj(){
        return this.state.currentDisplay;
    }
    //retrieveing selectedMedia
    getSelectedMedia(){
        return this.state.currentObj.media[this.state.selectedMedia];
    }
    //changing selected display to that selected from the list
    selectDisplay(e){
        this.setState({
            currentDisplay: e.target.innerHTML
        });
        this.getMedia(e);
    }
    //changing selected media to that selected from the list
    selectMedia(e) {
        this.setState({
            selectedMedia: e.target.value,
            mediaInput: e.target.innerHTML,
            mediaUpdate: e.target.innerHTML,
        }); 
    }
    //fetching media once a display has been chosen
    getMedia(e){
        var data;
        this.fetchMedia("post", data = {company: this.state.currentCompany, store: this.state.currentStore, display: e.target.innerHTML}, 1);
    }
    //changing media input based on whats entered into the media name field
    changeCurrentMediaInput(e) {
        this.setState({
            mediaInput: e.target.value
        })
    }
    //changing media length based on whats entered into the media length field
    changeCurrentMediaLength(e) {
        this.setState({
            mediaLength: e.target.value
        })
    }
    //changing the selected file based on whats entered into the file part of entry form
    async setSelectedFile(e) {
        const file = e.target.files[0];
         const base64 = await this.getBase64(file);
         this.setState({
             imgString: base64
         })
    }
    //sending a request to patch media
    updateMedia(){
        if(this.state.selectedMedia < this.state.mediaCount){
        var newName = this.getNewName();
        var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, mediaName: this.state.mediaUpdate, fields: ["mediaName", "mediaFile", "TTL"], values: [newName, this.state.imgString, this.state.mediaLength]};
        this.fetchMedia("patch", data, 1);
        console.log("inside updateMedia");
        console.log(data);
        window.location.reload();
        }else{
            //ensuring the user can't update a non existent media 
            console.log("can't update new media")
            alert("You can't update +New Media")
        }
    }
    //retrieving the name input into the media name field
    getNewName() {
        return this.state.mediaInput;
    }
    //sending a request to put a created media
    createMedia() {
        let newName = this.getNewName();
        var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, mediaName: newName, mediaFile: this.state.imgString, TTL: this.state.mediaLength};
        this.fetchMedia("put", data, 1);
        window.location.reload();
    }
    //sending a request to delete a selected media
    deleteMedia() {
        if(this.state.selectedMedia < this.state.mediaCount){
            var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, mediaName: this.state.mediaInput};
            this.fetchMedia("delete", data, 1);
            window.location.reload();
        }else{
          console.log("can't delete null media")
          alert("You can't delete +New Media")
        }
    }

    //function to handle requests to the api and retrieve responses
    fetchMedia(type, data, objectCount) {
        var url = "http://localhost:80/";

        if(objectCount == 1)
        var target = "display/media";
        else
        var target = "display";

        let request = null;
        let response = [null,null];

        var me = this;
        var timer = {elapsed: 0};

        request = handleDisplay(target, type, url, data, response); 
        

        var interval = setInterval(function(){
            timer.elapsed++;

            if(response[0] !== null){
                clearInterval(interval);
                me.setState({loading:false});
                if(response[0] === true){
                    var json = JSON.parse(response[1]);
                    //fetching the displays of the appropriate store
                    if(objectCount == 1){
                    me.setState({currentObj: json});
                    }
                    //fetching media for a selected display
                    else{
                    me.setState({currentObjDisplay: json});
                    }
                
                }
            }
            if(timer.elapsed == 24) {
                console.log("Fetch-loop timeout!");
                me.setState({loading:false});
                clearInterval(interval);
            }
        }, 500);
    }
    //converting an entered file into a string which is easier to store
    getBase64(file) {
        return new Promise(function(resolve, reject){

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = (error) => {
                reject(error);
            }
        });
    }
    //an initial request made to fetch displats
    componentDidMount() {
        var data;
        this.fetchMedia("post", data = {company: this.state.currentCompany, store: this.state.currentStore}, 0);
        console.log("did mount");
    }


    render() {
        return (
            <div className="background">
                <div>
                    <Sidebar/>
                </div>
                <div className="main-container">
                    <div className='ViewerTitle'>Media Management</div> {/* main title */}
                    <h5 id='selected-display-header'>Showing Display: {this.getCurrentDisplayObj()}</h5> {/* shows selected display */}

                    <DropdownButton id="displayDrop" title="Display"> {/* A dropdown box that allows the user to select a display */}
                            {this.state.currentObjDisplay.displays.map((val, key) => {
                                return (
                                    <Dropdown.Item key={key} value={key} onClick={this.selectDisplay}>{val.displayName}</Dropdown.Item>
                                );
                            })}
                    </DropdownButton>

                    <div id="styled-container">
                        {/* a list of all media for the chosen display */}
                        <ul id='media-list'>

                            {this.state.currentObj.media.map((val, key) => {
                                {this.state.mediaCount = key + 1}
                                return (
                                 <li className='media-list-item' key={key} value={key} onClick={this.selectMedia}>{val.mediaName}</li>
                                 );
                             })}
                             <li className='media-list-item' key={this.state.mediaCount} value={this.state.mediaCount} onClick={this.selectMedia}>+New Media</li>
                             
                        </ul>
                        <div id='settings-box'>
                            <h5 id='settings-box-header'></h5>
                            {/* an input to allow the entry of a media name */}
                            <input id='name-field' type='text' placeholder='Media Name' onChange={this.changeCurrentMediaInput} value={this.state.mediaInput}></input>
                            {/* an input to allow the entry of media length in seconds */}
                            <input id='length-field' type='number' placeholder='Media Length (seconds)' onChange={this.changeCurrentMediaLength} value={this.state.mediaLength}></input>
                             {/* an input to allow the entry of a media file */}
                            <input type="file" onChange={this.setSelectedFile}/>

                        </div>
                        {/* a button that will alow the information of a selected media to be updated */}
                        <button type="submit" id="update-button" className='buttons' onClick={this.updateMedia}>Update Media</button>
                        <br/>
                        {/* a button that will send the information to be turned into a new media */}
                        <button type="button" id="create-button" className='buttons' onClick={this.createMedia}>Create New Media</button>   
                        <br/>
                        {/* a button that will delete the selected media */}
                        <button type="button" id="delete-button" className='buttons' onClick={this.deleteMedia}>Delete Media</button>
                        </div>
                        
                    </div>
            </div>
        );
    }
}

export default MediaMngr;