const CompanyAccountDao = require("../dao/CompanyAccountDAO.js");
const e = require("express");
const pbkdf2  = require('pbkdf2-sha256')
const { v4: uuidv4 } = require('uuid');

class CompanyAccountController {
    static async login(req, res) {
        //get submitted username
        const uname = req.body.username;
        //get salt from DAO using matching username
        CompanyAccountDao.getSalt(uname);
        let hash;
        if (salt !== ""){
            // Hash password using salt
            // PBKDF2 with HMAC-SHA-256 as core hash run 80,000 iterations
            hash = pbkdf2 (req.body.password, salt, 80000, 32).toString('hex');
        }
        //send hashed password to DAO to check if correct
        //res.json(CompanyAccountDao.checkLogin(username, hash)); <-- actual code
        res.json({response:hash, username:uname}); // <-- testing
    } 

    static async register(req, res) {
        // get username and password
        const uname = req.body.username;
        let pword = req.body.password;
        // generate salt
        const salt = uuidv4();
        // hash password
        const hash = pbkdf2 (pword, salt, 80000, 32).toString('hex');
        // store username salt and hash
        CompanyAccountDao.register(uname, salt, hash);
        // call login function
        res.json({status:'success'});
    }

    static async patch(req, res) {
        //check if valid token
        //if valid pass to DAO
        //otherwise return json fail and cause
        res.json({status:"alive"});
    } 

    static async updateUsername() {
        
    } 

    static async updatePassword() {
        
    } 

    static async updateSettings(){

    }

  }

module.exports = CompanyAccountController;