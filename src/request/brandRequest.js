import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const createBrand = async (brandData) => {
  const { supplierName } = brandData; //supplierName es el id
  try {
    const brandDate = {
      name: brandData.name,
      code: brandData.code,
      rentabilidad: brandData.renta / 100,
      seFactura: brandData.seFactura == 'true' ? true : false,
    };
    await axios.post(
      `${apiUrl}/api/brand?supplierId=${Number(supplierName)}`,
      brandDate,
      { withCredentials: true }
    );
    return 'Registrado';
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const getBrands = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/brand`, {
      withCredentials: true,
    });
    const brands = data.map((brand) => {
      return { text: brand.name, value: brand.id };
    });
    return brands;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const getBrandsByData = async (text) => {
  try {
    const url = text
      ? `${apiUrl}/api/brand/search?data=${text}`
      : `${apiUrl}/api/brand/search`;
    const { data } = await axios.get(url, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const searchBrandsExtra = async (filters) => {
  try {
    const url = `${apiUrl}/api/brand/search/extra`;
    const { data } = await axios.post(url, filters, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const toggleEcommerce = async (id) => {
  try {
    const url = `${apiUrl}/api/brand/toggle/ecommerce/${id}`;
    const { data } = await axios.patch(url, null, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const getBrandsBySupplier = async (supplierId) => {
  try {
    console.log(supplierId);
    const { data } = await axios.get(
      `${apiUrl}/api/brand/search/supplier?supplierId=${supplierId}`,
      { withCredentials: true }
    );
    const brands = data.map((brand) => {
      return { text: brand.name, value: brand.id };
    });
    return brands;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const addSupplierToBrand = async (infoBS) => {
  try {
    const { brandId, ...listSupplierId } = infoBS;
    const { data } = await axios.post(
      `${apiUrl}/api/brand/add/proveedor?brandId=${brandId}`,
      listSupplierId,
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
export const deleteSupplierToBrand = async (infoBS) => {
  try {
    const { brandId, supplierId } = infoBS;
    const { data } = await axios.delete(
      `${apiUrl}/api/brand/delete/proveedor?brandId=${brandId}&supplierId=${supplierId}`,
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
export const updateBrand = async (info) => {
  try {
    const { brandId, ...sendData } = info;
    sendData.rentabilidad = Number(sendData.rentabilidad) / 100;
    sendData.seFactura = sendData.seFactura == 'true' ? true : false;
    console.log(sendData);
    const { data } = await axios.put(
      `${apiUrl}/api/brand/update/${brandId}`,
      sendData,
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
export const addBrandToTable = async (datos) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/discounts`, datos, {
      withCredentials: true,
    });
    return data.customerDiscounts;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
export const delBrandToTable = async (ids) => {
  try {
    const { brandId, clientId } = ids;
    const { data } = await axios.delete(
      `${apiUrl}/api/discounts/${brandId}/${clientId}`,
      { withCredentials: true }
    );
    return data.customerDiscounts;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const resetBrandToTable = async () => {
  return [];
};

export const getAllBrandToTable = async (clientId) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/api/discounts?clientId=${clientId}`,
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

export const getBrandById = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/brand/get/unique/${id}`, {
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
