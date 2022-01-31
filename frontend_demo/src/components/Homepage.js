import React, { Component } from 'react';
import Sidebar from './Sidebar';
import './Homepage.css';
import '../App.css';
import Card from 'react-bootstrap/Card';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class Homepage extends Component {
    render() {
        
        return (
            <div class="background">

                <div>
                    <Sidebar/>
                </div>
                <div class="MainContainer">
                    <div class="DisplayContainer">
                        
                        <div id="dropContainer">
                            <DropdownButton id="displayDrop" title="Display">
                                <Dropdown.Item>East Wing</Dropdown.Item>
                                <Dropdown.Item>West Wing</Dropdown.Item>
                                <Dropdown.Item>A Wing</Dropdown.Item>
                                <Dropdown.Item>B Wing</Dropdown.Item>
                            </DropdownButton>
                        </div>
                        <div class="DisplayContainer">
                            <Card id="DisplayPreview">

                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            );
    }
    
}

export default Homepage;