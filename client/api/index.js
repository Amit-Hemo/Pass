import axios from "axios";

// for development
const baseURL = "http://10.0.0.5:5000";

export default client = axios.create({
  baseURL,
  // new headers will be filled (e.g authorization)
});
