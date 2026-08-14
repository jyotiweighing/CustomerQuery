import api from "../../config/api";

export const getProfile = async () => {
  const response = await api.get("/user/profile");
  return response.data;
};

export const updateProfile = async (data) => {
  // Check agar data FormData object hai
  const isFormData = data instanceof FormData;

  const response = await api.put("/user/profile", data, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  });

  return response.data;
};

export const changePassword = async (payload) => {
  const res = await api.put("/user/change-password", payload);
  return res.data;
};