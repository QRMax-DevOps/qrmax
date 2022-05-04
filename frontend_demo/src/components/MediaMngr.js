import React, {Component} from 'react';
import './MediaMngr.css';
import Media from '../objects/MediaObject';
import { ImageToBase64 } from '../services/utilities/base64_util';

import Sidebar from './Sidebar';
import { handleDisplay } from '../services/middleware/display_mw';

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
        currentObj: {media: [{mediaName: ''}]}, 
        selectedMedia: 0,
        mediaInput: 'default',
        mediaUpdate: 'default',
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

    selectMedia(e) {
        this.setState({
            selectedMedia: e.target.value,
            mediaInput: e.target.innerHTML,
            mediaUpdate: e.target.innerHTML
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
        if(this.state.selectedMedia < this.state.mediaCount){
        var newName = this.getNewName();
        var nameVar = "media";
        var fileVar = "mediaFile";
        var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, mediaName: this.state.mediaUpdate, fields: ["media", "mediaFile"], values: [newName, this.state.imgString]};
        this.fetchMedia("patch", data);
        console.log("inside updateMedia");
        console.log(data);
        }else{
            console.log("can't update new media")
        }
    }

    getNewName() {
        return this.state.mediaInput;
    }

    createMedia() {
        let newName = this.getNewName();
        var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, mediaName: newName, mediaFile: this.state.imgString};
        this.fetchMedia("put", data);
    }

    deleteMedia() {
        if(this.state.selectedMedia < this.state.mediaCount){
            var data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, mediaName: this.state.mediaInput};
            this.fetchMedia("delete", data);
        }else{
          console.log("can't delete null media")
        }
    }


    fetchMedia(type, data) {
        var url = "http://localhost:80/";
        var target = "display/media";

        let request = null;
        let response = [null,null];

        var me = this;
        var timer = {elapsed: 0};

        request = handleDisplay(target, type, url, data, response); 
        console.log("HEY THIS IS FOR TESTING PURPOSES SO MAKE SURE TO CHECK HERE");
        console.log(type, url, data);
        

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
        this.fetchMedia("post", data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay});
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
                                {this.state.mediaCount = key + 1}
                                return (
                                 <li className='media-list-item' key={key} value={key} onClick={this.selectMedia}>{val.media}</li>
                                 );
                             })}
                             <li className='media-list-item' key={this.state.mediaCount} value={this.state.mediaCount} onClick={this.selectMedia}>+New Media</li>
                             
                        </ul>
                        {console.log(this.state.selectedMedia)}
                        <div id='settings-box'>
                            <h5 id='settings-box-header'></h5>
                            <label htmlFor='name-field'>Name</label>
                            <input id='name-field' type='text' onChange={this.changeCurrentMediaInput} value={this.state.mediaInput}></input>
                            {console.log(this.state.mediaInput)}
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