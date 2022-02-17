import React, {Component} from 'react';
import Sidebar from './Sidebar';
import './Interactions.css';
import '../App.css';




class Interactions extends Component {
    render() { 
        return (
            <div class="background">
                <div>
                    <Sidebar/>
                </div>
                <div class="MainContainer">
                    <div class="DisplayContainer">
                        <p id="InteractionDisplayOne">Display Interactions here.</p>
                        <p id="InteractionDisplayTwo">Display Interactions here.</p>
                        <p id="InteractionDisplayThree">Display Interactions here.</p>
                        <p id="InteractionDisplayFour">Display Interactions here.</p>
                    </div>
                </div>
            </div>
            
        );
    }
}
 
export default Interactions;