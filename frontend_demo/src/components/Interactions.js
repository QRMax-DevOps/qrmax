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
                        <div id="InteractionDisplayOne">
                            <p id="InteractionNames">East Wing Interactions</p>
                        </div>
                        <div id="InteractionDisplayTwo">
                        <p id="InteractionNames">West Wing Interactions</p>
                        </div>
                        <div id="InteractionDisplayThree">
                        <p id="InteractionNames">A Wing Wing Interactions</p>
                        </div>
                        <div id="InteractionDisplayFour">B Wing Interactions</div>
                    </div>
                </div>
            </div>
            
        );
    }
}
 
export default Interactions;