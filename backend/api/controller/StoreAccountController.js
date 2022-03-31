const storeAccountDAO = require("../../dao/StoreAccountDAO.js");
const companyDAO = require("../../dao/CompanyDAO.js");
const pbkdf2  = require('pbkdf2-sha256')
const { v4: uuidv4 } = require('uuid');

class StoreAccountController {
    static async register(req, res) {
        try{
            // get username and password
            const username = req.body.username;
            const pword = req.body.password;
            const company = req.body.company;
            //check if company exists
            if (username == null){
                res.json({status:"failure", cause:'no username'});
            }
            if (pword == null){
                res.json({status:"failure", cause:'no password'});
            }
            if (!(await companyDAO.checkCompany(company))){
                res.json({status:"failure", cause:'company does not exist'});
            }
            //check if account exists
            if (await storeAccountDAO.checkAccount(company, username)){
                res.json({status:"failure", cause:'user already exists'});
            }
            else{
                // generate salt
                const salt = uuidv4();
                // hash password
                const hash = pbkdf2 (pword, salt, 80000, 32).toString('hex');
                // store username salt and hash
                storeAccountDAO.register(company, username, salt, hash);
                // call login function
                res.json({status:'success'});
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async login(req, res) {
        try{
            //get submitted username
            const company = req.body.company
            const username = req.body.username;
            //get salt from DAO using matching username
            let salt = await storeAccountDAO.getSalt(company, username);
            let hash;
            if (salt.status !== "failure"){
                // Hash password using salt
                // PBKDF2 with HMAC-SHA-256 as core hash run 80,000 iterations
                hash = pbkdf2 (req.body.password, salt, 80000, 32).toString('hex');
                //send hashed password to DAO to check if correct
                const rjson = await storeAccountDAO.checkLogin(company, username, hash)
                res.json(rjson);
            }
            else{
                res.json(salt);
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async patch(req, res) {
        try{
            const company = req.body.company;
            const username = req.body.username
            const fields = req.body.fields;
            const values = req.body.values;
            const farray = fields.split(',');
            const varray = [];

            let i = 0;
            for (let f of farray) {
                if (f === "stores") {
                    let stores;
                    stores = values.split('[{');
                    stores = stores[1].split('}]');
                    stores = stores[0].split('},{');
                    varray.push(stores);
                }
                else {
                    varray.push(values.split(',')[i]);
                    i++;
                }
            }

            //check if account exists
            if(await storeAccountDAO.checkAccount(company, username)){
                //check if fields exists
                if(await storeAccountDAO.checkFields(company, username, farray)){
                    //update field with value
                    storeAccountDAO.patch(company, username, farray, varray);
                    res.json({status:"success"});
                }
                else{
                    res.json({status:"failure", cause:'no such field'});
                }
            }   
            else{
                res.json({status:"failure", cause:'no such account'});
            }   
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async delete(req, res) {
        try{
            const company = req.body.company;
            const username = req.body.username;
            if(await storeAccountDAO.checkAccount(company, username)){
                storeAccountDAO.delete(company, username);
                res.json({status:"success"});
            }
            else{
                res.json({status:"failure", cause:'no such account'});
            } 
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }    
    }

    static async listUsers(req, res){
        try{
            //get company name
            const company = req.body.company;
            //check if comapny exists
            if(await companyDAO.checkCompany(company)){
                //get all stores list
                const rjson = await storeAccountDAO.getUserList(company);
                //return list as json
                res.json(rjson);
            }
            else{
                res.json({status:"failure", cause:"no such company"});
            }
            return res;
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async listStores(req, res){
        try{
            //get company name
            const company = req.body.company;
            const username = req.body.username;
            //check if comapny exists
            if(await companyDAO.checkCompany(company)){
                //get all stores list
                const rjson = await storeAccountDAO.getStoreList(company, username);
                //return list as json
                res.json(rjson);
            }
            else{
                res.json({status:"failure", cause:"no such company"});
            }
            return res;
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }
    //god this is disgusting why is this done like this
    //TODO: redo
    static async addStore(req, res){
        try{
            const company = req.body.company;
            const username = req.body.username;
            const stores = req.body.stores;
            const sarray = stores.split(',');
            //check company exists
            if(await companyDAO.checkCompany(company)){
                //check store exists
                if(await companyDAO.checkStores(company, sarray)){
                    //check user exists
                    if(await storeAccountDAO.checkAccount(company, username)){
                        //check user dosent already have store
                        if(!(await storeAccountDAO.checkUserStores(company, username, sarray))){
                            //add store to account
                            storeAccountDAO.addUserStore(company, username, sarray);
                            res.json({status:"success"})
                        }
                        else{
                            res.json({status:"failure", cause:"user already has store"})
                        }
                    }
                    else{
                        res.json({status:"failure", cause:"no such account"})
                    }
                }
                else{
                    res.json({status:"failure", cause:"no such store"})
                }
            }
            else{
                res.json({status:"failure", cause:"no such company"})
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async deleteStore(req, res){
        try{
            const company = req.body.company;
            const username = req.body.username;
            const stores = req.body.stores;
            const sarray = stores.split(',');
            //check company exists
            if(await companyDAO.checkCompany(company)){
                //check store exists
                if(await companyDAO.checkStores(company, sarray)){
                    //check user exists
                    if(await storeAccountDAO.checkAccount(company, username)){
                        //check user already have store
                        if(await storeAccountDAO.checkUserStores(company, username, sarray)){
                            //add store to account
                            storeAccountDAO.deleteUserStore(company, username, sarray);
                            res.json({status:"success"})
                        }
                        else{
                            res.json({status:"failure", cause:"user dosent have store"})
                        }
                    }
                    else{
                        res.json({status:"failure", cause:"no such account"})
                    }
                }
                else{
                    res.json({status:"failure", cause:"no such store"})
                }
            }
            else{
                res.json({status:"failure", cause:"no such company"})
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async getSettings(req, res){
        try{
            const company = req.body.company;
            const username = req.body.username;
            if (!await companyDAO.checkCompany(company)){
                res.json({status:"failure", cause:'no such company exists'});
            }
            else if (await storeAccountDAO.checkAccount(company, username)){
                let settingsR = await storeAccountDAO.getSettings(company, username);
                res.json({status:"success", settings:settingsR.settings});
            }
            else{
                res.json({status:"failure", cause:'no such account exists'});
            }  
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async changeSettings(req, res){
        try{
            const company = req.body.company;
            const username = req.body.username;
            const fields = req.body.fields;
            const values = req.body.values;
            if (!await companyDAO.checkCompany(company)){
                res.json({status:"failure", cause:'no such company exists'});
            }
            else if (await storeAccountDAO.checkAccount(company, username)){
                storeAccountDAO.setSettings(company, username, fields, values);
                res.json({status:"success"});
            }
            else{
                res.json({status:"failure", cause:'no such account exists'});
            }  
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }
    
}


module.exports = StoreAccountController;