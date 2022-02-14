const CompanyAccountDao = require("../dao/CompanyAccountDAO.js");
const e = require("express");
const pbkdf2  = require('pbkdf2-sha256')
const { v4: uuidv4 } = require('uuid');

class CompanyAccountController {
    static async login(req, res) {
        //get submitted username
        const uname = req.body.companyName;
        //get salt from DAO using matching username
        let salt = await CompanyAccountDao.getSalt(uname);
        let hash;
        if (salt.status !== "failure"){
            // Hash password using salt
            // PBKDF2 with HMAC-SHA-256 as core hash run 80,000 iterations
            hash = pbkdf2 (req.body.password, salt, 80000, 32).toString('hex');
            //send hashed password to DAO to check if correct
            const rjson = await CompanyAccountDao.checkLogin(uname, hash)
            res.json(rjson);
        }
        else{
            res.json(salt)
        }
        
    } 

    static async register(req, res) {
        // get username and password
        const companyName = req.body.companyName
        const pword = req.body.password;
        //check if account exists
        if (await CompanyAccountDao.checkAccount(companyName)){
            res.json({status:"failure", cause:'account already exists'});
        }
        else{
            // generate salt
            const salt = uuidv4();
            // hash password
            const hash = pbkdf2 (pword, salt, 80000, 32).toString('hex');
            // store username salt and hash
            CompanyAccountDao.register(companyName, salt, hash);
            // call login function
            res.json({status:'success'});
        }
    }

    //TOKEN INSTEAD OF CHECK COMPANY WILL JUST CHECK TOKEN AND EXECUTE ON CORRECT COMPANY
    static async patch(req, res) {
        const company = req.body.companyName;
        const field = req.body.field;
        const value = req.body.value;
        //check if account exists
        if(await CompanyAccountDao.checkAccount(company)){
            //check if field exists
            if(await CompanyAccountDao.checkField(company, field)){
                //update field with value
                const rjson = await CompanyAccountDao.patch(company, field, value);
                res.json(rjson);
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
        const company = req.body.companyName;
        if(await CompanyAccountDao.checkAccount(company)){
            CompanyAccountDao.delete(company);
            res.json({status:"success"});
        }
        else{
            res.json({status:"failure", cause:'no account exists'});
        }
    }   

  }

module.exports = CompanyAccountController;