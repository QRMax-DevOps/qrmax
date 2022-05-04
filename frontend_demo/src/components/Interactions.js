import React, {Component} from 'react';
import './Interactions.css';
import '../UniversalStyling.css';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';

import Sidebar from './Sidebar';
import { handleDisplay } from '../services/middleware/display_mw';




class Interactions extends Component {
    constructor(props) {
        super(props);
        this.selectDisplay = this.selectDisplay.bind(this);
    }
    state = {
        currentCompany: "mediaCompany",
        currentStore: "mediaStore",
        currentObj: {displays: [{display: ""}]},
        currentObjInt: {interactions: [{media: ""}]},
        currentDisplay: "None Selected",
        currentPeriod: "All Time",
        currentInteractions: "0"
    }
    
    selectDisplay(e){
        {console.log(e.target.value)}
        this.setState({
            currentDisplay: e.target.innerHTML,
            currentValue: e.target.value
        });
        this.getInteractions();
    }

    getInteractions(){
        var data;
        this.fetchDisplay("GETLIST", data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, period: this.state.currentInteractions}, 1);
        console.log("THIS IS PART OF THE GETLIST");
        console.log(data);
    }

    fetchDisplay(type, data, objectCount) {
        var url = "http://localhost:80/";
        if(objectCount == 0)
        var target = "display";
        else
        var target = "display/interactions";

        let request = null;
        let response = [null,null];

        var me = this;
        var timer = {elapsed: 0};

        request = handleDisplay(target, type, url, data, response);

        var interval = setInterval(function(){
            timer.elapsed++;

            if(response[0] !== null){
                clearInterval(interval);
                me.setState({loading:false});

                if(response[0] === true){
                    var json = JSON.parse(response[1]);
                    if(objectCount == 0)
                    me.setState({currentObj: json});
                    if(objectCount == 1)
                    me.setState({currentObjInt: json});
                    
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
        var data;
        this.fetchDisplay("GETLIST", data = {company: this.state.currentCompany, store: this.state.currentStore}, 0);
        //this.fetchDisplay("GETLIST", data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, period: this.state.currentPeriod}, 1);
        console.log("did mount");
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


    render() { 
        return (
            <div className="background">
                <div>
                    <Sidebar/>
                </div>
                <div className="MainContainer">
                    <div className="DisplayContainer">
                        <div>
                            <p>Current Display:</p>
                            <p>{this.state.currentDisplay}</p>
                        </div>
                        <DropdownButton id="displayDrop" title="Display">
                            {this.state.currentObj.displays.map((val, key) => {
                                return (
                                    <Dropdown.Item key={key} value={key} onClick={this.selectDisplay} >{val.display}</Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                        
                    </div>
                </div>
                </div>
                
                
           
            
        );
    }
}
 


export default Interactions;