/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, { Component } from 'react';

import "./am_forms_components_style.css"
import StoresEditor from "./am_storeseditor";

class StoresInputField extends Component {
		setErrorVisibility(visible, override) {
		//Fade in text and transition component size to 100% (to fit error message)
		if(this.state.activeError !== null || override) {
			if(visible) {
				var ret = this.state.baseStyle.replace('decrease','increase');
				this.setState({
					baseStyle	: ret,
					errorStyle	: 'show'
				});
			}
			//Fade out text and transition component size back to default
			else {
				var ret = this.state.baseStyle.replace('increase','decrease');

				this.setState({
					baseStyle	: ret,
					errorStyle	: 'hide'
				});
			}
		}
	}
	
	constructor(props) {
		super(props);
		
		this.setErrorVisibility = this.setErrorVisibility.bind(this);
		this.showWarning = this.showWarning.bind(this);
		this.setFocus = this.setFocus.bind(this);
		//this.componentDidMount = this.componentDidMount.bind(this);

		this.state = {
			fieldErrorPreview : ['',''],
			warningActive	: false,
			activeError		: null,
			
			baseStyle		: 'decrease unfocussed',
			errorStyle		: 'hide',
			inputStyle		: 'normal',
			inputAreaStyle	: 'unfocussed',
			wordCounterStyle: 'normal',
			
			minChars		: this.props.minChars,
			maxChars		: this.props.maxChars,
			charsLeft		: this.props.maxChars,
			
			inputValue		: this.props.inputValue
		}
	}
	
	
	componentDidUpdate() {
		if((this.props.inputValue === "" || this.props.inputValue ==="[]") && this.state.activeError === null) {
			this.setErrorVisibility(true, true);
			this.setState({fieldErrorPreview : ['Error present','red'], activeError: 'A store account must contain at least 1 store record.'});
			this.props.setErrorPresent(true);
		}
		else if(this.state.activeError === null && this.state.fieldErrorPreview[0] !== 'All clear') {
			this.props.setErrorPresent(false);
			this.setState({fieldErrorPreview : ['All clear','green']});
		}
	}
	
	componentDidMount() {
		if((this.props.inputValue === "" || this.props.inputValue ==="[]") && this.state.activeError === null) {
			this.setErrorVisibility(true, true);
			this.setState({fieldErrorPreview : ['Error present','red'], activeError: 'A store account must contain at least 1 store record.'});
			this.props.setErrorPresent(true);
		}
		else if(this.state.activeError === null && this.state.fieldErrorPreview[0] !== 'All clear') {
			this.props.setErrorPresent(false);
			this.setState({fieldErrorPreview : ['All clear','green']});
		}
	}

	showWarning(message) {
		var ret = this.state.baseStyle.replace('decrease','increase');
		this.setState({baseStyle	: ret,
					errorStyle	: 'show',
					activeError	: message,
					warningActive: true});

		setTimeout(() => {
			var ret = this.state.baseStyle.replace('increase','decrease');
			this.setState({baseStyle	: ret,
					errorStyle	: 'hide'});
		}, 5000);

		setTimeout(() => {
			this.setState({
			activeError: null,
			warningActive: false});
		}, 5300);
	}

	setFocus(focussed) {
		if(focussed) {
			
			var retBase = this.state.baseStyle.replace('unfocussed','focussed');
			var retInputArea = this.state.inputAreaStyle.replace('unfocussed','focussed');
			
			this.setState({baseStyle	: retBase});
			this.setState({inputAreaStyle	: retInputArea});
		}
		else {
			var retBase = this.state.baseStyle.replace('focussed','unfocussed');
			var retInputArea = this.state.inputAreaStyle.replace('focussed','unfocussed');
			this.setState({baseStyle	: retBase});
			this.setState({inputAreaStyle	: retInputArea});
		}
	}
	
	render() {
		return (
			<div id="responsiveBaseStores" className={this.state.baseStyle} style={{marginTop:"20px"}}>
				
				<div className="SideBySide"
					onMouseEnter={ (event)=>this.setFocus(true)}
					onMouseLeave={ (event)=>this.setFocus(false)}>
					<div id="inputAreaStores" className={this.state.inputAreaStyle}>
						<div className="inputElement" style={{color:"#003B75", textAlign:"left", width:"100px", fontStyle:"italic"}}>{this.props.title}</div>
						<div className="inputElement" style={{color:"#003B75", textAlign:"center", width:"25px"}}>:</div>
						<div className={this.state.inputStyle} style={{width:"100%"}} id="inputFieldStores"
							spellCheck="false"
							autoComplete="off"
							readOnly
							type="text"
							value={this.state.inputValue}>
							{this.state.inputValue}
						</div>
						<div className="inputElement" style={{color:this.state.fieldErrorPreview[1], textAlign:"right", width:"150px"}}>{this.state.fieldErrorPreview[0]}</div>
					</div>
					<div id="buttonsArea">
						<button className="storeBtn" type="button" onClick={(e)=>this.props.setScreen('editor')}>Edit</button>
						<button className="storeBtn" type="button" >{"</>"}</button>
					</div>
				</div>
				
				<div id="reportArea">
					<div id="errorArea" className={this.state.errorStyle}>
						{this.state.activeError}
					</div>
				</div>
			</div>
		);
	}
}
export default StoresInputField;