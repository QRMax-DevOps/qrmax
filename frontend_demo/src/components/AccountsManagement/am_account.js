import React from 'react';

export class Account {
  constructor(array) {
	  
	this.uid = "-1";
	this.company = 'defaultCompany';
	this.username = 'defaultCompany';
	this.store = 'defaultStore';
	this.password = 'defaultPassword';
	
	if('uid' in array) {
		this.uid = array.uid;
	}
	if('company' in array) {
		this.company = array.company;
	}
	if('username' in array) {
		this.store = array.store;
	}
	if('store' in array) {
		this.store = array.store;
	}
	if('password' in array) {
		this.password = array.password;
	}
  }
}

export function AddNewAccount(array, ACCOUNTSLIST) {
	console.log("creating new account")
	ACCOUNTSLIST.push(new Account(array));
	console.log(ACCOUNTSLIST);
}
//placeholder / debug