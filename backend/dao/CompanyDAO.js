let Company;

class CompanyDAO {
    static async injectDB(conn) {
        if (Company) {
          return;
        }
        try {
            Company = await conn.db(process.env.QRMAX_NS).collection("CompanyStore");
        } catch (e) {
          console.error(
            'unable to establish a collection handle in CompanyDAO" ${e}'
          );
        }
    }

    static async checkCompany(company){
      let result = await Company.findOne({company:company});
      if (result){
          return true;
      }
      return false;
    }

    static async register(company){
        try{
            const registerDoc = {
              company: company,
              storeCount:0,
              stores:[]
            }
            return await Company.insertOne(registerDoc)
        }
        catch(e){
            console.error('unable to post register:' + e)
        }
    }

    static async delete(company){
        await Company.deleteOne({company:company})
    }

    static async updateName(company, value){
        await Company.updateOne({company:company}, {$set:{company:value}}, {upsert:false})
    }

    static async getList(company){
      let result = await Company.findOne({company:company}, {projection:{_id:0, storeCount:0, company:0}});
      return result;
    }

    static async checkStore(company, fstore){
      let result = await Company.findOne({company:company, stores:{$elemMatch:{store:fstore}}});
      if (result){
          return true;
      }
      return false;
    }

    static async addStore(company, store){
      //get the store count from parent and set ID to it
      let ID = await Company.findOne({company:company}, {projection:{_id:0, storeCount:1}})
      ID = ID.storeCount;
      ID += 1;
      //add store
      Company.updateOne({company:company}, {$push:{stores:{ID:ID,store:store}}})
      //increment storeCount
      Company.updateOne({company:company}, {$set:{storeCount:ID}})
    }

    static async deleteStore(company, store){
      //find store to deletes ID and set ID to it
      let result = await Company.findOne({company:company}, {projection:{_id:0, stores:1}});
      let ID;
      for(var i = 0; i < result.stores.length; i++){
        if(result.stores[i].store === store){
          ID = result.stores[i].ID;
        }
      }
      //delete store
      await Company.updateOne({company:company}, {$pull:{stores:{store:store}}}, {upsert:true})
      //for all ID greater than ID
      result = await Company.findOne({company:company});
      //loop through and increment ID
      for(var i = 0; i < result.stores.length; i++){
        console.log(result.stores[i].ID);
        if(result.stores[i].ID > ID){
          result.stores[i].ID -= 1;
        }
      }
      //decrement storeCount
      result.storeCount -= 1;
      //replace doc
      await Company.updateOne({company:company}, {$set:{storeCount:result.storeCount, stores:result.stores}})
    }

    static async patchStore(company, store, farray, varray){
      
    }
}

module.exports = CompanyDAO;