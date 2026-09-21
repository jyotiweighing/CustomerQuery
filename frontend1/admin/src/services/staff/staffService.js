import API from "../../config/api";

export const getStaffList = async () => {
  const res = await API.get("/staff/getstaff");
  return res.data;
};

export const addStaffMember = async (data) => {
  const res = await API.post("/staff/addstaff", data);
  return res.data;
};

export const updateStaffMember = async (id, data) => {
  const res = await API.put(`/staff/update/${id}`, data);
  return res.data;
};

export const deleteStaffMember = async (id) => {
  const res = await API.delete(`/staff/delete/${id}`);
  return res.data;
};