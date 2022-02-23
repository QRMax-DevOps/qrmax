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
          storeCount:0,
          stores:[]
        }
        return await StoreAccount.insertOne(registerDoc)
      }
      catch(e){
        console.error('unable to post register:' + e)
      }
    }

    static async checkAccount(company, username){
      let result = await StoreAccount.findOne({company:company, username:username}, {upsert:false});
      if (result){
          return true;
      }
      return false;
    }

    static async getSalt(company, username){
      let result = await StoreAccount.findOne({company:company, username:username}, {upsert:false});
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
      let result = await StoreAccount.findOne({company:company, username:username, password:password}, {upsert:false});
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
          let result = await StoreAccount.findOne({company:company, username:username, [field]:{$exists:true}});
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
            let value = values[i];
            if(field == 'company' || field == 'salt'){
                //dont do anyhting lol just return a success anyway
            }
            else if(field == 'username'){
              await StoreAccount.updateOne({company:Company, username:username}, {$set:{[field]:value}}, {upsert:false});
              username = value;
            }
            else if(field == 'password'){
                // generate salt
                const salt = uuidv4();
                // hash password
                const hash = pbkdf2 (value, salt, 80000, 32).toString('hex');
                // store company salt and hash
                await StoreAccount.updateOne({company:Company, username:username}, {$set:{[field]:hash, salt:salt}}, {upsert:false})
            }
            else{
                await StoreAccount.updateOne({company:Company, username:username}, {$set:{[field]:value}}, {upsert:false})
            }
        }
    }

    static async getUserList(company){
      let result = await StoreAccount.find({company:company}, {projection:{_id:0, username:1, stores:1}}).toArray();
      return result;
    }

    static async getStoreList(company, username){
      let result = await StoreAccount.find({company:company, username:username}, {projection:{_id:0, stores:1}}).toArray();
      return result;
    }

    static async addUserStore(company, username, stores){
      let ID;
      for (let s of stores){
        //get the store count from parent and set ID to it
        ID = await StoreAccount.findOne({company:company, username:username}, {projection:{_id:0, storeCount:1}})
        ID = ID.storeCount;
        ID += 1;
        //add store
        await StoreAccount.updateOne({company:company, username:username}, {$push:{stores:{ID:ID,store:s}}})
        //increment storeCount
        await StoreAccount.updateOne({company:company}, {$set:{storeCount:ID}})
      }
    }

    static async deleteUserStore(company, username, stores){
      let result
      let ID;
      for (let s of stores){
        //find store to deletes ID and set ID to it
        result = await StoreAccount.findOne({company:company, username:username}, {projection:{_id:0, stores:1}});
        for(var i = 0; i < result.stores.length; i++){
          if(result.stores[i].store === s){
            ID = result.stores[i].ID;
          }
        }
        //delete store
        await StoreAccount.updateOne({company:company, username:username}, {$pull:{stores:{store:s}}}, {upsert:false})
        //for all ID greater than ID
        result = await StoreAccount.findOne({company:company});
        //loop through and increment ID
        for(var i = 0; i < result.stores.length; i++){
          if(result.stores[i].ID > ID){
            result.stores[i].ID -= 1;
          }
        }
        //decrement storeCount
        result.storeCount -= 1;
        //replace doc
        await StoreAccount.updateOne({company:company, username:username}, {$set:{storeCount:result.storeCount, stores:result.stores}})
      }
    }

    static async checkUserStores(company, username, stores){
      for (let s of stores){
        let result = await StoreAccount.findOne({company:company, username:username, stores:{$elemMatch:{store:s}}});
        if (result){
          continue;
        }
        else return false;
      }
      return true;
    }

    static async deleteAll(company){
      StoreAccount.deleteMany({company:company});
    }
}

module.exports = StoreAccountDAO;

