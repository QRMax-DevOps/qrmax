const CompanyAccountDao = require("../../dao/CompanyAccountDAO.js");
const CompanyDAO = require("../../dao/CompanyDAO.js");
const e = require("express");
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');
const StoreAccountDAO = require("../../dao/StoreAccountDAO.js");


class CompanyAccountController {
    static async login(req, res) {
        try{
            //get submitted username
            const company = req.body.company;
            //get salt from DAO using matching username
            let salt = await CompanyAccountDao.getSalt(company)
            let hash;
            if (salt.status !== "failure"){
                // Hash password using salt
                // PBKDF2 with HMAC-SHA-256 as core hash run 80,000 iterations
                hash = pbkdf2 (req.body.password, salt, 80000, 32).toString('hex');
            }
            //send hashed password to DAO to check if correct
            res.json(await CompanyAccountDao.checkLogin(company, hash));
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    } 

    

    static async register(req, res) {
        try{
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
        catch(e){
            res.json({status:"failure", cause:e})
        } 
    }

    //TOKEN INSTEAD OF CHECK COMPANY WILL JUST CHECK TOKEN AND EXECUTE ON CORRECT COMPANY
    static async patch(req, res) {
        try{
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
        catch(e){
            res.json({status:"failure", cause:e})
        }  
    }

    //TOKEN AS CHECK BEFORE DELETING
    static async delete(req, res){
        try{
            const company = req.body.company;
            if(await CompanyAccountDao.checkAccount(company)){
                CompanyAccountDao.delete(company);
                CompanyDAO.delete(company);
                StoreAccountDAO.deleteAll(company);
                res.json({status:"success"});
            }
            else{
                res.json({status:"failure", cause:'no account exists'});
            }  
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    } 
    
    static async getSettings(req, res){
        try{
            const company = req.body.company;
            if(await CompanyAccountDao.checkAccount(company)){
                let settingsR = await CompanyAccountDao.getSettings(company);
                res.json({status:"success", settings:settingsR.settings});
            }
            else{
                res.json({status:"failure", cause:'no account exists'});
            }  
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async changeSettings(req, res){
        try{
            const company = req.body.company;
            const fields = req.body.fields;
            const values = req.body.values;
            if(await CompanyAccountDao.checkAccount(company)){
                CompanyAccountDao.setSettings(company, fields, values);
                res.json({status:"success"});
            }
            else{
                res.json({status:"failure", cause:'no account exists'});
            }  
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }
  }

module.exports = CompanyAccountController;