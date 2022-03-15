import React, { Component } from 'react';
import Display from '../objects/DisplayObject';
import Sidebar from './Sidebar';
import './DisplayMngr.css';

class DisplayMngr extends Component {
    constructor(props) {
        super(props);
        this.selectDisplay = this.selectDisplay.bind(this);
    }
    state = { 
        currentStore: "Some Store",
        selectedDisplay: 0,
        displayList: [
            new Display(0, "Display 1", "Something else"), 
            new Display(1, "Display 2", "Something else"),
            new Display(2, "Display 3", "Something else"),
            new Display(3, "Display 4", "Something else"),
            new Display(4, "Display 5", "Something else"),
            new Display(5, "Display 6", "Something else"),
        ]
     }

     getDsiplayList() {
         //Get display list for relative store from database
         //displayList = the retrieved list
     }

     getCurrentStoreObj() {
         return this.state.currentStore;
     }

     getSelectedDisplay() {
         return this.state.displayList[this.state.selectedDisplay];
     }

     selectDisplay(e) {
         this.setState({
             selectedDisplay: e.target.value
            });
     }

    render() { 
        return ( 
            <div className='background'>
                <div>
                    <Sidebar/>
                </div>
                <div className="main-container">
                    <h2 className="page-header">Display Management</h2>
                    <h4 id="selected-store-header">Showing store: {this.getCurrentStoreObj()}</h4>
                    <ul id="display-list">
                        {this.state.displayList.map((val, key) => {
                            return (
                                <li className="display-list-item" key={key} value={val.getId()} onClick={this.selectDisplay}>{val.getName()}</li>
                            );
                        })}
                    </ul>
                    <div id='settings-box'>
                        <h5 id="settings-box-header" ></h5>
                        <label htmlFor='name-field'>Name</label>
                        <input id="name-field" type="text" value={this.getSelectedDisplay().getName()}></input>
                        <br/>
                        <label htmlFor='status-field'>Status</label>
                        <input id="status-field" type="text" value={this.getSelectedDisplay().getId()}></input> {/**Should be status instead of ID */}
                        <br/>
                        <label htmlFor='cause-field' >Cause</label>
                        <input id="cause-field" type="text" value={this.getSelectedDisplay().getMedia()}></input>
                    </div>
                    <input type="button" value="Create New Display"></input>
                </div>
            </div>
         );
    }
}
 
export default DisplayMngr;

/*
    Passing objects to components
    Storing objects locally
    Creating QR
    Linking displays
    Writing interface design
    Similarity between adding codes and displays
    Using QR middleware
*/