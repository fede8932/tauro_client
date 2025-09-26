import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const searchClousing = async (filters) => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/client/pay/closing/get`,
        filters,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      if (error.response?.status == 401) {
        window.location.href = '/';
      }
      if (error.response?.status == 401) {
        window.location.href = '/';
      }
      throw error;
    }
  };
  export const finishClousing = async (id) => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/client/gen/pay/${id}`,
        null,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      if (error.response?.status == 401) {
        window.location.href = '/';
      }
      if (error.response?.status == 401) {
        window.location.href = '/';
      }
      throw error;
    }
  };
  export const getCloseingId = async (id) => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/client/pay/closing/get/${id}`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      if (error.response?.status == 401) {
        window.location.href = '/';
      }
      if (error.response?.status == 401) {
        window.location.href = '/';
      }
      throw error;
    }
  };
