/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Cody Spicer
 *  - Student ID: 6486125 */

import React, {Component} from 'react';
import './MediaMngr.css';
import './UniversalStyle.css';
import { ImageToBase64 } from '../services/utilities/base64_util';

import Sidebar from './Sidebar';
import { handleDisplay } from '../services/middleware/display_mw';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class MediaMngr extends Component {
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
    state = {
        currentCompany: "mediaCompany",
        currentStore: "mediaStore",
        currentDisplay: "None Selected",
        currentObj: {media: [{mediaName: 'Nothing'},{TTL: '0'}]}, 
        currentObjDisplay: {displays: [{display: ""}]},
        selectedMedia: 0,
        mediaInput: '',
        mediaUpdate: 'default',
        mediaLength: '',
        open: false,
        imgString: null,
        mediaCount: 0
    }

    getCurrentDisplayObj(){
        return this.state.currentDisplay;
    }

    getSelectedMedia(){
        return this.state.currentObj.media[this.state.selectedMedia];
    }

    selectDisplay(e){
        this.setState({
            currentDisplay: e.target.innerHTML
        });
        this.getMedia(e);
    }

    selectMedia(e) {
        if(e.target.innerHTML == "+New Media"){
            this.setState({
                selectedMedia: e.target.value,
                mediaInput: e.target.innerHTML,
                mediaUpdate: e.target.innerHTML
            });
        }else{
            this.setState({
                selectedMedia: e.target.value,
                mediaInput: e.target.innerHTML,
                mediaUpdate: e.target.innerHTML,
            });
        }
    }

    getMedia(e){
        var data;
        this.fetchMedia("post", data = {company: this.state.currentCompany, store: this.state.currentStore, display: e.target.innerHTML}, 1);
    }

    changeCurrentMediaInput(e) {
        this.setState({
            mediaInput: e.target.value
        })
    }

    changeCurrentMediaLength(e) {
        this.setState({
            mediaLength: e.target.value
        })
    }

    async setSelectedFile(e) {
        const file = e.target.files[0];
         const base64 = await this.getBase64(file);
         this.setState({
             imgString: base64
         })
    }

    updateMedia(){
        if(this.state.selectedMedia < this.state.mediaCount){
        var newName = this.getNewName();
        var nameVar = "media";
        var fileVar = "mediaFile";
        var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, mediaName: this.state.mediaUpdate, fields: ["media", "mediaFile", "TTL"], values: [newName, this.state.imgString, this.state.mediaLength]};
        this.fetchMedia("patch", data, 1);
        console.log("inside updateMedia");
        console.log(data);
        }else{
            console.log("can't update new media")
            alert("You can't update +New Media")
        }
    }

    getNewName() {
        return this.state.mediaInput;
    }

    createMedia() {
        let newName = this.getNewName();
        var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, mediaName: newName, mediaFile: this.state.imgString, TTL: this.state.mediaLength};
        this.fetchMedia("put", data, 1);
    }

    deleteMedia() {
        if(this.state.selectedMedia < this.state.mediaCount){
            var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, mediaName: this.state.mediaInput};
            this.fetchMedia("delete", data, 1);
        }else{
          console.log("can't delete null media")
          alert("You can't delete +New Media")
        }
    }


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
                    if(objectCount == 1){
                    me.setState({currentObj: json});
                    }
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
                    <div className='ViewerTitle'>Media Management</div>
                    <h5 id='selected-display-header'>Showing Display: {this.getCurrentDisplayObj()}</h5>

                    <DropdownButton id="displayDrop" title="Display">
                            {this.state.currentObjDisplay.displays.map((val, key) => {
                                return (
                                    <Dropdown.Item key={key} value={key} onClick={this.selectDisplay}>{val.display}</Dropdown.Item>
                                );
                            })}
                    </DropdownButton>

                    <div id="styled-container">
                        <ul id='media-list'>

                            {this.state.currentObj.media.map((val, key) => {
                                {this.state.mediaCount = key + 1}
                                return (
                                 <li className='media-list-item' key={key} value={key} onClick={this.selectMedia}>{val.media}</li>
                                 );
                             })}
                             <li className='media-list-item' key={this.state.mediaCount} value={this.state.mediaCount} onClick={this.selectMedia}>+New Media</li>
                             
                        </ul>
                        <div id='settings-box'>
                            <h5 id='settings-box-header'></h5>
                            <input id='name-field' type='text' placeholder='Media Name' onChange={this.changeCurrentMediaInput} value={this.state.mediaInput}></input>

                            <input id='length-field' type='number' placeholder='Media Length (seconds)' onChange={this.changeCurrentMediaLength} value={this.state.mediaLength}></input>

                            <input type="file" onChange={this.setSelectedFile}/>

                        </div>
                        <button type="submit" id="update-button" className='buttons' onClick={this.updateMedia}>Update Media</button>
                        <br/>
                        <button type="button" id="create-button" className='buttons' onClick={this.createMedia}>Create New Media</button>   
                        <br/>
                        <button type="button" id="delete-button" className='buttons' onClick={this.deleteMedia}>Delete Media</button>
                        </div>
                        
                    </div>
            </div>
        );
    }
}

export default MediaMngr;