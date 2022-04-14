import React, {Component} from 'react';
import './MediaMngr.css';
import Media from '../objects/MediaObject';
import { ImageToBase64 } from '../services/utilities/base64_util';

import Sidebar from './Sidebar';
import {handleDisplay} from '../services/middleware/display_mw';

class MediaMngr extends Component {
    constructor(props) {
        super(props);
        this.selectMedia = this.selectMedia.bind(this);
        this.changeCurrentMediaInput = this.changeCurrentMediaInput.bind(this);
        this.updateMedia = this.updateMedia.bind(this);
        this.createMedia = this.createMedia.bind(this);
        this.deleteMedia = this.deleteMedia.bind(this);
        this.setSelectedFile = this.setSelectedFile.bind(this);
    }
    state = {
        currentDisplay: "Display1",
        currentObj: {displays: [{media: [{name: ''}]}]}, //needs displays array when using displayMW
        //also got rid of all "medias" mentions and replaced with the actual field name from DB
        selectedMedia: 0,
        mediaInput: 'default',
        createNewMediaName: null,
        open: false,
        selectedFile: null,
        imgString: null
    }

    
    getMediaList() {

    }

    getCurrentDisplayObj(){
        return this.state.currentDisplay;
    }

    getSelectedMedia(){
        return this.state.currentObj.media[this.state.selectedMedia];
    }

    selectMedia(e) {
        this.setState({
            selectedMedia: e.target.value
        });
    }

    changeCurrentMediaInput(e) {
        this.setState({
            mediaInput: e.target.value
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
        var data = {id: "623974c3aeefa6f0c1ccb22e", company: "displayCompany", store: "displayStore", display: "display1", media: this.state.mediaInput};
        this.fetchMedia("UPDATE", data);
        console.log("inside updateMedia");
    }

    getNewName() {
        return this.state.mediaInput;
    }

    createMedia() {
        let newName = this.getNewName();
        var data = {company: "displayCompany", store: "displayStore", display: "display1", media: newName, src: this.state.imgString};
        this.fetchMedia("CREATE", data);
    }

    deleteMedia() {
        var data = {company: "displayCompany", store: "displayStore", display: "display1", media: this.state.currentObj.media[this.state.selectedMedia].media};
        this.fetchMedia("DELETE", data);
    }


    fetchMedia(type, data) {
        var url = "http://localhost:80/";
        

        let request = null;
        let response = [null,null];

        var me = this;
        var timer = {elapsed: 0};

        request = handleDisplay('display', type, url, data, response); //Switched to displayMW
        

        var interval = setInterval(function(){
            timer.elapsed++;

            if(response[0] !== null){
                clearInterval(interval);
                me.setState({loading:false});

                if(response[0] === true){
                    var json = JSON.parse(response[1]);

                    me.setState({currentObj: json});
                    
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
        this.fetchMedia("GETLIST", data = {company: "displayCompany", store: "displayStore", display: "display1"});
        console.log("did mount");
    }


    render() {
        return (
            <div className="background">
                <div>
                    <Sidebar/>
                </div>
                <div className="main-container">
                    <h2 className='page-header'>Media Management</h2>
                    <h4 id='selected-display-header'>Showing Display: {this.getCurrentDisplayObj()}</h4>
                    <div id="styled-container">
                        <ul id='media-list'>
                            {console.log(this.state.currentObj)}
                            {this.state.currentObj.displays[0].media.map((val, key) => {
                                return (
                                 <li className='media-list-item' key={key} value={key} onClick={this.selectMedia}>{val.name}</li>
                                );
                             })}
                        </ul>
                        {console.log(this.state.currentObj)}
                        <div id='settings-box'>
                            <h5 id='settings-box-header'></h5>
                            <label htmlFor='name-field'>Name</label>
                            <input id='name-field' type='text' onChange={this.changeCurrentMediaInput}></input>
                            <input type="file" onChange={this.setSelectedFile}/>
                        </div>
                        <button type="submit" id="update-button" className='buttons' onClick={this.updateMedia}>Update</button>
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