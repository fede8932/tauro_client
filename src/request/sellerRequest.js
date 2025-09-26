import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const getSellers = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/seller`, {
      withCredentials: true,
    });
    let ans = [];
    const arraySeller = data.map((seller) => {
      if (seller.user.roleId === 3) {
        const sel = {
          text: `${seller.user.name} ${seller.user.lastName}`,
          value: seller.id,
        };
        ans.push(sel);
      }
    });
    return ans;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const getSellerResume = async (info) => {
  try {
    // console.log(info);
    const { id, pageSize, page, pending } = info;
    const url = pending
      ? `${apiUrl}/api/seller/resume/${id}?pageSize=${pageSize}&page=${page}&pending=${pending}`
      : `${apiUrl}/api/seller/resume/${id}?pageSize=${pageSize}&page=${page}`;
    const { data } = await axios.get(url, { withCredentials: true });
    return data;
  } catch (error) {
    console.log(error);
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const getSellerLiquidation = async (info) => {
  try {
    const { sellerId, pageSize, page } = info;
    const { data } = await axios.get(
      `${apiUrl}/api/liquidations?sellerId=${sellerId}&pageSize=${pageSize}&page=${page}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.log(error);
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const getResumeLiquidation = async (info) => {
  try {
    const { liqId } = info;
    const { data } = await axios.get(
      `${apiUrl}/api/liquidations/resume/${liqId}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.log(error);
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const createSellers = async (objData) => {
  try {
    const { name, lastName, email, ...dataSeller } = objData;
    const dataUser = {
      name: name,
      lastName: lastName,
      email: email,
      password: `${lastName}1234`,
      roleId: 3,
    };
    const { data } = await axios.post(`${apiUrl}/api/users`, dataUser, {
      withCredentials: true,
    });
    dataSeller.userId = data;
    dataSeller.altura = Number(dataSeller.altura);
    dataSeller.codigoPostal = Number(dataSeller.codigoPostal);
    dataSeller.comisionBase = parseFloat(dataSeller.comisionBase) / 100;
    dataSeller.comisionOferta = parseFloat(dataSeller.comisionOferta) / 100;

    await axios.post(`${apiUrl}/api/seller`, dataSeller, {
      withCredentials: true,
    });
    return 'Registrado';
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getSellersByText = async (dataSearch) => {
  try {
    const { text, by, page, pageSize, orderByColumn, active } = dataSearch;
    let url = `${apiUrl}/api/seller/data?text=${text}&by=${by}&page=${page}&pageSize=${pageSize}&orderByColumn=${orderByColumn}`;
    if (typeof active !== 'undefined') {
      url += `&active=${active}`;
    }
    const { data } = await axios.get(url, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getSellerId = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/seller/search/${id}`, {
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

export const updateSellerById = async (dataUpdate) => {
  try {
    const { id, ...infoUpdate } = dataUpdate;
    const { data } = await axios.put(
      `${apiUrl}/api/seller/update/${id}`,
      infoUpdate,
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

export const createLiquidationRequest = async (sendInfo) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/liquidations`, sendInfo, {
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

export const getClientsId = async (id) => {
  try {
    const api_url = id ? `${apiUrl}/api/seller/get/clients/${id}` : `${apiUrl}/api/seller/get/clients/0`
    const response = await axios.get(api_url, {
      withCredentials: true,
      responseType: 'blob', // Importante: Configura la respuesta como blob para archivos
    });

    // Crear una URL para el archivo descargado
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Crear un enlace para descargar el archivo
    const link = document.createElement('a');
    link.href = url;

    // Configurar el nombre del archivo (puedes personalizar esto según sea necesario)
    link.setAttribute('download', `clients_${id}.xlsx`);
    document.body.appendChild(link);
    link.click();

    // Limpiar el enlace después de su uso
    link.parentNode.removeChild(link);

    return true; // Indica éxito
  } catch (error) {
    if (error.response?.status === 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getClientsMovements = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/movement/pending/clients`, {
      withCredentials: true,
      responseType: 'blob', // Importante: Configura la respuesta como blob para archivos
    });

    // Crear una URL para el archivo descargado
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Crear un enlace para descargar el archivo
    const link = document.createElement('a');
    link.href = url;

    // Configurar el nombre del archivo (puedes personalizar esto según sea necesario)
    link.setAttribute('download', `client_movements.xlsx`);
    document.body.appendChild(link);
    link.click();

    // Limpiar el enlace después de su uso
    link.parentNode.removeChild(link);

    return true; // Indica éxito
  } catch (error) {
    if (error.response?.status === 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
