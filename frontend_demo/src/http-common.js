/* This file and all contained code was developed by:
 * 
 * Developer information:
 *  - Full name: Marcus Hickey
 *  - Student ID: 6344380 */

import axios from "axios";

export default axios.create({
  baseURL: "currentlyNull",
  headers: {
    "Content-type": "application/json"
  }
});