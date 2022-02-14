const { json } = require("express");
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');


let CompanyAccount;

class CompanyAccountDAO {
    static async injectDB(conn) {
        if (CompanyAccount) {
          return;
        }
        try {
            CompanyAccount = await conn.db(process.env.QRMAX_NS).collection("CompanyAccount");
        } catch (e) {
          console.error(
            'unable to establish a collection handle in UserInputDAO" ${e}'
          );
        }
    }
    
    static async register(uname, salt, hash){
        try{
            const registerDoc = {
              username: uname,
              salt: salt,
              password: hash
            }
            return await CompanyAccount.insertOne(registerDoc)
        }
        catch(e){
            console.error('unable to post register:' + e)
        }
    }

    static async getSalt(uname){
        const result = await CompanyAccount.findOne({username:uname});
        if (!result){
            return {status:'failure', cause:'no such account'}
        }
        return result.salt;
    }

    static async checkLogin(uname, hash){
        let result = await CompanyAccount.findOne({username:uname, password:hash});
        if (result){
            return {status:'success'};
        }
        return {status:'failure', cause:'incorrect password'};
    }

    static async checkAccount(company){
        let result = await CompanyAccount.findOne({username:company});
        if (result){
            return true;
        }
        return false;
    }

    static async checkField(company, field){
        let result = await CompanyAccount.findOne({username:company}, {[field]:{$exists:true}});
        if (result){
            return true;
        }
        return false;
    }

    static async patch(Company, field, value){
        if(field === 'username'){
            if(await this.checkAccount(value)){
                return {status:'failure', cause:'username not avaliable'};
            }
            await CompanyAccount.updateOne({username:Company}, {$set:{[field]:value}}, {upsert:true})
            return {status:'success'};
        }
        else if(field === 'password'){
            // generate salt
            const salt = uuidv4();
            // hash password
            const hash = pbkdf2 (value, salt, 80000, 32).toString('hex');
            // store username salt and hash
            await CompanyAccount.updateOne({username:Company}, {$set:{[field]:hash, salt:salt}}, {upsert:true})
            // call login function
            return {status:'success'};
        }
        else{
            await CompanyAccount.updateOne({username:Company}, {$set:{[field]:value}}, {upsert:true})
            return {status:'success'};
        }
    }

    static async delete(Company){
        await CompanyAccount.deleteOne({username:Company})
    }   

}

module.exports = CompanyAccountDAO;

