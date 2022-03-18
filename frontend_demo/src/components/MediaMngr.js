import React, {Component} from 'react';
import Sidebar from './Sidebar';
import './MediaMngr.css';
import Media from '../objects/MediaObject';
import { SliderValueLabel } from '@mui/material';

class MediaMngr extends Component {
    constructor(props) {
        super(props);
        this.selectMedia = this.selectMedia.bind(this);
    }
    state = {
        currentDisplay: "Some Display",
        selectedDisplay: 0,
        mediaList: [
            new Media(0, "Media 1", "something"),
            new Media(1, "Media 2", "something"),
            new Media(2, "Media 3", "something"),
            new Media(3, "Media 4", "something"),
        ]
    }

    getMediaList() {

    }

    getCurrentDisplayObj(){
        return this.state.currentDisplay;
    }

    getSelectedMedia(){
        return this.state.mediaList[this.state.selectedMedia];
    }

    selectMedia(e) {
        this.setState({
            selectedMedia: e.target.value
        });
    }

    render() {
        return (
            <div className="background">
                <div>
                    <Sidebar/>
                </div>
                <div className="main-container">
                    <h2 className='page-header'>Media Management</h2>
                    <h4 id='selected-display'>Showing Display: {this.getCurrentDisplayObj()}</h4>
                    <ul id='media-list'>
                        {this.state.mediaList.map((val, key) => {
                            return (
                                <li className='media-list-item' key={key} value={val.getId()} onClick={this.selectMedia}>{val.getName()}</li>
                            );
                        })}
                    </ul>
                    <div id='settings-box'>
                        <h5 id='settings-box-header'></h5>
                        <label htmlFor='name-field'>Name</label>
                        <input id='name-field' type='text' value={this.getSelectedMedia().getName()}></input>
                        <br/>
                        <label htmlFor='content-field'>Content</label>
                        <input id='content-field' type='text' value={this.getSelectedMedia().getContent()}></input>
                        <br/>
                        <label htmlFor='length-field'>Length</label>
                        <input id='length-field' type='text' value={this.getSelectedMedia().getLength()}></input>
                    </div>
                    <input type='button' value='Create New Display'></input>
                </div>
            </div>
        );
    }
}

export default MediaMngr;