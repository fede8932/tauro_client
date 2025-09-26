import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

let cancelToken;

export const getCurrentAcount = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/movement/acount/${id}`, {
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

export const normalizeResumeRequest = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/movement/normalize/${id}`, {
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

export const getMovementsRequest = async (sendData) => {
  // console.log(sendData);
  try {
    const { currentAcountId, rows, page, filterCheck, pendingFilter } =
      sendData;
    let url =
      rows && page
        ? `${apiUrl}/api/movement/get/${currentAcountId}?rows=${rows}&page=${page}`
        : `${apiUrl}/api/movement/get/${currentAcountId}`;
    url = pendingFilter ? `${url}&pending=${pendingFilter}` : url;
    let { data } = await axios.post(url, filterCheck, {
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

export const getMovementsExtraRequest = async (sendData) => {
  // console.log(sendData);

  if (cancelToken) {
    cancelToken.cancel('Operation canceled due to new request.');
  }
  // Crear un nuevo token de cancelación para la solicitud actual
  cancelToken = axios.CancelToken.source();

  try {
    const { currentAcountId, ...filters } = sendData;
    if (currentAcountId) {
      let url = `${apiUrl}/api/movement/extra/get/${currentAcountId}`;
      let { data } = await axios.post(url, filters, {
        withCredentials: true,
        cancelToken: cancelToken.token,
      });

      return data;
    }
    return { totalRows: 0, totalPages: 1, list: [] };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      if (error.response?.status === 401) {
        window.location.href = '/';
      }
      throw error;
    }
  }
};

export const newMovementsRequest = async (sendData) => {
  try {
    const { currentAcountId, type, typeFact, movement, orderNumber } = sendData;
    const url = orderNumber
      ? `${apiUrl}/api/movement/pay?currentAcountId=${currentAcountId}&type=${type}&tipo_de_factura=${typeFact}&orderNumber=${orderNumber}`
      : `${apiUrl}/api/movement/pay?currentAcountId=${currentAcountId}&type=${type}&tipo_de_factura=${typeFact}`;
    const { data } = await axios.post(url, movement, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const addPayToCurrentAcount = async (sendData) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/movement/new/pay`,
      sendData,
      { withCredentials: true }
    );
    // console.log(data);
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const addCancelToCurrentAcount = async (sendData) => {
  try {
    // console.log(sendData);
    // return;
    const { data } = await axios.post(
      `${apiUrl}/api/movement/new/cancel`,
      sendData,
      { withCredentials: true }
    );
    // console.log(data);
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getPayDetail = async (movId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/movement/get/pay/detail/${movId}`,
      { withCredentials: true }
    );
    // console.log(data);
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
