import API from "../../config/api";

export const fetchNotifications = async (staffId) => {
  try {
    const res = await API.get(`/notification/${staffId}`);
    return res.data?.data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationRead = async (id) => {
  try {
    const res = await API.patch(`/notification/read/${id}`);
    return res.data?.data || [];
  } catch (error) {
    console.error('Error marking notification read:', error);
    return [];
  }
};

export const markAllNotificationsRead = async (staffId) => {
  try {
    const res = await API.patch(`/notification/read-all/${staffId}`);
    return res.data?.data || [];
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    return [];
  }
};

export const checkDueDateAlerts = async () => {
  try {
    const res = await API.post('/notification/check-due-alerts');
    return res.data;
  } catch (error) {
    console.error('Error checking due alerts:', error);
  }
};