import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const sendLoginRequest = async (data) => {
  try {
    const loginUser = await axios.post(`${apiUrl}/api/users/login`, data, {
      withCredentials: true, // incluir cookies en la solicitud
    });
    return loginUser.data;
  } catch (error) {
    throw error;
  }
};
export const updateUserStatusRequest = async (id) => {
  try {
    const { data } = await axios.put(`${apiUrl}/api/users/status/${id}`, null, {
      withCredentials: true, // incluir cookies en la solicitud
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export const resetPassRequest = async (id) => {
  try {
    const { data } = await axios.patch(
      `${apiUrl}/api/users/reset/pass/${id}`,
      null,
      {
        withCredentials: true, // incluir cookies en la solicitud
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendLogoutRequest = async () => {
  try {
    localStorage.removeItem('user');
    return null;
  } catch (error) {
    console.log(err);
    throw error;
  }
};

export const persistUserRequest = async () => {
  try {
    const url = `${apiUrl}/api/users/login/me`;
    const { data } = await axios.get(url, { withCredentials: true });
    // console.log(data);
    return data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('No autorizado: El token es inválido o ha expirado.');
    } else {
      console.log('Error inesperado:', error.message);
    }
    throw error; // Propaga el error si necesitas manejarlo en otro lugar
  }
};

export const searchUserRequest = async (sendInfo) => {
  try {
    const url = `${apiUrl}/api/users/search`;
    const { data } = await axios.post(url, sendInfo, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const changeUserPass = async (sendInfo) => {
  try {
    const url = `${apiUrl}/api/users/login/update/pass`;
    const { data } = await axios.post(url, sendInfo, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};

export const logOutCookiesRequest = async () => {
  try {
    const url = `${apiUrl}/api/users/login/logout`;
    const { data } = await axios.get(url, { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
