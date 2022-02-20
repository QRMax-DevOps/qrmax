const StoreAccountDao = require("../dao/StoreAccountDAO.js");
const CompanyDAO = require("../dao/CompanyDAO.js");
const pbkdf2  = require('pbkdf2-sha256')
const { v4: uuidv4 } = require('uuid');

class StoreAccountController {
    static async register(req, res) {
        // get username and password
        const username = req.body.username;
        const pword = req.body.password;
        const company = req.body.company;
        //check if company exists
        if (!(await CompanyDAO.checkCompany(company))){
            res.json({status:"failure", cause:'company does not exist'});
        }
        //check if account exists
        if (await StoreAccountDao.checkAccount(company, username)){
            res.json({status:"failure", cause:'user already exists'});
        }
        else{
            // generate salt
            const salt = uuidv4();
            // hash password
            const hash = pbkdf2 (pword, salt, 80000, 32).toString('hex');
            // store username salt and hash
            StoreAccountDao.register(company, username, salt, hash);
            // call login function
            res.json({status:'success'});
        }
    }

    static async login(req, res) {
        //get submitted username
        const company = req.body.company
        const username = req.body.username;
        //get salt from DAO using matching username
        let salt = await StoreAccountDao.getSalt(company, username);
        let hash;
        if (salt.status !== "failure"){
            // Hash password using salt
            // PBKDF2 with HMAC-SHA-256 as core hash run 80,000 iterations
            hash = pbkdf2 (req.body.password, salt, 80000, 32).toString('hex');
            //send hashed password to DAO to check if correct
            const rjson = await StoreAccountDao.checkLogin(company, username, hash)
            res.json(rjson);
        }
        else{
            res.json(salt);
        }
    }

    static async patch(req, res) {
        const company = req.body.company;
        const username = req.body.username
        const fields = req.body.fields;
        const values = req.body.values;

        const farray = fields.split(',');
        const varray = values.split(',');
        //check if account exists
        if(await StoreAccountDao.checkAccount(company, username)){
            //check if fields exists
            if(await StoreAccountDao.checkFields(company, username, farray)){
                //update field with value
                StoreAccountDao.patch(company, username, farray, varray);
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

    static async delete(req, res) {
        const company = req.body.company;
        const username = req.body.username;
        if(await StoreAccountDao.checkAccount(company, username)){
            StoreAccountDao.delete(company, username);
            res.json({status:"success"});
        }
        else{
            res.json({status:"failure", cause:'no such account'});
        }     
    }
}


module.exports = StoreAccountController;