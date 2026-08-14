import API from "../../config/api";


// export const getAnalytics = async (department = "All") => {
//   const res = await API.get("/report/analytics", {
//     params: { department }
//   });
//   return res.data;
// };


export const getAnalytics = async (params = {}) => {
  try {
    const { department = "All", fromDate = "", toDate = "", staff = "ALL" } = params;
    
    const response = await API.get("/report/analytics", {
      params: {
        department,
        fromDate,
        toDate,
        staff,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error in getAnalytics:", error);
    throw error;
  }
};

export const getDashboardAnalytics = async (department = "All") => {
  const res = await API.get("/report/getDashboardData", {
    params: { department }
  });
  return res.data;
};



