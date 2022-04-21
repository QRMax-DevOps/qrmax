import React, {Component} from 'react';
import './MediaMngr.css';
import Media from '../objects/MediaObject';
import { ImageToBase64 } from '../services/utilities/base64_util';

import Sidebar from './Sidebar';
import { HandleMedia } from '../services/middleware/media_mw';

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
        currentCompany: "mediaCompany",
        currentStore: "mediaStore",
        currentDisplay: "display1",
        currentObj: {media: [{name: 'testing'},{name: 'testingtwo'}]}, 
        selectedMedia: 0,
        mediaInput: 'default',
        open: false,
        imgString: null
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
        var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, media: this.state.mediaInput};
        this.fetchMedia("UPDATE", data);
        console.log("inside updateMedia");
    }

    getNewName() {
        return this.state.mediaInput;
    }

    createMedia() {
        let newName = this.getNewName();
        var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, media: newName, mediaFile: this.state.imgString};
        {console.log(data)}
        this.fetchMedia("CREATE", data);
    }

    deleteMedia() {
        var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, media: this.state.currentObj.mediaInput};
        this.fetchMedia("DELETE", data);
    }


    fetchMedia(type, data) {
        var url = "http://localhost:80/";
        

        let request = null;
        let response = [null,null];

        var me = this;
        var timer = {elapsed: 0};

        request = HandleMedia(type, url, data, response); 
        

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
        this.fetchMedia("GETLIST", data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay});
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
                            {this.state.currentObj.media.map((val, key) => {
                                return (
                                 <li className='media-list-item' key={key} value={key} onClick={this.selectMedia}>{val.name}</li>
                                );
                             })}
                        </ul>
                        {console.log(this.state.selectedMedia)}
                        <div id='settings-box'>
                            <h5 id='settings-box-header'></h5>
                            <label htmlFor='name-field'>Name</label>
                            <input id='name-field' type='text' onChange={this.changeCurrentMediaInput}></input>
                            {console.log(this.state.mediaInput)}
                            <input type="file" onChange={this.setSelectedFile}/>
                            <button type="button">Generate QR</button>
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