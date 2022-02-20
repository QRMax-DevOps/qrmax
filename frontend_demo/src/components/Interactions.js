import React, {Component} from 'react';
import Sidebar from './Sidebar';
import './Interactions.css';
import '../App.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';




class Interactions extends Component {
    render() { 
        return (
            <div class="background">
                <div>
                    <Sidebar/>
                </div>
                <div class="MainContainer">
                    <div class="DisplayContainer">
                        <DropdownButton id="displayDrop" title="Display">
                            <Dropdown.Item>East Wing</Dropdown.Item>
                            <Dropdown.Item>West Wing</Dropdown.Item>
                            <Dropdown.Item>A Wing</Dropdown.Item>
                            <Dropdown.Item>B Wing</Dropdown.Item>
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
                        <div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}
 


export default Interactions;