import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const addOrderAjust = async (orderId) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/order/ajust/${orderId}`,
      null,
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
export const getOrderAjust = async (orderId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/order/ajust/${orderId}`, {
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
export const getAjustOrder = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/order/ajust/id/${id}`, {
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
export const deleteOrderAjust = async (orderId) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/api/order/ajust/${orderId}`);
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const addOrderAjustItem = async (obj) => {
  try {
    const { orderId, productId, brandId, cantidad } = obj;
    const productsInAjust = await axios.get(
      `${apiUrl}/api/order/ajust/items/${orderId}`,
      { withCredentials: true }
    );
    const rep = productsInAjust.data.map((item) => {
      if (item.productId == productId && item.brandId == brandId) {
        return true;
      } else {
        return false;
      }
    });
    if (rep.includes(true)) {
      throw new Error('El producto ya esta en el listado');
    } else {
      const { data } = await axios.post(
        `${apiUrl}/api/order/ajust/items/${orderId}?productId=${productId}&brandId=${brandId}&cantidad=${cantidad}`,
        null,
        { withCredentials: true }
      );
      return data;
    }
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const deleteAjustItem = async (item) => {
  try {
    const { orderItemId } = item;
    const { data } = await axios.delete(
      `${apiUrl}/api/order/ajust/items/${orderItemId}`,
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
export const updateCantAjustItem = async (dataItem) => {
  try {
    const { id, editCamp } = dataItem;
    const { data } = await axios.put(
      `${apiUrl}/api/order/ajust/items/${id}?cantidad=${editCamp}`,
      null,
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
export const updatePriceAjustItem = async (dataItem) => {
  try {
    const { id, editCamp } = dataItem;
    const { data } = await axios.put(
      `${apiUrl}/api/order/ajust/items/price/${id}?price=${editCamp}`,
      null,
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
export const updateStatusAjust = async (ajust) => {
  const { id, status } = ajust;
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/order/ajust/${id}?status=${status}`,
      null,
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
