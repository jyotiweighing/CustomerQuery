import API from "../../config/api";

export const fetchTasks = async (staffId, status = "") => {
  try {
    const queryParam = status && status !== "All" ? `?status=${status}` : "";
    const res = await API.get(`/task/getstafftask/${staffId}${queryParam}`);

    return res.data?.data || res.data || [];
  } catch (error) {
    console.error("API Error in fetchTasks:", error);
    return [];
  }
};

export const updateTaskStatus = async (taskId, status) => {
  const res = await API.patch(`/task/${taskId}/status`, { status });
  return res.data?.data || res.data;
};

export const fetchTaskById = async (taskId) => {
  const response = await API.get(`/task/${taskId}`);
  return response.data;
};

// 3. Update Task Progress
export const updateTaskProgress = async (taskId, progress) => {
  const response = await API.patch(`/task/${taskId}/progress`, { progress });
  return response.data;
};

// 4. Add Task Remark
export const addTaskRemark = async (taskId, remark) => {
  const response = await API.post(`/task/${taskId}/remark`, { remark });
  return response.data;
};

export const uploadTaskFile = async (taskId, formData) => {
  const response = await API.post(`/task/${taskId}/file`, formData);
  return response.data;
};

export const fetchMonthlyPerformance = async (staffId) => {
  const res = await API.get(`/task/monthly/${staffId}`);
  return res.data?.data || [];
};

export const fetchWeeklyActivity = async (staffId) => {
  const res = await API.get(`/task/weekly/${staffId}`);
  return res.data?.data || [];
};

export const fetchReports = async (staffId) => {
  const res = await API.get(`/task/reports/${staffId}`);
  return (
    res.data?.data || {
      installationReports: [],
      queryReports: [],
      monthlyCompleted: [],
    }
  );
};
