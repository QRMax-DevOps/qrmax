import express from "express";
import UserInputController from "./UserInputController.js"

const router = express.Router();


router
    .route("/")
    .get(UserInputController.apiGetUserInput)
    //.post(UserInputController.apiPostUserInput)

export default router;
