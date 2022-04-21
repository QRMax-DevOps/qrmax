import React, {Component} from 'react';
import './Interactions.css';
import '../UniversalStyling.css';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';

import Sidebar from './Sidebar';
import { getDisplays } from '../services/middleware/display_mw';




class Interactions extends Component {
    constructor(props) {
        super(props);
        this.selectDisplay = this.selectDisplay.bind(this);
    }
    state = {
        currentCompany: "mediaCompany",
        currentStore: "mediaStore",
        currentObj: {displays: [{display: ""}]},
        currentDisplay: "display1"
    }
    
    selectDisplay(e){
        this.setState({
            currentDisplay: e.target.value
        });
    }

    fetchDisplay(type, data) {
        var url = "http://localhost:80/";

        let request = null;
        let response = [null,null];

        var me = this;
        var timer = {elapsed: 0};

        request = getDisplays(type, url, data, response);

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

    componentDidMount() {
        var data;
        this.fetchDisplay("GETLIST", data = {company: this.state.currentCompany, store: this.state.currentStore});
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
            <div class="background">
                <div>
                    <Sidebar/>
                </div>
                <div class="MainContainer">
                    <div class="DisplayContainer">
                        <div>
                            <p>Current Display:</p>
                            <p>{this.state.currentDisplay}</p>
                            {console.log(this.state.currentDisplay)}
                        </div>
                        <DropdownButton id="displayDrop" title="Display">
                            {this.state.currentObj.displays.map((val, key) => {
                                return (
                                    <Dropdown.Item key={key} value={key} onClick={this.selectDisplay}>{val.display}</Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                        <div id="InteractionDisplayOne">
                            <p id="InteractionNames">Code 1 Interactions</p>
                            <br/>
                            <p>2</p>
                        </div>
                        <div id="InteractionDisplayTwo">
                            <p id="InteractionNames">Code 2 Interactions</p>
                            <br/>
                            <p>5</p>
                        </div>
                        <div id="InteractionDisplayThree">
                            <p id="InteractionNames">Code 3 Interactions</p>
                            <br/>
                            <p>10</p>
                        </div>
                        <div id="InteractionDisplayFour">
                            <p id ="InteractionNames">Code 4 Interactions</p>
                            <br/>
                            <p>110</p>
                        </div>
                        
                       
                    </div>
                </div>
                </div>
                
                
           
            
        );
    }
}
 


export default Interactions;