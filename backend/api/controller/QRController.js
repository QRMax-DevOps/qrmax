const CompanyDAO = require("../../dao/CompanyDAO.js");
const DisplayDAO = require("../../dao/DisplayDAO.js");

class QRController {
    static async add(req, res){
        //get company, store, display
        const company = req.body.company;
        const store = req.body.store;
        const display = req.body.display;
        const mediaName = req.body.mediaName;
		const mediaFile = req.body.mediaFile;
		//const linkedURITime = red.body.linkedURITime;
        //check if company/store exists
        if(!await CompanyDAO.checkStore(company, store)){
            res.json({status:"failure", cause:"no such store"});
        }
        //check if display already exists
        else if(!await DisplayDAO.checkDisplay(company, store, display)){
            res.json({status:"failure", cause:"no such display"});
        }
        //create qr
        else{
            DisplayDAO.addQR(company, store, display, mediaName, mediaFile);
            res.json({status:"success"});
        }
        return res;
    }
	
    static async delete(req, res){
        const company = req.body.company;
        const store = req.body.store;
		const display = req.body.display;
		const mediaName = req.body.mediaName;
        if(! await CompanyDAO.checkStore(company, store)){
            res.json({status:"failure", cause:"no such store"});
        }
        //check if display exists
        else if(!await DisplayDAO.checkDisplay(company, store, display)){
            res.json({status:"failure", cause:"no such display"});
        }
        else if(!await DisplayDAO.checkMedia(company, store, display, mediaName)){
            res.json({status:"failure", cause:"no such media"});
        }
        //delete media
        else{
            DisplayDAO.deleteMedia(company, store, display,mediaName);
            res.json({status:"success"});
        }
    }
	
    static async list(req, res){
        //get company name
        const company = req.body.company;
        const store = req.body.store;
		const display = req.body.display;
        //check if comapny exists
        if(! await CompanyDAO.checkStore(company, store)){
            res.json({status:"failure", cause:"no such store"});
        }
        //check if display already exists
        else if(!await DisplayDAO.checkDisplay(company, store, display)){
            res.json({status:"failure", cause:"no such display"});
        }
        else{
            //get all stores list
            const rjson = await DisplayDAO.listQR(company, store, display);
            //return list as json
            res.json(rjson);
        }
        return res;
    }
	
    static async patch(req, res){
        const company = req.body.company;
        const store = req.body.store;
		const display = req.body.display;
		const QRID = req.body.QRID;
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
        else if(!await DisplayDAO.checkQR(company, store, display, QRID)){
            res.json({status:"failure", cause:"no such QR"});
        }
		else {
			DisplayDAO.patchQR(company, store, display, QRID, farray, varray);
			res.json({status:"success"});
		}
    }

    static async getMedia(req, res){
        const company = req.body.company;
        const store = req.body.store;
		const display = req.body.display;
        const mediaName = req.body.mediaName;
        const result = await DisplayDAO.getMedia(company, store, display, mediaName);
        //TODO: check if shit exists
        let mediaFile = result.mediaFile;
        res.json({status:"success", mediaFile});
    }
}


module.exports = QRController;