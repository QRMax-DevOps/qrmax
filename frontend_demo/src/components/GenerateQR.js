import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import './GenerateQR.css';
import Sidebar from './Sidebar';
import ReactDOM from 'react-dom';

class GenerateQR extends Component {
    render() { 
        return (
            <div class="background">
                <div>
                    <Sidebar/>
                </div>
                <div id="mainContainer">
                    <div id="buttonContainer">
                        <Button>Request New QR</Button>
                    </div>
                    <div>
                        <p id="QRDisplay">New QR Displays Here</p>
                    </div>

                        
                    
                </div>
            </div>
        );
    }
}
 
export default GenerateQR;