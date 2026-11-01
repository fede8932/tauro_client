import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    window.location.href = '/';
  }
  throw error;
};

export const getMeliAuthStatus = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/meli/auth/status`, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getMeliAuthUrl = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/meli/auth/url`, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getMeliConfig = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/meli/config`, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const updateMeliConfig = async (cfg) => {
  try {
    const { data } = await axios.put(`${apiUrl}/api/meli/config`, cfg, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getMeliListings = async (params) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/meli/listings`, {
      params,
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getMeliCatalog = async (params) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/meli/catalog`, {
      params,
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const publishProduct = async (productId, categoryId = null) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/meli/publish/${productId}`,
      { categoryId },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const publishBatchProducts = async (productIds, categoryId = null) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/meli/publish-batch`,
      { productIds, categoryId },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const retryFailedPublications = async () => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/api/meli/publish-batch/retry-failed`,
      {},
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getPublishQueueStatus = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/meli/publish-queue/status`, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const activateProduct = async (productId) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/meli/activate/${productId}`, {}, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const pauseProduct = async (productId) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/meli/pause/${productId}`, {}, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const removeFromMeli = async (productId) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/api/meli/listing/${productId}`, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const discardFailedListing = async (productId) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/api/meli/listing/${productId}/discard`, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const setIncludeSync = async (productId, include) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/meli/include-sync/${productId}`,
      { include },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const setPriceOverride = async (productId, price) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/api/meli/price-override/${productId}`,
      { price },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const syncNow = async (productId) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/meli/sync-now/${productId}`, {}, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const importExistingMeliItems = async () => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/meli/import-existing`, {}, { withCredentials: true });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

// ---------- Excepciones de política de precios ----------

export const getMeliBrandPricing = async (params) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/meli/pricing/brands`, {
      params,
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getMeliBrandPricingItem = async (brandId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/meli/pricing/brands/${brandId}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const updateMeliBrandPricing = async (brandId, values) => {
  try {
    const { data } = await axios.put(`${apiUrl}/api/meli/pricing/brands/${brandId}`, values, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const deleteMeliBrandPricing = async (brandId) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/api/meli/pricing/brands/${brandId}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getMeliProductPricing = async (params) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/meli/pricing/products`, {
      params,
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getMeliProductPricingItem = async (productId) => {
  try {
    const { data } = await axios.get(`${apiUrl}/api/meli/pricing/products/${productId}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const updateMeliProductPricing = async (productId, values) => {
  try {
    const { data } = await axios.put(`${apiUrl}/api/meli/pricing/products/${productId}`, values, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const deleteMeliProductPricing = async (productId) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/api/meli/pricing/products/${productId}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const simulateMeliPricing = async (payload) => {
  try {
    const { data } = await axios.post(`${apiUrl}/api/meli/pricing/simulate`, payload, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};
