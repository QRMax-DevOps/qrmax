import React, { Component } from 'react';
import Sidebar from './Sidebar';
import './Homepage.css';
import '../App.css';
import Button from 'react-bootstrap/Button';

class Homepage extends Component {
    render() {
        
        return (
            <div class="background">
                <Sidebar/>
            </div>
        );
    }
    
}

export default Homepage;