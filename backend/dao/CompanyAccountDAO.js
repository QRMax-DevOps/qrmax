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
    
    static async register(uname ,salt, hash){
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
        return 'salt'
    }

    static async checkLogin(username, hash){
        return true;
    }

}

module.exports = CompanyAccountDAO;

