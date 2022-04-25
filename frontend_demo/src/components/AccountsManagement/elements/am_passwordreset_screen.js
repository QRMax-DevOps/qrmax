import React, { Component } from 'react';

import {isEmptyOrSpaces, enumToString} from './../../../services/utilities/common_util';
import {log, logWarn} from './../../../services/core_mw';

import "../am_style.css";

import PasswordResetInputField from "./am_forms_passwordreset_input";

class PasswordResetScreen extends Component {

	
	constructor(props) {
		super(props);
		
		this.state = {
			pass:'',
			passConfirm:'',
			valid:false,
			confirmed:false
		}
		
		this.finishReset		 = this.finishReset.bind(this);
		this.setTargetPassword	 = this.setTargetPassword.bind(this);
		this.getTargetPassword	 = this.getTargetPassword.bind(this);
		this.setTargetPasswordConfirmation = this.setTargetPasswordConfirmation.bind(this);
		this.setValidity	 	 = this.setValidity.bind(this);
		this.setConfirmation	 = this.setConfirmation.bind(this);
	}
	
	setTargetPassword(value) {
		this.setState({
			pass:value
		});
	}
	
	setTargetPasswordConfirmation(value) {
		this.setState({
			passConfirm:value
		});
		
	}
	
	setTargetPassword(value) {
		this.setState({
			pass:value
		});
	}
	
	getTargetPassword() {
		return this.state.pass;
	}
	
	setValidity(value) {
		this.setState({
			valid:value
		});
	}
	
	setConfirmation(value) {
		this.setState({
			confirmed:value
		});
	}
	
	/* Called upon when clicking either "submit" or "cancel" buttons
	 * Save changes is a boolean. Self-explanitory. */
	finishReset(saveChanges) {
		if(saveChanges) {
			if(this.state.valid && (this.state.pass === this.state.passConfirm)) {
				this.props.setPassword(this.state.pass);
				this.props.setScreen("main");
			}
		}
		else {
			this.props.setScreen("main");
		}
		
	}
	
    render() {
		
		//If either of the fields have reported invalidity, or if the field values do not match
		var disableSubmit = (!this.state.valid || (this.state.pass !== this.state.passConfirm));
		
		return(
			<div style={{width:"100%"}}>
				<div className="FormHeader">
					<div className="FormTitle"><b>{this.props.modType}</b> -> Store Account -> Password Reset</div>
				</div>
				<div className="FormInputContainer" style={{justifyContent:"space-between"}}>
					<div style={{width:"100%"}}>
						<PasswordResetInputField title="Password"			role="standard"		maxChars="32" minChars="6" setTargetPassword={this.setTargetPassword} setValidity={this.setValidity}/>
						<PasswordResetInputField title="Confirm Password"	role="confirmation"	targetPassword={this.state.pass} setTargetPasswordConfirmation={this.setTargetPasswordConfirmation} setValidity={this.setValidity}/>

					</div>
				</div>
				<div className="FormButtonsContainer">
					<button className="EditorMainButton GreenButton"	disabled={disableSubmit} onClick={(e)=>this.finishReset(true)}	>Save changes</button>
					<button className="EditorMainButton RedButton"		onClick={(e)=>this.finishReset(false)}	>Cancel</button>
				</div>
			</div>
		);
	}
}
export default PasswordResetScreen;


/*

/*

		<div className="FormHeader">
			<div className="FormTitle"><b>CREATE</b> -> Store Record</div>
		</div>
		<div className="FormInputContainer" style={{justifyContent:"flex-start"}}>
			<div style={{width:"875px"}}>
				<LockedInputField title="Company" setErrorPresent={setCompanyError} inputValue={company}/>
				<ResponsiveInputField title="Store name"	setErrorPresent={setStoreNameError}  maxChars="64" minChars="4" inputValue={store} setFormValue={setStoreName}/>
			</div>
			
		</div>
		
		<div className="FormButtonsContainer">
			<button type="button" className="EditorMainButton GreenButton" disabled={submissionDisabled} onClick={(e)=>handleSubmission(e)}>Submit</button>
			<button type="button" className="EditorMainButton GreyButton" onClick={() => props.setParentState('currentForm', null)}>Close</button>
		</div>

*/

