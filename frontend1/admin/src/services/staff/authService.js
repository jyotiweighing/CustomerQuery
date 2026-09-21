import api from "../../config/api";

export const signup = async (data) => {
  // console.log("hey this is data", data)
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const login = async (data) => {
  // console.log("hey this is data", data)
  const response = await api.post("/auth/loginstaff", data);
  return response.data;
};

export const forgotPassword = async (data) => {
  console.log("hey this is data", data);
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};
export const resendOtp = async (data) => {
  const response = await api.post("/auth/resend-otp", data);
  return response.data;
};
export const resetPassword = async (data) => {
  console.log("req.body", data);
  const response = await api.put("/user/staff-change-password", data);
  console.log("response", response);
  return response.data;
};

//staff
export const staffforgotPassword = async (data) => {
  console.log("hey this is data", data);
  const response = await api.post("/auth/staff-forgot-password", data);
  console.log("hey this is staffforgotPassword", response);
  return response.data;
};

export const staffverifyOtp = async (data) => {
  console.log("hey this is data", data);
  const response = await api.post("/auth/staff-verify-otp", data);
    console.log("hey this is staffverifyOtp", response);
  return response.data;
};
export const staffresendOtp = async (data) => {
  const response = await api.post("/auth/staff-resend-otp", data);
  console.log("hey this is staffresendOtp", response);
  return response.data;
};
export const staffresetPassword = async (data) => {
  console.log("req.body", data);
  const response = await api.post("/auth/staff-reset-password", data);
  console.log("response staffresetPassword ", response);
  return response.data;
};
