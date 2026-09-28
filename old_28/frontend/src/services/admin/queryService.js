import API from "../../config/api";

export const getCustomerQueries = async (params = {}) => {
  const res = await API.get("/queries", { params });
  return res.data;
};

export const getCustomerQueryById = async (id) => {
  const res = await API.get(`/queries/${id}`);
  return res.data;
};

export const assignCustomerQueryToStaff = async (id, staffId) => {
  const res = await API.patch(`/queries/${id}/assign-staff`, { staffId });
  return res.data;
};

export const addCustomerQueryMessage = async (id, payload) => {
  const res = await API.post(`/queries/${id}/messages`, payload);
  return res.data;
};
