import React, {Component, setState} from 'react';
import Button from 'react-bootstrap/Button';
import './GenerateQR.css';
import Sidebar from './Sidebar';
import Display from '../objects/DisplayObject.js';
import QRCode from '../objects/QRCode.js';
import {HandleDisplay} from '../services/qr_middleware';

class GenerateQR extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentObj: {},
            displayIndex: 0,
            displayList: [new Display(0, 'Display 1', 5), new Display(1, 'Display 2', 4), new Display(2, 'Display 3', 10)],
            selectedCode: 0
        };
        this.setCodeList = this.setCodeList.bind(this);
        this.selectCode = this.selectCode.bind(this);
        this.getObject = this.getObject.bind(this);
    }

    getCurrentDisplayObj = function() {
        return this.state.displayList[this.state.displayIndex];
    }

    setCodeList(e) {
        this.setState({
            displayIndex: e.target.value
        })
    }

    selectCode(e) {
        this.setState({
            selectedCode: e.target.value
        })
    }

    storex = "store1";
    companyx = "testCompany";

    data = {store: this.storex, company: this.companyx, display: this.displayx};
    url = "http://localhost:80/";
    global = new Array(2);
    test ={};
    dbObj;
    tempArray= [];
    
    /*
    getApiObject(_callback) {
        var obj = HandleDisplay("GETLIST", this.url, this.data, this.global);
        test = obj;
        _callback();
    }
    callbackFunc() {
        this.getApiObject(() => {console.log("Finished getting API object")});
    }
    */
 
     async getObject() {
        this.test = await HandleDisplay("GETLIST", this.url, this.data, this.global);
        console.log("Inside getObject()");
        this.tempArray = this.global[1];
        this.dbObj = JSON.parse(this.tempArray);
        console.log("**********" + this.dbObj);
        return this.dbObj;
        
    }

    /*componentDidMount() {
        var response = this.getObject();
        this.dbObj = response.json();
        this.tempArray = this.global[1];

        //console.log("Object ^")
        //console.log(this.tempArray);
        this.dbObj = JSON.parse(this.tempArray);
        console.log("**********" + this.dbObj);
        this.setState({
            currentObj: this.dbObj
        })
    } */



    render() { 

        let localObject = this.getObject();

        return (
            <div className="background" id="background">
                {console.log("displayIndex: " + this.state.displayIndex)}
                <div>
                    <Sidebar/>
                </div>
                <div id="mainContainer">
                    <h2 className="page-header">QR Management</h2>
                    
                    <div id="topContainer">
                    
                        <div id="SelectDisplay" >
                            <label htmlFor="displays" className="contents">Select Display:</label>
                            
                            <select name="display-select" id="display-select" className="contents" value={this.state.displayIndex} onChange={this.setCodeList} >
                                {localObject.displays.map((val, key) => {
                                    return (
                                        <option key={key} value={key}>
                                            {val.display}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="SectionDivider">
                        <h4>{this.state.displayIndex} Codes</h4>
                        <ul id="code-list">
                            {this.getCurrentDisplayObj().codes.map((val, key) => {
                                return (
                                    <li className='code-list-item' key={key} value={val.getIndex()} onClick={this.selectCode}>
                                        {val.getTitle()}
                                    </li>
                                );
                            })}
                            <li className="code-list-item" id="createNewCode">+ Crete New Code</li>
                        </ul>
                        <div id="settings-container">
                            <h5 id="settings-container-header">{this.getCurrentDisplayObj().codes[this.state.selectedCode].getTitle()} Settings</h5>
                            <label htmlFor="code-title-input">Title: </label>
                            <input type="text" id="code-title-input" defaultValue={this.getCurrentDisplayObj().codes[this.state.selectedCode].getTitle()}></input>
                            <br/>
                            <label htmlFor="code-title-input">Code: </label>
                            <input type="text" id="code-code-input" defaultValue={this.getCurrentDisplayObj().codes[this.state.selectedCode].getCode()}></input>
                            <br/>
                            <label htmlFor="code-title-input">Length: </label>
                            <input type="text" id="code-length-input" defaultValue={this.getCurrentDisplayObj().codes[this.state.selectedCode].getLength()}></input>
                            <br/>
                            <input id="submit-changes-button" type="button" value="Submit Changes" onClick={this.submitCodeChanges()}/>
                            <input id="delete-code-button" type="button" value="Delete Code" onClick={this.removeCode()}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default GenerateQR;