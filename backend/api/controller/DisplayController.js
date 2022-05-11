const CompanyDAO = require("../../dao/CompanyDAO.js");
const DisplayDAO = require("../../dao/DisplayDAO.js");

class StoreController {
    static async add(req, res){
        try{
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
        catch(e){
            res.json({status:"failure",cause:e});
        }
    }

    static async delete(req, res){
        try{
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
        catch(e){
            res.json({status:"failure",cause:e});
        }
    }

    static async list(req, res){
        try{
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
        catch(e){
            res.json({status:"failure",cause:e});
        }
    }
	
    static async patch(req, res){
        try{
            const company = req.body.company;
            const store = req.body.store;
		    const display = req.body.display;
            const fields = req.body.fields;
            const values = req.body.values;

            const farray = fields.split(',');
            const varray = values.split(',');
		    //check if store exists
            if(! await CompanyDAO.checkStore(company, store)){
                res.json({status:"failure", cause:"no such store"});
            }
            //check if display already exists
            else if(!await DisplayDAO.checkDisplay(company, store, display)){
                res.json({status:"failure", cause:"no such display"});
            }
		    else {
		    	DisplayDAO.patchDisplay(company, store, display, farray, varray);
		    	res.json({status:"success"});
		    }
        }
        catch(e){
            res.json({status:"failure", cause:e});
        }
    }

    static async listen(req, res){
        try{
            //get company, store, display
            const company = req.body.company;
            const store = req.body.store;
            const display = req.body.display;
            let rJson = await DisplayDAO.listen(company, store, display);
            res.json({status:"success", display:rJson});
        }
        catch(e){
            res.json({status:"failure",cause:e});
        }
    }
    static async changeSettings(req, res){
        try{
            const company = req.body.company;
            const store = req.body.store;
            const display = req.body.display;
            const fields = req.body.fields;
            const values = req.body.values;

            if(!(await CompanyDAO.checkStore(company, store))){
                res.json({status:"failure", cause:"no such store"})
            }
            else if(!(await DisplayDAO.checkDisplay(company, store, display))){
                res.json({status:"failure", cause:"no such display"})
            }
            else{
                DisplayDAO.setSettings(company, store, display, fields, values);
                res.json({status:"success"});
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async getInteractions(req, res){
            const company = req.body.company;
            const store = req.body.store;
            const display = req.body.display;
            const period = req.body.period;
            if(!(await CompanyDAO.checkStore(company, store))){
                res.json({status:"failure", cause:"no such store"})
            }
            else if(!(await DisplayDAO.checkDisplay(company, store, display))){
                res.json({status:"failure", cause:"no such display"})
            }
            else{
                let result = await DisplayDAO.getInteractions(company, store, display, period);
                res.json({status:"success", interactions:result});
            }

    }

    static async getSettings(req, res){
        try{
            const company = req.body.company;
            const store = req.body.store;
            const display = req.body.display;

            if(!(await CompanyDAO.checkStore(company, store))){
                res.json({status:"failure", cause:"no such store"})
            }
            else if(!(await DisplayDAO.checkDisplay(company, store, display))){
                res.json({status:"failure", cause:"no such display"})
            }
            else{
                let settingsR = await DisplayDAO.getSettings(company, store, display);
                res.json({status:"success", settings:settingsR.settings});
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async changeSettings(req, res){
        try{
            const company = req.body.company;
            const store = req.body.store;
            const display = req.body.display;
            const fields = req.body.fields;
            const values = req.body.values;

            if(!(await CompanyDAO.checkStore(company, store))){
                res.json({status:"failure", cause:"no such store"})
            }
            else if(!(await DisplayDAO.checkDisplay(company, store, display))){
                res.json({status:"failure", cause:"no such display"})
            }
            else{
                DisplayDAO.setSettings(company, store, display, fields, values);
                res.json({status:"success"});
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async newBaseMedia(req, res){
        try{
            const company = req.body.company;
            const store = req.body.store;
            const display = req.body.display;
            const baseMedia = req.body.baseMedia;
            const baseMediaFile = req.body.baseMediaFile;
            const TTL = req.body.TTL;

            if(!(await CompanyDAO.checkStore(company, store))){
                res.json({status:"failure", cause:"no such store"})
            }
            else if(!(await DisplayDAO.checkDisplay(company, store, display))){
                res.json({status:"failure", cause:"no such display"})
            }
            else{
                DisplayDAO.newBaseMedia(company, store, display, baseMedia, baseMediaFile, TTL);
                res.json({status:"success"});
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }

    static async getBaseMedia(req, res){
        try{
            const company = req.body.company;
            const store = req.body.store;
            const display = req.body.display;
            if(!(await CompanyDAO.checkStore(company, store))){
                res.json({status:"failure", cause:"no such store"})
            }
            else if(!(await DisplayDAO.checkDisplay(company, store, display))){
                res.json({status:"failure", cause:"no such display"})
            }
            else{
                let result = await DisplayDAO.getBaseMedia(company, store, display);
                res.json({status:"success", baseMedia:result});
            }
        }
        catch(e){
            res.json({status:"failure", cause:e})
        }
    }
}

module.exports = StoreController;
