import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';
import './GenerateQR.css';
import Sidebar from './Sidebar';
import { DropdownButton, CounterInput } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { TextField } from '@mui/material';

class GenerateQR extends Component {
    render() { 
        return (
            <div class="background" id="background">
                <div>
                    <Sidebar/>
                </div>
                <div id="mainContainer">
                    <div id="SelectDisplay">
                        <p id="selectDisplayTitle">Select Display:</p>
                        <DropdownButton title="Example Display">
                            Example Display
                        </DropdownButton>
                    </div>
                    <div id="codeAmount">
                        <p id="codeAmountTitle">
                            Number of Codes:
                        </p>
                        <Button>

                        </Button>
                    </div>
                    <div class="SectionDivider">
                        <div class="mediaStack" id="1">
                            <p class="CodeTitle">
                                Code 1
                            </p>
                            <div class="mediaBackgroundSquare">
                                <p>Insert Correlated Media</p>
                                <Button class="browseButton">
                                    Browse
                                </Button>
                                <p class="MediaName">Media Name</p>
                                <TextField class="NameTextField">

                                </TextField>
                                <p class="MediaLength">Media Length</p>
                                <TextField class="LengthTextField">

                                </TextField>
                            </div>
                        </div>
                        <div class="mediaStack" id="2">
                            <p class="CodeTitle">
                                Code 2
                            </p>
                            <div class="mediaBackgroundSquare">
                                <p>Insert Correlated Media</p>
                                <Button class="browseButton">
                                    Browse
                                </Button>
                                <p class="MediaName">Media Name</p>
                                <TextField class="NameTextField">

                                </TextField>
                                <p class="MediaLength">Media Length</p>
                                <TextField class="LengthTextField">

                                </TextField>
                            </div>
                        </div>
                        <div class="mediaStack" id="3">
                            <p class="CodeTitle">
                                Code 3
                            </p>
                            <div class="mediaBackgroundSquare">
                                <p>Insert Correlated Media</p>
                                <Button class="browseButton">
                                    Browse
                                </Button>
                                <p class="MediaName">Media Name</p>
                                <TextField class="NameTextField">

                                </TextField>
                                <p class="MediaLength">Media Length</p>
                                <TextField class="LengthTextField">

                                </TextField>
                            </div>
                        </div>
                        <div class="mediaStack" id="4">
                            <p class="CodeTitle">
                                Code 4
                            </p>
                            <div class="mediaBackgroundSquare">
                                <p>Insert Correlated Media</p>
                                <Button class="browseButton">
                                    Browse
                                </Button>
                                <p class="MediaName">Media Name</p>
                                <TextField class="NameTextField">

                                </TextField>
                                <p class="MediaLength">Media Length</p>
                                <TextField class="LengthTextField">

                                </TextField>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default GenerateQR;