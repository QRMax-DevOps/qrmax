import axios from "axios";

export default axios.create({
  baseURL: "currentlyNull",
  headers: {
    "Content-type": "application/json"
  }
});