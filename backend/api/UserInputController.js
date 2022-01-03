import UserInputDAO from "../dao/UserInputDAO.js";

export default class UserInputController {
  /*static async apiGetUserInputs(req, res, next) {
        const InputsPerPage = req.query.InputsPerPage ? parseInt(req.query.InputsPerPage, 10):20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.URL) {
            filters.URL = req.query.URL;
          } else if (req.query.UserIdentifier) {
            filters.UserIdentifier = req.query.UserIdentifier;
          } else if (req.query.TimeOfInput) {
            filters.TimeOfInput = req.query.TimeOfInput;
          }

          const { userInputList, totalNumberOfUserInputs } = await UserInputDAO.getUserInput({
              filters,
              page,
              InputsPerPage,
          })

          let response = {
              UserInputs: userInputList,
              page: page,
              filters: filters,
              entries_per_page: InputsPerPage,
              total_results: totalNumberOfUserInputs,
          }
          res.json(response)
    }*/

  static async apiGetUserInput(req, res, next) {
    try {
      const userIdentifier =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
      const tempURL = req.protocol + "://" + req.get("host") + req.originalUrl;
      const URL = tempURL.split(/[/ ]+/).pop();
      const TimeOfInput = Date.now();

      const UserInputResponse = await UserInputDAO.postUserInput(
        userIdentifier,
        URL,
        TimeOfInput
      );
      res.json({ status: "success" });
    } catch (e) {
      res.json({ status: "fail", cause: e });
    }
  }

  /*static async apiPostUserInput(req, res, next){
      try{
        const userIdentifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null
        const URL = req.body.URL
        console.log(URL)
        const TimeOfInput = Date.now()
      
      const UserInputResponse = await UserInputDAO.postUserInput(
        userIdentifier,
        URL,
        TimeOfInput
      )
      res.json({status:"success"})
    }
    catch(e){
      res.status(500).json({error: e.message})
    }
  }*/
}
