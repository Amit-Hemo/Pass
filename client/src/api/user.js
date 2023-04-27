import client from "./index";

export const createUser = (userDetails) => client.post("/users", userDetails);
export const requestOTP = (email) =>
  client.post("/users/requestOTP", { email });
export const loginUser = (userDetails) =>
  client.post("/users/login", userDetails);
export const validateOTP = (userDetails) =>
  client.post("/users/validateOTP", userDetails);
export const forgotPassword = (email) =>
  client.post("users/forgotPassword", { email });
export const resetPassword = (uuid, passwordsDetails) =>
  client.put(`users/${uuid}/resetPassword`, passwordsDetails);
