/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, { Component } from 'react';
import "./am_forms_components_style.css"


function getPrettyArrayString(arr) {
	var str = '';
	for(var i = 0; i < arr.length; i++) {
		if(i+1 < arr.length) {
			str = str+arr[i]+", ";
		}
		else {
			str = str+arr[i];
		}
	}
	return str;
}

function findIllegalCharacters(s) {
	const illegalChars = ['\'','"','<','>','/','\\','[',']','{','}'];
	var charsPresent = new Array;

	if((/\s/).test(s)) {
		charsPresent.push('*whitespace*');
	}
	for(var i = 0; i < illegalChars.length; i++) {
		if(s.indexOf(illegalChars[i]) !== -1) {
			charsPresent.push(illegalChars[i]);
		}
	}
	return charsPresent;
}



class ResponsiveInputField extends Component {
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
		this.handleInput = this.handleInput.bind(this);
		this.showWarning = this.showWarning.bind(this);
		this.setFocus = this.setFocus.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);

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


	/* After component loads, perform an error check, mostly
     * just to get an accurate characters remaining value*/
	componentDidMount() {
		this.checkCharsRemaining(this.state.inputValue);
		this.errorCheck(this.state.inputValue);
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
		}, 3000);

		setTimeout(() => {
			this.setState({
			activeError: null,
			warningActive: false});
		}, 3300);
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
	
	
	
	//Checks: illegal characters, empty field, minimum characters
	errorCheck(value) {
		var checkResult = {pass:true, errors: new Array};
		var illegalChars = findIllegalCharacters(value);
		
		if(illegalChars.length > 0) {
			this.setErrorVisibility(true, true);
			this.setState({fieldErrorPreview : ['Error present','red'], inputStyle: 'flash', activeError: 'Oops! Illegal characters are present in this field! ('+getPrettyArrayString(illegalChars)+')'});
			this.props.setErrorPresent(true);

			setTimeout(() => {
			  this.setState({inputStyle: 'normal'});
			}, 100);
		}
		else if(value.length <= 0) {
			this.setErrorVisibility(true, true);
			this.setState({fieldErrorPreview : ['Error present','red'], activeError: 'This field cannot be left empty.'});
			this.props.setErrorPresent(true);
		}
		else if(this.state.minChars > value.length) {
			this.setErrorVisibility(true, true);
			this.setState({fieldErrorPreview : ['Error present','red'], inputStyle: 'flash', activeError: 'Field must contain at least '+this.state.minChars+' characters.'});
			this.props.setErrorPresent(true);

			setTimeout(() => {
			  this.setState({inputStyle: 'normal'});
			}, 100);
		}
		else {
			this.props.setErrorPresent(false);
			this.setErrorVisibility(false, true);
			this.setState({fieldErrorPreview : ['All clear','green'], activeError: null});
		}
	}
	
	checkCharsRemaining(value) {
		let newCharsLeft = this.state.maxChars - value.length;

		if(newCharsLeft >= 0) {
			this.setState({
				inputValue	: value,
				charsLeft	: newCharsLeft
			});
		}
		else {
			this.setState({inputStyle: 'flash', wordCounterStyle: 'flash'});
			setTimeout(() => {
			  this.setState({inputStyle: 'normal', wordCounterStyle: 'normal'});
			}, 100);
			return;
		}
	}

	handleInput(value) {
		this.props.setFormValue(value);
		this.checkCharsRemaining(value);
		this.errorCheck(value);
	}
	
	render() {
		return (
			<div id="responsiveBase" className={this.state.baseStyle}>
				
				<div id="inputArea" className={this.state.inputAreaStyle}
					>
					
					<div className="inputElement" style={{color:"#003B75", textAlign:"left", width:"100px", fontStyle:"italic"}}>{this.props.title}</div>
					<div className="inputElement" style={{color:"#003B75", textAlign:"center", width:"25px"}}>:</div>
					<input className={this.state.inputStyle} style={{width:"100%"}} id="inputField"
						spellCheck="false"
						autoComplete="off"
						type="text"
						value={this.state.inputValue}
						onMouseEnter={ (event)=>this.setFocus(true)}
					onMouseLeave={ (event)=>this.setFocus(false)}
						onChange={(event)=>this.handleInput(event.target.value)} />
					<div className="inputElement" style={{color:this.state.fieldErrorPreview[1], textAlign:"right", width:"200px"}}>{this.state.fieldErrorPreview[0]}</div>
				</div>
				
				<div id="reportArea">
					<div id="errorArea" className={this.state.errorStyle}>
						{this.state.activeError}
					</div>
					<div id="wordCounter" className={this.state.wordCounterStyle}>{this.state.charsLeft} characters remaining</div>
				</div>
			</div>
		);
	}
}
export default ResponsiveInputField;


/*

value={this.state.inputValue}
 onChange={this.handleChange}


*/

