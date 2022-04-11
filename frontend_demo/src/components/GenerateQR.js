import React, {Component, setState} from 'react';
import Button from 'react-bootstrap/Button';
import './GenerateQR.css';
import Sidebar from './Sidebar';
import Display from '../objects/DisplayObject.js';
import QRCode from '../objects/QRCode.js';
import {HandleDisplay} from '../services/middleware/qr_mw';

class GenerateQR extends Component {

    constructor(props) {
        super(props);
        this.state = {
			link: null
        };
        //this.setCodeList = this.setCodeList.bind(this);
       // this.selectCode = this.selectCode.bind(this);
        //this.getObject = this.getObject.bind(this);
		
		
		this.genQR();
    }

	/*
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
    */
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
 	
	/*
     async getObject() {
        this.test = await HandleDisplay("GETLIST", this.url, this.data, this.global);
        console.log("Inside getObject()");
        this.tempArray = this.global[1];
        this.dbObj = JSON.parse(this.tempArray);
        console.log("**********" + this.dbObj);
        return this.dbObj;
        
    }*/

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

	genQR() {
		var me = this;
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		var companynameParam = urlParams.get('companyname');
		var isLocalhostParam = urlParams.get('localhost');
		let linkForQR = '';
		if (isLocalhostParam!==null) {
			linkForQR = "http://localhost:3000/inputresponse?company="+companynameParam+"&store=store1&display=display1&qrid=f8f471daad3a4144b5fc";
		}
		else {
			linkForQR = "http://3.25.134.204/inputresponse?company="+companynameParam+"&store=store1&display=display1&qrid=f8f471daad3a4144b5fc";
		}
		
		var timer = { eclapsed: 0 };
		var me = this;
		var flag = 1;
		
		var interval = setInterval(function() {
			timer.eclapsed++;
			if(flag !== null) {
				clearInterval(interval);
	            me.setState({link: linkForQR});
				console.log(me.state.link);
				
			}
            

			//timeout after 3 seconds
			if(timer.eclapsed == 24) {
				console.log("Fetch-loop timeout!");
				me.setState({link:null});
				clearInterval(interval);
			}
		}, 500);
	}


    render() { 

        //let localObject = this.getObject();

        return (
            <div className="background" id="background">
                
                <div>
                    <Sidebar/>
                </div>
                <div id="mainContainer">
                    <h2 className="page-header">QR Management</h2>
                    {console.log(this.state.link)}
					<button type="button">Generate QR</button>
					
					<p>QR link for store1, display1, media1: {this.state.link}</p>
                </div>
            </div>
        );
    }
}
export default GenerateQR;