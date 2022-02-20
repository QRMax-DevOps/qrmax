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
      let result = await Company.findOne({company:company}, {_id:0, company:0});
      return result;
    }

    static async checkStore(company, store){
      let result = await Company.findOne({company:company, stores:store});
      if (result){
          return true;
      }
      return false;
    }

    static async addStore(company, store){
      await Company.updateOne({company:company}, {$push:{stores:[ID,store]}})
    }

    static async deleteStore(company, store){
      await Company.updateOne({company:company}, {stores:{$pull:{store:store}}})
    }

    static async patchStore(company, store){
      
    }
}

module.exports = CompanyDAO;