import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const createSale = async (saleData) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/sale`, saleData, {
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

export const deleteSale = async (id) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/api/sale/${id}`, {
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

export const toggleStatusSale = async (id) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/sale/toggle/status/${id}`,
      null,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const changePriori = async ({id, mode}) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/sale/change/prior/${id}?order=${mode}`,
      null,
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
