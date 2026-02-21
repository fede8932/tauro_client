import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const getBillByIdRequest = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/movement/detail/${id}`, {
      withCredentials: true,
    });
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

export const getBillItemsRequest = async (info) => {
  try {
    const { factNumber, currentAcountId, oficial } = info;
    const { data } = await axios.get(
      `${apiUrl}/api/movement/get/bill/items/${factNumber}/${currentAcountId}?oficial=${oficial}`,
      {
        withCredentials: true,
      }
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

export const getBillReportRequest = async (filter) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/movement/get/bill/report`,
      filter,
      {
        withCredentials: true,
        responseType: 'blob',
      }
    );

    // Crea un enlace para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reporte.xlsx'); // Nombre del archivo
    document.body.appendChild(link);
    link.click();

    // Limpia el enlace después de descargar
    link.parentNode.removeChild(link);
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

export const getPayReportRequest = async (filter) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/movement/get/pay/report`,
      filter,
      {
        withCredentials: true,
        responseType: 'blob',
      }
    );

    // Crea un enlace para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reporte.xlsx'); // Nombre del archivo
    document.body.appendChild(link);
    link.click();

    // Limpia el enlace después de descargar
    link.parentNode.removeChild(link);
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

export const genSellOrderByPosRequest = async (sendData) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/purchase/order/gen/pos/sell`,
      sendData,
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

export const getBillsByProductRequest = async (filter) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/movement/bill_by_product`,
      filter,
      {
        withCredentials: true,
      }
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
