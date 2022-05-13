import React, {Component} from 'react';
import './Interactions.css';
import '../UniversalStyling.css';
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';

import Sidebar from './Sidebar';
import { handleDisplay } from '../services/middleware/display_mw';




class Interactions extends Component {
    constructor(props) {
        super(props);
        this.selectDisplay = this.selectDisplay.bind(this);
        this.selectPeriod = this.selectPeriod.bind(this);
    }
    state = {
        currentCompany: "mediaCompany",
        currentStore: "mediaStore",
        currentObj: {displays: [{display: ""}]},
        currentObjInt: {interactions: [["", 0]]},
        currentDisplay: "None Selected",
        currentPeriod: "All Time",
        currentPeriodCode: 0
    }
    
   

    selectDisplay(e){
        {console.log(e.target.value)}
        this.setState({
            currentDisplay: e.target.innerHTML
        });
        this.getInteractions(e);
    }

    selectPeriod(e){
        var data;
        var codeString = e.target.innerHTML;
        var code;
        if(codeString == "All Time"){
            code = 0;
        }else if(codeString == "Today"){
            code = 1;
        }else if(codeString == "One Hour"){
            code = 2;
        }else if(codeString == "Last 10 Minutes"){
            code = 3;
        }
        this.setState({
            currentPeriod: e.target.innerHTML,
             currentPeriodCode: code
        });

      this.fetchDisplay("GETLIST", data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, period: code}, 1);
      {console.log("HEY THIS IS A THING WOOHOO YAY YAY")}
      
    }

    getInteractions(e){
        var data;
        this.fetchDisplay("GETLIST", data = {company: this.state.currentCompany, store: this.state.currentStore, display: e.target.innerHTML, period: this.state.currentPeriodCode}, 1);
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

                    {console.log("we reach this point")}
                    {console.log(json)}
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
        this.fetchDisplay("GETLIST", data = {company: this.state.currentCompany, store: this.state.currentStore, display: this.state.currentDisplay, period: this.state.currentPeriodCode}, 1);
        console.log("did mount");
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
                            <h2>Current Display: {this.state.currentDisplay}</h2>
                            
                            <h4>Current Period: {this.state.currentPeriod}</h4>

                        </div>
                        <div>
                        <DropdownButton id="displayDrop" title="Display" as={ButtonGroup}>
                            {this.state.currentObj.displays.map((val, key) => {
                                return (
                                    <Dropdown.Item key={key} value={key} onClick={this.selectDisplay} >{val.display}</Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                        <DropdownButton id="periodDrop" title="Period" as={ButtonGroup}>
                            <Dropdown.Item onClick={this.selectPeriod}>All Time</Dropdown.Item>
                            <Dropdown.Item onClick={this.selectPeriod}>Today</Dropdown.Item>
                            <Dropdown.Item onClick={this.selectPeriod}>One Hour</Dropdown.Item>
                            <Dropdown.Item onClick={this.selectPeriod}>Last 10 Minutes</Dropdown.Item>
                        </DropdownButton>
                        </div>
                        <br />
                        <ul id='interactions-list'>
                            {this.state.currentObjInt.interactions.map((val, key) => {
                                return (
                                 <li className='interactions-list-item' width={500} key={key} value={key}>{val[0]} intertactions:    {val[1]}</li>
                                 );
                             })}
                        </ul>
                        
                    </div>
                </div>
                </div>
                
                
           
            
        );
    }
}
 


export default Interactions;