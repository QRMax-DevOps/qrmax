let UserInput;

class UserInputDAO {
  static async injectDB(conn) {
    if (UserInput) {
      return;
    }
    try {
      UserInput = await conn.db(process.env.QRMAX_NS).collection("UserInput");
    } catch (e) {
      console.error(
        'unable to establish a collection handle in UserInputDAO" ${e}'
      );
    }
  }

  /*
  static async getUserInput({
    filters = null,
    page = 0,
    InputsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("URL" in filters) {
        query = { URL: { $eq: filters["URL"] } };
      } else if ("UserIdentifier" in filters) {
        query = { UserIdentifier: { $eq: filters["UserIdentifier"] } };
      } else if ("TimeOfInput" in filters) {
        query = { TimeOfInput: { $eq: filters["TimeOfInput"] } };
      }
    }

    let cursor

    try{
        cursor = await UserInput
            .find(query)
    }
    catch (e) {
        console.error('unable to issue find command, ${e}')
        return { userInputList: [], totalNumberOfUserInputs: 0 }
    }

    const displayCursor = cursor.limit(InputsPerPage).skip(InputsPerPage*page)

    try{
        const userInputList = await displayCursor.toArray()
        const totalNumberOfUserInputs = await UserInput.countDocuments(query)

        return {userInputList, totalNumberOfUserInputs}
    }
    catch (e) {
        console.error(
            'unable to convert cursor to array or problem counting documents, ${e}',
        )
        return {userInputList: [], totalNumberOfUserInputs: 0}
    }
  }*/

  static async postUserInput(UserIdentifier, URL, TimeOfInput){
    try{
      const UserInputDoc = {
        UserIdentifier: UserIdentifier,
        URL: URL,
        TimeOfInput: TimeOfInput
      }
      return await UserInput.insertOne(UserInputDoc)
    }
    catch(e){
      console.error('unable to post User Input:' + e)
    }
  }

  static async validate(cleanURL) {
    return true; //stub
  }

  static async checkLastVote(cleanIdentifier) {
    try {
      //console.log(await UserInput.countDocuments({"UserIdentifier": {$eq: cleanIdentifier}}));
      if (await UserInput.countDocuments({"UserIdentifier": {$eq: cleanIdentifier}})>0) {
        return false;
      }
      else {
        return true;
      }
    } 
    catch(e) {
      res.json({ status: "fail", cause: e });
      return false;
    }
  }

  static async geoLocate(cleanIdentifier) {
    return true; //stub
  }
  
}

module.exports = UserInputDAO;
