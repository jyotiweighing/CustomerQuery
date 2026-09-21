import API from "../../config/api";



export const createinstall = async (data) => {
  const res = await API.post("/install/create", data);
  return res.data;
};

export const getinstall = async () => {
  const res = await API.get("/install/getinstall");
  return res.data;
};



export const updateinstall = async (id, data) => {
  try {
    const response = await API.put(`/install/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating installation:", error);
    throw error;
  }
};