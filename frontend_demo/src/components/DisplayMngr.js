import React, { Component } from 'react';
import Display from '../objects/DisplayObject';
import './DisplayMngr.css';

class DisplayMngr extends Component {
    constructor(props) {
        super(props);
    }
    state = { 
        currentStore: "Some Store",
        displayList: [
            new Display(1, "Display 1", "Something else"), 
            new Display(2, "Display 2", "Something else"),
            new Display(3, "Display 3", "Something else"),
            new Display(4, "Display 4", "Something else"),
            new Display(5, "Display 5", "Something else"),
            new Display(6, "Display 6", "Something else"),
        ]
     }

     getDsiplayList() {
         //Get display list for relative store from database
         //displayList = the retrieved list
     }

    render() { 
        return ( 
            <div className="main-container">
                <h2 className="page-header">Display Management</h2>
                <ul id="display-list">
                    {this.state.displayList.map((val, key) => {
                        return (
                            <li key={key} value={val.getId()}></li>
                        );
                    })}
                </ul>
                <div id='settings-box'>

                </div>
            </div>
         );
    }
}
 
export default DisplayMngr;