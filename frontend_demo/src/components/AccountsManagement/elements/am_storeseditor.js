/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import React, { Component } from 'react';
import tick_icon from '../../../graphics/tick.png'; 
import cross_icon from '../../../graphics/cross.png'; 

import minus_icon from '../../../graphics/minus_icon.png'; 
import plus_icon from '../../../graphics/plus_icon.png'; 

import {isEmptyOrSpaces, enumToString} from './../../../services/utilities/common_util';
import {log, logWarn} from './../../../services/core_mw';

import "../am_style.css";

class StoreRecord extends Component {
	constructor(props) {
		super(props);
		
		var stores_raw = this.props.stores_raw;
		
		var toUse = tick_icon;
		var cl = "StoreRecordData"
		var toAdd = ["removeButton RedButton", minus_icon];
		
		if(!this.props.record.valid) {
			toUse = cross_icon;
			cl = "StoreRecordData strike"
		}
		
		if(this.props.type === "add") {
			var toAdd = ["addButton GreenButton", plus_icon];
		}
		
		this.state= {iconToUse:toUse, classRule:cl, add:toAdd}
		
	}
	
	//add or remove
	//record
	
	
	
	render() {
		return(
			<div className="StoreRecord">
				<div className="SideBySide">
					<div className="StoreRecordData faded">ID:</div>
					<div className={this.state.classRule}>{this.props.record.ID}</div>
					<div className="StoreRecordData faded" style={{marginLeft:"10px"}}>Name:</div>
					<div className={this.state.classRule}>{this.props.record.store}</div>
					<div className="StoreRecordData validity"><img src={this.state.iconToUse}/></div>
				</div>
				<button onClick={(e)=>this.props.updateDistribution(this.props.record, this.props.type)} className={this.state.add[0]}><img src={this.state.add[1]}/></button>
			</div>
		);
	}
}

class StoresList extends Component {
	constructor(props) {
		super(props);
		
		var titleGen = 'null';
		var typeGen = 'add';
		
		if(this.props.type.toLowerCase() === 'selected') {
			titleGen = "Selected Stores";
			typeGen = 'remove';
			
		}
		else if(this.props.type.toLowerCase() === 'available'){
			titleGen = "Available Stores";
		}
		
		this.state = {
			title : titleGen,
			type: typeGen
		}
	}
	
    render() {
		let recordsExist = (this.props.storesRecords && this.props.storesRecords.length > 0);
		
		return(
			<div style={{height:"100%", width:"100%", marginLeft:"10px",marginRight:"10px"}}>
				<div className="StoreTableTitle"><p>{this.state.title}</p></div>
				<table className="scroll">
					<tbody style={{margin:"0", padding:"0"}}>
						{recordsExist && 
							<>
								{this.props.storesRecords.map((item)=>{ return(
									<tr key={item.store}>
										<td><StoreRecord record={item} type={this.state.type} updateDistribution={this.props.updateDistribution}/></td>
									</tr>
								);})}
							</>
						}
						{!recordsExist &&
							<>
								<tr>
									<td>No records provided.</td>
								</tr>
							</>
						}
					</tbody>
				</table>
			</div>
		);
	
	}
}



/* Returns a list of stores that either:
 *    - Exist in the store account records
 *    - Exists in the company account records AND NOT in the store account records.
 */
function getStores(mode, companyAcc_stores, storeAcc_stores) {
	mode = enumToString(mode); //If "symbol" type enum provided (I.e., )
	
	if((!isEmptyOrSpaces(mode) && mode !== false) && companyAcc_stores, storeAcc_stores) {
		

		
		var pickedStores = new Array();
			
			if(mode==='already_selected' && storeAcc_stores.length > 0) { //Validate stores in store account records
				for(let i = 0; i < storeAcc_stores.length; i++) {
					var storeFound = false;
					for(let j = 0; j < companyAcc_stores.length; j++) {
						if(storesMatch(storeAcc_stores[i], companyAcc_stores[j], false)) {
							storeFound = true;
							break;
						}
					}
					//Creating separate variable to avoid messing with provided array
					var checkedStore = {
							ID		: storeAcc_stores[i].ID,
							store	: storeAcc_stores[i].store,
							valid	: storeFound
					}
					pickedStores.push(checkedStore);
				}
			}
			else if(mode==='available_to_select' && companyAcc_stores.length > 0) { //pick stores NOT in store account storeslist
			
				for(let i = 0; i < companyAcc_stores.length; i++) {
					var storeFound = false;
					
					for(let j = 0; j < storeAcc_stores.length; j++) {
						
						if(storesMatch(companyAcc_stores[i], storeAcc_stores[j], false)) {
							storeFound = true;
							break;
						}
					}
					
					if(!storeFound) {
						//Creating separate variable to avoid messing with provided array
						var checkedStore = {
							ID		: companyAcc_stores[i].ID,
							store	: companyAcc_stores[i].store,
							valid	: true
						}
						pickedStores.push(checkedStore);
					}
				}
			}
			return pickedStores;
		
	}
	
	return null;
}



/* Take a specific store record and compare against an array of stores,
 * picking out any duplicates (E.g., stores with matching IDs)*/
