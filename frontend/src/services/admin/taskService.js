// import API from "../config/api";

// // export const getTasksByStaff = async () => {
// //   const res = await API.get("/task/getstafftask");
// //   return res.data;
// // };


// export const getTasksByStaff = async (staffId, status = "") => {
//   const res = await API.get(`/task/getstafftask/${staffId}`);
//   return res.data;
// };

import API from "../../config/api";

export const getTasks = async (filters = {}) => {
  const res = await API.get("/task", { params: filters });
  return res.data;
};

export const getTaskByInstallation = async (installationId) => {
  const res = await API.get(`/task/by-installation/${installationId}`);
  return res.data;
};

export const createTask = async (payload) => {
  const res = await API.post("/task/create", payload);
  return res.data;
};

export const getTasksByStaff = async (staffId, status = "") => {
  const res = await API.get(`/task/getstafftask/${staffId}`, {
    params: status ? { status } : {},
  });
  return res.data;
};

export const fetchTaskById = async (taskId) => {
  const res = await API.get(`/task/${taskId}`);
  return res.data;
};

export const updateTaskStatus = async (taskId, status, progress) => {
  const res = await API.patch(`/task/${taskId}/status`, { status, progress });
  return res.data;
};

export const updateTaskProgress = async (taskId, progress) => {
  const res = await API.patch(`/task/${taskId}/progress`, { progress });
  return res.data;
};

export const addTaskRemark = async (taskId, text, author) => {
  const res = await API.post(`/task/${taskId}/remark`, { text, author });
  return res.data;
};

// `file` should be a File/Blob (e.g. from an <input type="file"> change event).
export const uploadTaskFile = async (taskId, file, label = "Document") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("label", label);
  const res = await API.post(`/task/${taskId}/file`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getMonthlyPerformance = async (staffId) => {
  const res = await API.get(`/task/monthly/${staffId}`);
  return res.data;
};

export const getWeeklyActivity = async (staffId) => {
  const res = await API.get(`/task/weekly/${staffId}`);
  return res.data;
};

export const getReports = async (staffId) => {
  const res = await API.get(`/task/reports/${staffId}`);
  return res.data;
};