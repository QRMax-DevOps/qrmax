import React, {Component} from 'react';
import Sidebar from './Sidebar';
import './MediaMngr.css';
import Media from '../objects/MediaObject';

class MediaMngr extends Component {
    constructor(props) {
        super(props);
        this.selectMedia = this.selectMedia.bind(this);
    }
    state = {
        currentDisplay: "Some Display",
        selectedMedia: 0,
        mediaList: [
            new Media(0, "Media 1", "something1"),
            new Media(1, "Media 2", "something2"),
            new Media(2, "Media 3", "something3"),
            new Media(3, "Media 4", "something4"),
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
                    <h4 id='selected-display-header'>Showing Display: {this.getCurrentDisplayObj()}</h4>
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
                        <label htmlFor='file-field'>File</label>
                        <input id='file-field' type='text' value={this.getSelectedMedia().getFile()}></input>
                    </div>
                    <input type='button' value='Create New Media'></input>
                </div>
            </div>
        );
    }
}

export default MediaMngr;