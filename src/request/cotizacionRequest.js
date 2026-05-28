import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const searchCotizacionRequest = async (body) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/cotizacion/search`, body, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getCotizacionById = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/cotizacion/${id}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const createCotizacion = async (body) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/cotizacion`, body, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
