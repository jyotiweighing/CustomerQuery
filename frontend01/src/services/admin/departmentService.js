import api from "../../config/api";

export const getDepartments = async () => {
  const res = await api.get("/depart/getdepartments");
  return res.data;
};

export const addDepartment = async (data) => {
  const res = await api.post("/depart/adddepartments", data);
  return res.data;
};

export const updateDepartment = async (id, data) => {
  const res = await api.put(`/depart/updatedepartments/${id}`, data);
  return res.data;
};

export const deleteDepartment = async (id) => {
  const res = await api.delete(`/depart/deletedepartments/${id}`);
  return res.data;
};