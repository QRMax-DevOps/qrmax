const { json } = require("express");
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');
const CompanyDAO = require("./CompanyDAO");
const jwt = require("jsonwebtoken");

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
            'unable to establish a collection handle in CompanyAccountDAO" ${e}'
          );
        }
    }
    
    static async register(company, salt, hash){
        try{
            const registerDoc = {
              company: company,
              salt: salt,
              password: hash,
              settings:[]
            }
            return await CompanyAccount.insertOne(registerDoc)
        }
        catch(e){
            console.error('unable to post register:' + e)
        }
    }

    static async getSalt(company){
        const result = await CompanyAccount.findOne({company:company});
        if (!result){
            return {status:'failure', cause:'no such account'}
        }
        return result.salt;
    }

    static async checkLogin(company, hash){
        let result = await CompanyAccount.findOne({company:company, password:hash});
        if (result){
			const token = jwt.sign({company: company},"secret_this_should_be_longer",{expiresIn: "1h"});
			      /*res.status(200).json({
			        token: token,
			        expiresIn: 3600,
			        userId: username
			      });*/
			return {status:'success', token:token};
        }
        return {status:'failure', cause:'incorrect password'};
    }

    static async checkAccount(company){
        let result = await CompanyAccount.findOne({company:company});
        if (result){
            return true;
        }
        return false;
    }

    static async checkFields(company, fields){
        let check = true;
        for (let field of fields){
            let result = await CompanyAccount.findOne({company:company, [field]:{$exists:true}});
            if (!result){
                check = false;
            }
        }
        return check;
    }

    static async patch(Company, fields, values){
        let i = -1;
        
        for (let field of fields){
            i++;
            const value = values[i];
            if(field === 'company'){
                await CompanyAccount.updateOne({company:Company}, {$set:{company:value}}, {upsert:false})
                await CompanyDAO.updateName(Company, value);
                Company = value;
                //update all stores with new company name
                //update all storeAccounts with new company name
            }
            else if(field === 'password'){
                // generate salt
                const salt = uuidv4();
                // hash password
                const hash = pbkdf2 (value, salt, 80000, 32).toString('hex');
                // store company salt and hash
                await CompanyAccount.updateOne({company:Company}, {$set:{[field]:hash, salt:salt}}, {upsert:false})
            }
            else{
                await CompanyAccount.updateOne({company:Company}, {$set:{[field]:value}}, {upsert:false})
            }
        }
    }

    static async delete(Company){
        CompanyAccount.deleteOne({company:Company})
    }   

    static async getSettings(company){
        let result = await CompanyAccount.findOne({company:company}, {projection:{_id:0, settings:1}});
        return result;
    }

    static async setSettings(company, fields, values){
        fields = fields.split(',');
        values = values.split(',');

        for (let i=0; i<fields.length; i++){
            let field = fields[i];
            await CompanyAccount.updateOne({company:company}, {$pull:{settings:{[field]:{$exists:true}}}});
            await CompanyAccount.updateOne({company:company}, {$addToSet:{settings:{[field]:values[i]}}});
        }
    }

}

module.exports = CompanyAccountDAO;