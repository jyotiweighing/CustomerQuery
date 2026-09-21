import API from "../../config/api";



export const createinstall = async (data) => {
  const res = await API.post("/install/create", data);
  return res.data;
};

export const getinstall = async () => {
  const res = await API.get("/install/getinstall");
  return res.data;
};
