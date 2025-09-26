import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

let cancelTokenSource = null;

export const createProduct = async (productData) => {
  try {
    // Crear un objeto FormData para enviar los datos del producto y las imágenes
    const formData = new FormData();
    // Agregar los datos del producto
    formData.append('article', productData.code);
    formData.append('description', productData.name);
    formData.append('price', productData.listPrice);

    // Agregar las imágenes al FormData
    console.log(formData)
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((file, index) => {
        formData.append(`images`, file);
      });
    }

    // Enviar la solicitud POST con los datos del producto y las imágenes
    await axios.post(
      `${apiUrl}/api/productos?brandId=${productData.brandId}&location=${productData.location}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );
    return 'Registrado';
  } catch (error) {
    if (error.response?.status == 401) {
      // console.log(error);
      window.location.href = '/';
    }
    throw error;
  }
};

export const addProductsFile = async (sendData) => {
  try {
    const { file, check } = sendData;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('check', JSON.stringify(check));
    const { data } = await axios.post(
      `${apiUrl}/api/productos/file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          withCredentials: true,
        },
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

export const searchProduct = async (productData) => {
  try {
    const products = await axios.get(
      `${apiUrl}/api/productos/search?data=${productData.dataSearch}&supplierId=${productData.supplierId}`,
      { withCredentials: true }
    );
    return products.data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const searchProducts = async (productData) => {
  try {
    const { page, text, equivalenceId } = productData;
    let url = text
      ? `${apiUrl}/api/productos?rows=100&page=${page}&data=${text}`
      : `${apiUrl}/api/productos?rows=100&page=${page}`;
    url = equivalenceId ? url + `&equivalenceId=${equivalenceId}` : url;
    const products = await axios.get(url, { withCredentials: true });
    return products.data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const searchExtraProducts = async (productData) => {
  try {
    // Cancelar la solicitud anterior si existe
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Cancelando la solicitud anterior.');
    }

    // Crear un nuevo token de cancelación
    cancelTokenSource = axios.CancelToken.source();

    const url = `${apiUrl}/api/productos/search`;
    const response = await axios.post(url, productData, {
      withCredentials: true,
      cancelToken: cancelTokenSource.token, // Asociar el token de cancelación
    });

    // Restablecer el token después de una solicitud exitosa
    cancelTokenSource = null;

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Solicitud cancelada:', error.message);
    } else if (error.response?.status === 401) {
      window.location.href = '/';
    }
    // Restablecer el token en caso de error
    cancelTokenSource = null;
    throw error;
  }
};
export const searchProductPage = async (productData) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/productos/search/prod?data=${productData.dataSearch}&cant=${productData.cant}&page=${productData.page}`,
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
export const searchOneProduct = async (productData) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/productos/search/prod?data=${productData.dataSearch}&cant=${productData.cant}&page=${productData.page}`,
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
export const updateStock = async (productData) => {
  try {
    const { items, controlOrderId } = productData;
    const newItems = items.map((item) => {
      const newItem = {
        productId: item.productId,
        brandId: item.brandId,
        amount: item.amount,
      };
      return newItem;
    });
    const { data } = await axios.put(
      `${apiUrl}/api/productos/update/stock/add`,
      { items: newItems, controlOrderId: controlOrderId },
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

export const deleteProduct = async (productId) => {
  try {
    const { data } = await axios.delete(
      `${apiUrl}/api/productos/${productId}`,
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

export const updateProduct = async (update) => {
  try {
    const { productId, updateData } = update;
    const { images, ...rest } = updateData;
    const formData = new FormData();

    // Agregar los datos del producto
    for (let prop in rest) {
      if (rest[prop] !== null && rest[prop] !== undefined) {
        formData.append(prop, rest[prop]);
      }
    }
    // Agregar las imágenes al FormData
    if (images?.length > 0) {
      images.forEach((file, index) => {
        formData.append(`images`, file);
      });
    }

    // Enviar la solicitud PATCH con los datos del producto y las imágenes
    const { data } = await axios.patch(
      `${apiUrl}/api/productos/${productId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

export const getProductId = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/productos/detail/${id}`, {
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

export const getAllProduct = async () => {
  try {
    const products = await axios.get(`${apiUrl}/api/productos/pr`, {
      withCredentials: true,
    });
    return products.data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getFileProducts = async (filterProducts) => {
  try {
    // console.log(clientId);
    const res = await axios.post(
      `${apiUrl}/api/productos/all/admin`,
      filterProducts,
      {
        withCredentials: true,
        responseType: 'blob', // Configura el tipo de respuesta esperado como 'blob'
      }
    );
    return res;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
