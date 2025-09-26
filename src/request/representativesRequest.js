import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const getRepresentativesBySupplier = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/representative/${id}`, {
      withCredentials: true,
    });
    const representatives = data.map((rep) => {
      return { text: `${rep.name} ${rep.apellido}`, value: rep.id };
    });
    return representatives;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const searchRepresentativesBySupplier = async (date) => {
  try {
    const { text, page } = date;
    const url = text
      ? `${apiUrl}/api/representative/search?rows=10&page=${page}&text=${text}`
      : `${apiUrl}/api/representative/search?rows=10&page=${page}`;
    const { data } = await axios.get(url, { withCredentials: true });
    const representatives = data.map((rep) => {
      return { text: `${rep.name} ${rep.apellido}`, value: rep.id };
    });
    return representatives;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