function checkForDuplicates(sourceIn, targetIn) {
	var data = {
		dupesFound: false,
		dupesList: new Array()
	}
	
	for(let i = 0; i < targetIn.length; i++) {
		var isMatch = storesMatch(sourceIn, targetIn[i], true); //'idOnly' check
		if(isMatch) {
			data.dupesFound = true;
			data.dupesList.push(targetIn[i]);
		}
	}
	
	return data;
}


/* Checking whether two given stores (source and target) are similar enough
 * to be considered the same */
function storesMatch(sourceIn,targetIn,idOnly) {
	var id = { source:sourceIn.ID,  target:targetIn.ID};
	var name = { source:sourceIn.store, target:targetIn.store };
	var idMatch = false;
	var nameMatch = false;

	if(typeof id.source !== 'int')	{ id.source = parseInt(id.source); }
	if(typeof id.target !== 'int')	{ id.target = parseInt(id.target); }
	if(typeof name.source !== 'string')	{ name.source = String(name.source).toLowerCase(); }
	if(typeof name.target !== 'string')	{ name.target = String(name.target).toLowerCase(); }
	
	if(id.source === id.target) {
		idMatch = true;
		if(name.source === name.target) { nameMatch = true; }
		else {
			logWarn("While performing storesMatch(source="+JSON.stringify(sourceIn)+", target="+JSON.stringify(targetIn)+" idOnly="+idOnly+"):\n"
				+"Error encountered - store records have matching ID value, but names are different.");
		}
	}
	
	if(!idOnly) {
		if(idMatch && nameMatch) {return true;}
		else {return false;}
	}
	else {
		if(idMatch) {return true;}
		else {return false;}
	}
	
}

//Remove specific item from array
function removeItem<T>(arr: Array<T>, value: T): Array<T> { 
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

const ALREADY_SELECTED = Symbol("already_selected");
const AVAILABLE_TO_SELECT = Symbol("available_to_select");

class StoresEditor extends Component {
	
	
	constructor(props) {
		super(props);
		
		var company_storesRecords = this.props.company_storesRecords;
		var store_storesRecords = this.props.store_storesRecords;
		
		this.state = {
			stores:{
				selected	: getStores(ALREADY_SELECTED, company_storesRecords, store_storesRecords),
				available	: getStores(AVAILABLE_TO_SELECT, company_storesRecords, store_storesRecords)
			}
		}
		
		this.updateDistribution	= this.updateDistribution.bind(this);
		this.finishEditor		= this.finishEditor.bind(this);
	}
	
	/* Called upon when clicking either "submit" or "cancel" buttons
	 * Save changes is a boolean. Self-explanitory. */
	finishEditor(saveChanges) {
		if(saveChanges) {
			this.props.setStores(JSON.stringify(this.state.stores.selected));
		}
		this.props.setScreen("main");
	}
	
	/* Type = 'add' or 'remove'.
	 *    - add = Remove from 'available', add to 'selected'.
	 *    - remove = Remove from 'selected', add to 'available'.
	 *
	 * NOTE: When "removing" a record, check if the record exists in the company account records.
	 * If the record does not exist, then it is a faulty record. Notify the user with an error 
	 * notice + 'are you sure?' prompt
	 */
	updateDistribution(storeRecord, type) {
		type = enumToString(type);

		if(!isEmptyOrSpaces(type)) {
			
			if(type.toLowerCase()==='add') { //Remove from 'available', add to 'selected'
			
				var check = checkForDuplicates(storeRecord, this.state.stores.selected);
				
				if(check.dupesFound === false) {
					//Add
					this.setState({
						selected	: this.state.stores.selected.push(storeRecord),
						available	: removeItem(this.state.stores.available, storeRecord)
					});
				}
				else {
					console.log("Dupes found!");
					//check.dupesFound is true!
					//Report on check.dupesList length and specific records
				}
			}
			
			else if(type.toLowerCase()==='remove') { //Remove from 'selected', add to 'available'
				if(storeRecord.valid===true) {
					this.setState({
						selected	:	removeItem(this.state.stores.selected, storeRecord),
						available	:	this.state.stores.available.push(storeRecord)
					});
				}
				else {
					console.log("Record is invalid.");
					//produce error message (record not valid! Does not exist in company records and only exists here. If you delete it, you will not be able to recover it and will need to be recreated.)
					//Prompt "are you sure?" option
				}
			}
		}
	}
	
    render() {
		
		return(
			<div style={{width:"100%"}}>
				<div className="FormHeader">
					<div className="FormTitle"><b>{this.props.modType}</b> -> Store Account -> Stores Editor</div>
				</div>
				<div className="FormInputContainer" style={{justifyContent:"space-between"}}>
					<div style={{width:"100%", maxWidth:"1350px"}}>
						<div className="SideBySide" style={{width:"100%"}}>
							<StoresList type="selected" storesRecords={this.state.stores.selected} updateDistribution={this.updateDistribution}/>
							<StoresList type="available" storesRecords={this.state.stores.available} updateDistribution={this.updateDistribution}/>
						</div>
					</div>
				</div>
				<div className="FormButtonsContainer">
						<button className="EditorMainButton GreenButton"	onClick={(e)=>this.finishEditor(true)}	>Save changes</button>
						<button className="EditorMainButton RedButton"		onClick={(e)=>this.finishEditor(false)}				>Cancel</button>
				</div>
			</div>
		);
	}
}
export default StoresEditor;
