import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const getEquivalennceByProductId = async (productId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/equivalences/${productId}`,
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

export const createEquivalence = async (dataEquiv) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/equivalences`, dataEquiv, {
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

export const deleteEquivalence = async (id) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/api/equivalences/${id}`, {
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

export const editDescriptionEquivalence = async (sendData) => {
  try {
    const { id, description } = sendData;
    await axios.put(
      `${apiUrl}/api/equivalences/${id}`,
      {
        description: description,
      },
      { withCredentials: true }
    );
    return description;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const editEquivalence = async (sendData) => {
  try {
    const { id, listId } = sendData;
    const { data } = await axios.patch(
      `${apiUrl}/api/equivalences/${id}`,
      {
        productIds: listId,
      },
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
