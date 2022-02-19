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
              companyName: uname,
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
        const result = await CompanyAccount.findOne({companyName:uname});
        if (!result){
            return {status:'failure', cause:'no such account'}
        }
        return result.salt;
    }

    static async checkLogin(uname, hash){
        let result = await CompanyAccount.findOne({companyName:uname, password:hash});
        if (result){
            return {status:'success'};
        }
        return {status:'failure', cause:'incorrect password'};
    }

    static async checkAccount(company){
        let result = await CompanyAccount.findOne({companyName:company});
        if (result){
            return true;
        }
        return false;
    }

    static async checkFields(company, fields){
        let check = true;
        for (let field of fields){
            let result = await CompanyAccount.findOne({companyName:company}, {[field]:{$exists:true}});
            if (!result){
                check = false;
            }
        }
        return check;
    }

    static async patch(Company, fields, values){
        let i = -1;
        console.log(fields);
        console.log(values);
        
        for (let field of fields){
            i++;
            const value = values[i];
            if(field === 'companyName'){
                await CompanyAccount.updateOne({companyName:Company}, {$set:{companyName:value}}, {upsert:false})
                Company = value;
                //update all stores with new company name
            }
            else if(field === 'password'){
                // generate salt
                const salt = uuidv4();
                // hash password
                const hash = pbkdf2 (value, salt, 80000, 32).toString('hex');
                // store companyName salt and hash
                await CompanyAccount.updateOne({companyName:Company}, {$set:{[field]:hash, salt:salt}}, {upsert:false})
            }
            else{
                await CompanyAccount.updateOne({companyName:Company}, {$set:{[field]:value}}, {upsert:false})
            }
        }
    }

    static async delete(Company){
        await CompanyAccount.deleteOne({companyName:Company})
    }   

}

module.exports = CompanyAccountDAO;