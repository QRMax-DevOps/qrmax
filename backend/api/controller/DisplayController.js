const CompanyDao = require("../../dao/CompanyDAO.js");

class StoreController {
    static async add(req, res){
        //get company, store, display
        const company = req.body.company;
        const store = req.body.store;
        const display = req.body.display;

        //check if company/store exists
        if(! await CompanyDao.checkStore(company, store)){
            res.json({status:"failure", cause:"no such store"})
        }
        //check if display already exists
        else if(await DisplayDAO.checkDisplay(company, store, display)){
            res.json({status:"failure", cause:"Display already exists"})
        }
        //create display(add to store as callback)
        else{
            DisplayDAO.newDisplay(company, store, display, CompanyDao.addDisplay);
            res.json({status:"success"})
        }
    }
}


module.exports = StoreController;