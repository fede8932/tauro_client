import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const suplierRegister = async (datos) => {
  try {
    const { repComent, repPhone, repEmail, lastName, name, ...dataSup } = datos;
    dataSup.altura = Number(dataSup.altura);
    dataSup.codigoPostal = Number(dataSup.codigoPostal);
    dataSup.codigoPostal = Number(dataSup.codigoPostal);
    dataSup.descuento = parseFloat(dataSup.descuento);
    const { data } = await axios.post(`${apiUrl}/api/supplier`, dataSup, {
      withCredentials: true,
    });
    const dataRep = {
      supplierId: data,
      name: name,
      apellido: lastName,
      email: repEmail,
      telefono: repPhone,
      comentarios: repComent,
    };
    await axios.post(`${apiUrl}/api/representative`, dataRep, {
      withCredentials: true,
    });
    return 'ok';
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getSuppliers = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/supplier`, {
      withCredentials: true,
    });
    const arraySupplier = data.map((supplier) => {
      return { text: supplier.razonSocial, value: supplier.id };
    });
    return arraySupplier;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getSuppliersInfo = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/supplier`, {
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

export const getInfoSuppliers = async (razonSocial) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/supplier/supplier?id=${razonSocial}`,
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

export const getSuppliersByData = async (searchData) => {
  try {
    const { text, page, pageSize, orderByColumn } = searchData;
    const { data } = await axios.get(
      `${apiUrl}/api/supplier/data?text=${text}&page=${page}&pageSize=${pageSize}&orderByColumn=${orderByColumn}`,
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

export const updateSupplierStatusRequest = async (id) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/supplier/update/status/${id}`,
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

export const updateSupplierRequest = async (dataEdit) => {
  try {
    const { id, ...sendInfo } = dataEdit;
    const { data } = await axios.put(
      `${apiUrl}/api/supplier/update/${id}`,
      sendInfo,
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

export const addRepresentativeRequest = async (dataRepresentative) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/representative`,
      dataRepresentative,
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

export const deleteRepSupplierRequest = async (id) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/representative/delete/${id}`,
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

export const updateRepSupplierRequest = async (newData) => {
  const { id, ...updateData } = newData;
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/representative/update/${id}`,
      updateData,
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

export const getControlOrder = async (filterData) => {
  try {
    const { order, rows, page } = filterData;
    const { data } = await axios.get(
      `${apiUrl}/api/supplier/picking?order=${order}&rows=${rows}&page=${page}`,
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

export const selectControlOrder = async (id) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/supplier/picking/select?id=${id}`,
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

export const selectControlOrderItems = async (data) => {
  const { id } = data;
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/supplier/picking/select/order?id=${id}`,
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

export const updateItems = async (data) => {
  try {
    data.amount = Number(data.amount);
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const updateControlOrderStatus = async (id) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/order/control?id=${id}`,
      null,
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
