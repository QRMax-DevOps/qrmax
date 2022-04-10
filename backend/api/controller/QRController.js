const CompanyDAO = require("../../dao/CompanyDAO.js");
const DisplayDAO = require("../../dao/DisplayDAO.js");

class QRController {
    static async add(req, res){
        try{
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
        catch(e){
            res.json({status:"failure", cause:e});
        }
    }
	
    static async delete(req, res){
        try{
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
        catch(e){
            res.json({status:"failure", cause:e});
        }
    }
	
    static async list(req, res){
        try{
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
        catch(e){
            res.json({status:"failure", cause:e});
        }
    }
	
    static async patch(req, res){
        try{
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
        catch(e){
            res.json({status:"failure", cause:e});
        }
    }

    static async getMedia(req, res){
        try{
            const company = req.body.company;
            const store = req.body.store;
		    const display = req.body.display;
            const mediaName = req.body.mediaName;
            const result = await DisplayDAO.getMedia(company, store, display, mediaName);
            //TODO: check if shit exists
            let mediaFile = result.mediaFile;
            res.json({status:"success", mediaFile});
        }
        catch(e){
            res.json({status:"failure", cause:e});
        }
    }

    static async refreshMedia(req, res){
        //get Company store display media
        const company = req.body.company;
        const store = req.body.store;
		const display = req.body.display;
        const mediaName = req.body.mediaName;
        let result;
        //check if store exists
        if(! await CompanyDAO.checkStore(company, store)){
            res.json({status:"failure", cause:"no such store"});
        }
        //check if media is filled
        if (mediaName){
            //cehck the media exists
            if(await DisplayDAO.checkMedia(company, store, display, mediaName)){
                DisplayDAO.refreshSingleQR(company, store, display, mediaName);
                res.json({status:"success"});
            }
            else{
                res.json({status:"failure", cause:"no such media"});
            }
        }
        //check if display is filled
        else if (display){
            //ehck if the display exists
            if(await DisplayDAO.checkDisplay(company, store, display)){
                DisplayDAO.refreshDisplayQR(company, store, display);
                res.json({status:"success"});
            }
            else{
                res.json({status:"failure", cause:"no such display"});
            }
        }
        //otherwise refesh all QR
        else {
            DisplayDAO.refreshAllQR(company, store);
            res.json({status:"success"});
        }
        //return success 
    }
	
	static async addPosition(req, res) {
        try{
            //get company, store, display
            const company = req.body.company;
            const store = req.body.store;
            const display = req.body.display;
            const QRID = req.body.QRID;
		    const position = req.body.position;
			
            //check if company/store exists
            if(!await CompanyDAO.checkStore(company, store)){
                res.json({status:"failure", cause:"no such store"});
            }
            //check if display already exists
            else if(!await DisplayDAO.checkDisplay(company, store, display)){
                res.json({status:"failure", cause:"no such display"});
            }
            else if(!await DisplayDAO.checkQR(company, store, display, QRID)){
                res.json({status:"failure", cause:"no such QR"});
            }
            //create qr
            else{
                DisplayDAO.addPosition(company, store, display, QRID, position);
                res.json({status:"success"});
            }
            return res;
        }
        catch(e){
            res.json({status:"failure", cause:e});
        }
	}
	
	static async listPositions(req, res) {
        try{
            //get company name
            const company = req.body.company;
            const store = req.body.store;
		    const display = req.body.display;
			const QRID = req.body.QRID;
            //check if comapny exists
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
            else{
                //get all stores list
                const rjson = await DisplayDAO.listPositions(company, store, display, QRID);
                //return list as json
                res.json(rjson);
            }
            return res;
        }
        catch(e){
            res.json({status:"failure", cause:e});
        }
	}
	
	static async deletePositions(req, res) {
        try{
            const company = req.body.company;
            const store = req.body.store;
		    const display = req.body.display;
		    const QRID = req.body.QRID;
            if(! await CompanyDAO.checkStore(company, store)){
                res.json({status:"failure", cause:"no such store"});
            }
            //check if display exists
            else if(!await DisplayDAO.checkDisplay(company, store, display)){
                res.json({status:"failure", cause:"no such display"});
            }
            else if(!await DisplayDAO.checkQR(company, store, display, QRID)){
                res.json({status:"failure", cause:"no such QR"});
            }
            //delete media
            else{
                DisplayDAO.deletePositions(company, store, display,QRID);
                res.json({status:"success"});
            }
        }
        catch(e){
            res.json({status:"failure", cause:e});
        }
	}
}


module.exports = QRController;