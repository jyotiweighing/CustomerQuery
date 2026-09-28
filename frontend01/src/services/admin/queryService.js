import API from "../../config/api";

export const getCustomerQueries = async (params = {}) => {
  const res = await API.get("/queries", { params });
  return res.data;
};

export const getCustomerQueryById = async (id) => {
  const res = await API.get(`/queries/${id}`);
  return res.data;
};

export const assignCustomerQueryToStaff = async (id, staffId, dueDate) => {
  const res = await API.patch(`/queries/${id}/assign-staff`, { staffId, dueDate });
  return res.data;
};

export const addCustomerQueryMessage = async (id, payload) => {
  const res = await API.post(`/queries/${id}/messages`, payload);
  return res.data;
};



export const createAdminQuery = async (payload) => {
  const res = await API.post("/queries/admin-create", payload);
  return res.data;
};
