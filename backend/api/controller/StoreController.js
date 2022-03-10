const CompanyDao = require("../../dao/CompanyDAO.js");

class StoreController {
    static async list(req, res){
        try{
            //get company name
            const company = req.body.company;
            //check if comapny exists
            if(await CompanyDao.checkCompany(company)){
                //get all stores list
                const rjson = await CompanyDao.getList(company);
                //return list as json
                res.json(rjson);
            }
            else{
                res.json({status:"failure", cause:"no such company"});
            }
            return res;
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async register(req, res){
        try{
            //get company, store
            const company = req.body.company;
            const store = req.body.store;
            //ensure company exists
            if(await CompanyDao.checkCompany(company)){
                //check to ensure store dosent exists
                if(!await CompanyDao.checkStore(company, store)){
                    CompanyDao.addStore(company, store)
                    res.json({status:"success"})
                }
                else{
                    res.json({status:"failure", cause:"store already exists"});
                }
            }
            else{
                res.json({status:"failure", cause:"no such company"});
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async patch(req, res){
        try{
            const company = req.body.company;
            const store = req.body.store
            const fields = req.body.fields;
            const values = req.body.values;

            const farray = fields.split(',');
            const varray = values.split(',');
            //check if store exists
            if(await CompanyDao.checkStore(company, store)){
                //check if fields exists
                if(await CompanyDao.checkFields(company, store, farray)){
                    //update field with value
                    CompanyDao.patchStore(company, store, farray, varray);
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
        catch(e){
            res.json({status:"failure", cause:e})
        }   
    }

    static async delete(req, res){
        try{
            const company = req.body.company;
            const store = req.body.store;
            if(await CompanyDao.checkCompany(company)){
                //check to ensure store dose exists
                if(await CompanyDao.checkStore(company, store)){
                    CompanyDao.deleteStore(company, store)
                    res.json({status:"success"})
                }
                else{
                    res.json({status:"failure", cause:"no such store"});
                }
            }
            else{
                res.json({status:"failure", cause:"no such company"});
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }   
}

module.exports = StoreController;