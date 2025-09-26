import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const getAllMovNoApply = async (currentAcountId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/nc/list/${currentAcountId}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getPendingReq = async (currentAcountId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/pending/${currentAcountId}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getPendingByRangeReq = async (sData) => {
  try {
    const { currentAcountId, range, filter } = sData;
    const { data } = await axios.get(
      `${apiUrl}/api/movement/pending/${currentAcountId}?initDate=${range[0]}&endDate=${range[1]}&filter=${filter}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getPendingBySellerReq = async (sellerId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/pending/seller/${sellerId}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
