import React, {Component} from 'react';
import Sidebar from './Sidebar';
import './MediaMngr.css';
import Media from '../objects/MediaObject';
import {HandleMedia} from '../services/media_middleware';

class MediaMngr extends Component {
    constructor(props) {
        super(props);
        this.selectMedia = this.selectMedia.bind(this);
        this.fetchMedia();
    }
    state = {
        currentDisplay: "Some Display",
        currentObj: {medias: [{media: null}]},
        selectedMedia: 0,
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


    fetchMedia() {
        var url = "http://localhost:80/";
        var data = {company: "displayCompany", store: "displayStore", display: "mediaDisplay"};

        let request = null;
        let response = [null, null];

        var me = this;
        var timer = {elapsed: 0};

        request = HandleMedia("GETLIST", url, data, response);
        console.log(data.company + " " + data.store + " " + data.display);

        var interval = setInterval(function(){
            timer.elapsed++;

            if(response[0] !== null){
                clearInterval(interval);
                me.setState({loading:false});

                if(response[0] === true){
                    var json = JSON.parse(response[1]);

                    me.setState({currentObj: json});
                    console.log(me.state.currentObj);
                }
            }
            if(timer.elapsed == 24) {
                console.log("Fetch-loop timeout!");
                me.setState({loading:false});
                clearInterval(interval);
            }
        }, 500);
    }

    componentDidMount() {
        this.fetchMedia();
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
                    <ul id='media-list'>
                        {console.log(this.state.currentObj)}
                        {this.state.currentObj.map((val, key) => {
                            return (
                                <li className='media-list-item' key={key} value={key} onClick={this.selectMedia}>{val.media}</li>
                            );
                        })}
                    </ul>
                    <div id='settings-box'>
                        <h5 id='settings-box-header'></h5>
                        <label htmlFor='name-field'>Name</label>
                        <input id='name-field' type='text' value={this.getSelectedMedia().getName()}></input>
                        <br/>
                        <label htmlFor='file-field'>File</label>
                        <input id='file-field' type='text' value={this.getSelectedMedia().getFile()}></input>
                    </div>
                    <input type='button' id='update-button' className='buttons' value='Update'></input>
                    <br/>
                    <input type='button' id='create-button' className='buttons' value='Create New Display'></input>
                </div>
            </div>
        );
    }
}

export default MediaMngr;