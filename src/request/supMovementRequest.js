import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const searchSupCurrentAcountRequest = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/api/sup/movement/get/${id}`, {
      withCredentials: true, // incluir cookies en la solicitud
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const createSupMovementsRequest = async (sdata) => {
  try {
    const res = await axios.post(`${apiUrl}/api/sup/movement`, sdata, {
      withCredentials: true, // incluir cookies en la solicitud
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const updateSupMovementsRequest = async (sdata) => {
  try {
    const { id, ...sendData } = sdata;
    const res = await axios.patch(
      `${apiUrl}/api/sup/movement/update/movement/${id}`,
      sendData,
      {
        withCredentials: true, // incluir cookies en la solicitud
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const deleteSupMovementsRequest = async (id) => {
  try {
    const res = await axios.delete(`${apiUrl}/api/sup/movement/${id}`, {
      withCredentials: true, // incluir cookies en la solicitud
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const searchSupMovRequest = async (sData) => {
  try {
    const { id, ...filters } = sData;
    const res = await axios.post(
      `${apiUrl}/api/sup/movement/all/${id}`,
      filters,
      {
        withCredentials: true, // incluir cookies en la solicitud
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createPaymentOrderRequest = async (sdata) => {
  try {
    const { id, movementIds, aplicarDescuento, amount, total } = sdata;
    const sendData = {
      movementIds,
      aplicarDescuento,
      amount, // Incluir el monto para pagos parciales
      total // Incluir el flag de total
    };
    const res = await axios.post(
      `${apiUrl}/api/sup/movement/payment/${id}`,
      sendData,
      {
        withCredentials: true, // incluir cookies en la solicitud
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const searchPaymentOrderRequest = async (sdata) => {
  try {
    const { id, ...sendData } = sdata;
    const res = await axios.post(
      `${apiUrl}/api/sup/movement/payment/all/${id}`,
      sendData,
      {
        withCredentials: true, // incluir cookies en la solicitud
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentOrderRequest = async (sdata) => {
  try {
    const { id, ...sendData } = sdata;
    const res = await axios.patch(
      `${apiUrl}/api/sup/movement/payment/${id}`,
      sendData,
      {
        withCredentials: true, // incluir cookies en la solicitud
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deletePaymentOrderRequest = async (id) => {
  try {
    const res = await axios.delete(`${apiUrl}/api/sup/movement/payment/${id}`, {
      withCredentials: true, // incluir cookies en la solicitud
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const printPaymentOrderRequest = async (id) => {
  try {
    const res = await axios.get(
      `${apiUrl}/api/sup/movement/payment/pdf/${id}`,
      {
        withCredentials: true, // incluir cookies en la solicitud
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
