const CompanyAccountDao = require("../dao/CompanyAccountDAO.js");
const CompanyDAO = require("../dao/CompanyDAO.js");
const e = require("express");
const pbkdf2  = require('pbkdf2-sha256')


class CompanyAccountController {
    static async login(req, res) {
        //get submitted username
<<<<<<< Updated upstream
        let uname = req.body.username;
        const uname = req.body.company;
        //get salt from DAO using matching username
        let salt = "test2" // <-- testing
        //CompanyAccountDao.getSalt(uname) <-- actual code
        let hash;
        if (salt !== ""){
            // Hash password using salt
            // PBKDF2 with HMAC-SHA-256 as core hash run 80,000 iterations
            hash = pbkdf2 (req.body.password, salt, 80000, 32).toString('hex');
        }
        //send hashed password to DAO to check if correct
        //res.json(CompanyAccountDao.checkLogin(username, hash)); <-- actual code
        res.json({response:hash}); // <-- testing
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

    static async register(req, res) {
        // get username and password
        const company = req.body.company
        const pword = req.body.password;
        //check if account exists
        if (await CompanyAccountDao.checkAccount(company)){
            res.json({status:"failure", cause:'account already exists'});
        }
        else{
            // generate salt
            const salt = uuidv4();
            // hash password
            const hash = pbkdf2 (pword, salt, 80000, 32).toString('hex');
            // store username salt and hash
            CompanyAccountDao.register(company, salt, hash);
            //create matching company
            CompanyDAO.register(company);
            // call login function
            res.json({status:'success'});
        }
    }

    //TOKEN INSTEAD OF CHECK COMPANY WILL JUST CHECK TOKEN AND EXECUTE ON CORRECT COMPANY
    static async patch(req, res) {
        const company = req.body.company;
        const fields = req.body.fields;
        const values = req.body.values;

        const farray = fields.split(',');
        const varray = values.split(',');
        //check if account exists
        if(await CompanyAccountDao.checkAccount(company)){
            //check if fields exists
            if(await CompanyAccountDao.checkFields(company, farray)){
                //update field with value
                CompanyAccountDao.patch(company, farray, varray);
                res.json({status:"success"});
            }
            else{
                res.json({status:"failure", cause:'no field exists'});
            }
        }   
        else{
            res.json({status:"failure", cause:'no account exists'});
        }  
    }

    //TOKEN AS CHECK BEFORE DELETING
    static async delete(req, res){
        const company = req.body.company;
        if(await CompanyAccountDao.checkAccount(company)){
            CompanyAccountDao.delete(company);
            CompanyDAO.delete(company);
            res.json({status:"success"});
        }
        else{
            res.json({status:"failure", cause:'no account exists'});
        }
    }   

  }

module.exports = CompanyAccountController;