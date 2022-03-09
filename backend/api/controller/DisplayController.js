const CompanyDAO = require("../../dao/CompanyDAO.js");
const DisplayDAO = require("../../dao/DisplayDAO.js");

class StoreController {
    static async add(req, res){
        //get company, store, display
        const company = req.body.company;
        const store = req.body.store;
        const display = req.body.display;

        //check if company/store exists
        if(!(await CompanyDAO.checkStore(company, store))){
            res.json({status:"failure", cause:"no such store"})
        }
        //check if display already exists
        else if(await DisplayDAO.checkDisplay(company, store, display)){
            res.json({status:"failure", cause:"Display already exists"})
        }
        //create display(add to store as callback)
        else{
            DisplayDAO.newDisplay(company, store, display, CompanyDAO.addDisplay);
            res.json({status:"success"})
        }
        return res;
    }

    static async delete(req, res){
        //get company, store, display
        const company = req.body.company;
        const store = req.body.store;
        const display = req.body.display;
        //check if display already exists
        if(! await DisplayDAO.checkDisplay(company, store, display)){
            res.json({status:"failure", cause:"no such display"})
        }
        //delete display
        else{
            DisplayDAO.deleteDisplay(company, store, display);
            res.json({status:"success"})
        }
        return res;
    }

    static async list(req, res){
        //get company, store, display
        const company = req.body.company;
        const store = req.body.store;
        //check if company/store exists
        if(! await CompanyDAO.checkStore(company, store)){
            res.json({status:"failure", cause:"no such store"})
        }
        //delete display
        else{
            var result = await DisplayDAO.listDisplays(company, store);
            res.json({status:"success", displays:result})
        }
        return res;
    }

    static async listen(req, res){
        //get company, store, display
        const company = req.body.company;
        const store = req.body.store;
        const display = req.body.display;
        let rJson = await DisplayDAO.listen(company, store, display);
        res.json({status:"success", display:rJson});
    }
}


module.exports = StoreController;
