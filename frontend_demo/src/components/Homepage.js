import React, { Component } from 'react';
import Sidebar from './Sidebar';
import './Homepage.css';
import '../App.css';
import Card from 'react-bootstrap/Card';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import GenerateQR from "./GenerateQR";
import Login from "./Login";

class Homepage extends Component {
    render() {
        
        return (
            <div className="background">

                <div>
                    {/*<Router>*/}

                    <Sidebar/>
                    {/*<Routes>
                        <Route path="/homepage" exact component={Homepage}/>
                        <Route path="/homepage" exact component={Homepage}/>
                        <Route path="/gen_qr" exact component={GenerateQR}/>
                        <Route path="/homepage" exact component={Homepage}/>
                        <Route path="/login" exact component={Login}/>
                    </Routes>*/}

                    {/*</Router>*/}
                </div>
                <div className="MainContainer">
                    <div className="DisplayContainer">
                        
                        <div id="dropContainer">
                            <DropdownButton id="displayDrop" title="Display">
                                <Dropdown.Item>East Wing</Dropdown.Item>
                                <Dropdown.Item>West Wing</Dropdown.Item>
                                <Dropdown.Item>A Wing</Dropdown.Item>
                                <Dropdown.Item>B Wing</Dropdown.Item>
                            </DropdownButton>
                        </div>
                        <div className="DisplayContainer">
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