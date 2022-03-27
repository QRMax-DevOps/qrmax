const CompanyDAO = require("./CompanyDAO");
const { v4: uuidv4 } = require('uuid');
const pbkdf2  = require('pbkdf2-sha256');
const jwt = require("jsonwebtoken");

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
          stores:[],
          settings:[]
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
			const token = jwt.sign({company: company, username: username},"secret_this_should_be_longer",{expiresIn: "1h"});
			      /*res.status(200).json({
			        token: token,
			        expiresIn: 3600,
			        userId: username
			      });*/
			return {status:'success', token:token};
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
	  let user = username;
        for (let field of fields) {
            i++;
            let value = values[i];
            if(field == 'company' || field == 'salt'){
                //dont do anyhting lol just return a success anyway
            }
            else if(field == 'username'){
              await StoreAccount.updateOne({company:Company, username:username}, {$set:{[field]:value}}, {upsert:false});
              user = value;
            }
            else if(field == 'password'){
                // generate salt
              const salt = uuidv4();
                // hash password
              const hash = pbkdf2 (value, salt, 80000, 32).toString('hex');
                // store company salt and hash
              await StoreAccount.updateOne({company:Company, username:user}, {$set:{[field]:hash, salt:salt}}, {upsert:false});
            }
            else if(field === "stores") {
              await StoreAccount.updateOne({company:Company, username:user}, {$pull:{stores:{}}}, {upsert:false});
              for (let val of values[i]) {
                let temp = val.split(',');
                let temp1 = temp[0].split(':');
                let temp2 = temp[1].split(':');
                
                await StoreAccount.updateOne({company:Company, username:user}, {$push:{stores:{ID:temp1[1], store:temp2[1]}}});
              }
            }
            else{
              await StoreAccount.updateOne({company:Company, username:user}, {$set:{[field]:value}}, {upsert:false});
            }
        }
    }

    static async getUserList(company){
	  var result = await StoreAccount.find({company:company}, {projection:{_id:0, company:0, salt:0, password:0, storeCount:0, stores:1, stores:{displays:0}}}).toArray();
	  return result;
    }

    static async getStoreList(company, username){
      let result = await StoreAccount.find({company:company, username:username}, {projection:{_id:0, company:0, username:0, salt:0, password:0, stores:{displays:0}}}).toArray();
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
        await StoreAccount.updateOne({company:company, username:username}, {$set:{storeCount:ID}})
      }
    }

    static async deleteUserStore(company, username, stores){
      let result
      let ID;
      for (let s of stores){
        //find store to deletes ID and set ID to it
        result = await StoreAccount.findOne({company:company, username:username}, {projection:{_id:0, stores:1,  stores:{displays:0}}});
        for(var i = 0; i < result.stores.length; i++){
          if(result.stores[i].store === s){
            ID = result.stores[i].ID;
          }
        }
        //delete store
        await StoreAccount.updateOne({company:company, username:username}, {$pull:{stores:{store:s}}}, {upsert:false})
        //for all ID greater than ID
        result = await StoreAccount.findOne({company:company, username:username});
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

    static async getSettings(company, username){
        let result = await CompanyAccount.findOne({company:company, username:username}, {projection:{_id:0, settings:1}});
        return result;
    }

  static async setSettings(company, username, fields, values){
      for (let i=0; i<fields.length; i++){
          let field = fields[i]
          StoreAccount.updateOne({company:company, username:username}, {settings:{[field]:values[i]}}, {upsert:true});
      }
  }

  static async getSettings(company, username){
    let result = await StoreAccount.findOne({company:company, username:username}, {projection:{_id:0, settings:1}});
    return result;
  }

static async setSettings(company, username, fields, values){
    fields = fields.split(',');
    values = values.split(',');

    for (let i=0; i<fields.length; i++){
        let field = fields[i];
        await StoreAccount.updateOne({company:company, username:username}, {$pull:{settings:{[field]:{$exists:true}}}});
        await StoreAccount.updateOne({company:company, username:username}, {$addToSet:{settings:{[field]:values[i]}}});
    }
  }
}

module.exports = StoreAccountDAO;

