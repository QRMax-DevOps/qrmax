const CompanyDAO = require("./CompanyDAO");
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');

let StoreAccount;

class StoreAccountDAO {
    static async injectDB(conn) {
      if (StoreAccount) {
        return;
      }
      try {
          StoreAccount = await conn.db(process.env.QRMAX_NS).collection("StoreAccount");
      } catch (e) {
        console.error(
          'unable to establish a collection handle in StoreAccountDAO" ${e}'
        );
      }
    }
    
    static async register(company, username, salt, hash){
      try{
        const registerDoc = {
          company: company,
          username: username,
          salt: salt,
          password: hash,
          stores:[]
        }
        return await StoreAccount.insertOne(registerDoc)
      }
      catch(e){
        console.error('unable to post register:' + e)
      }
    }

    static async checkAccount(company, username){
      let result = await StoreAccount.findOne({company:company, username:username}, {upsert:true});
      if (result){
          return true;
      }
      return false;
    }

    static async getSalt(company, username){
      let result = await StoreAccount.findOne({company:company, username:username}, {upsert:true});
      if (!result){
        result = await CompanyDAO.checkCompany(company);
        if (!result){
          return {status:'failure', cause:'no such company'}
        }
        return {status:'failure', cause:'no such account'}
      }
      return result.salt;
    }

    static async checkLogin(company, username, password){
      let result = await StoreAccount.findOne({company:company, username:username, password:password}, {upsert:true});
        if (result){
            return {status:'success'};
        }
        return {status:'failure', cause:'incorrect password'};
    }

    static async delete(company, username){
      StoreAccount.deleteOne({company:company, username:username});
    }

    static async checkFields(company, username, fields){
      let check = true;
      for (let field of fields){
          console.log(field);
          let result = await StoreAccount.findOne({company:company, username:username, [field]:{$exists:true}});
          console.log(result);
          if (!result){
              check = false;
          }
          result = null;
      }
      return check;
    }

    static async patch(Company, username, fields, values){
      let i = -1;
        
        for (let field of fields){
            i++;
            const value = values[i];
            if(field === 'company' || 'salt'){
                
            }
            else if(field === 'password'){
                // generate salt
                const salt = uuidv4();
                // hash password
                const hash = pbkdf2 (value, salt, 80000, 32).toString('hex');
                // store company salt and hash
                await StoreAccount.updateOne({company:Company}, {$set:{[field]:hash, salt:salt}}, {upsert:false})
            }
            else{
                await StoreAccount.updateOne({company:Company}, {$set:{[field]:value}}, {upsert:false})
            }
        }
    }

    static async getList(company){
      let result = await StoreAccount.find({company:company}, {projection:{_id:0, username:1}}).toArray();
      console.log(result);
      return result;
    }
}

module.exports = StoreAccountDAO;

