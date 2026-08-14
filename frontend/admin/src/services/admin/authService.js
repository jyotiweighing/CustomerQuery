import api from "../../config/api";

export const signup = async (data) => {
    // console.log("hey this is data", data)
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const login = async (data) => {
    // console.log("hey this is data", data)
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const forgotPassword = async (data) => {
     console.log("hey this is data", data)
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const verifyOtp = async (data) => {
    const response = await api.post("/auth/verify-otp",data);
    return response.data;
};
export const resendOtp = async (data) => {
  const response = await api.post("/auth/resend-otp", data);
  return response.data;
};
export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
