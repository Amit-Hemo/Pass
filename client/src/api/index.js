import axios from "axios";

// for development
const baseURL = "http://192.168.1.32:5000";

export default client = axios.create({
  baseURL,
  // new headers will be filled (e.g authorization)
});
