import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const createUser = async (objData) => {
  try {
    const { name, lastName, email, rolId, ...dataOther } = objData;
    const dataUser = {
      name: name,
      lastName: lastName,
      email: email,
      password: `${lastName}1234`,
      roleId: rolId,
    };
    const { data } = await axios.post(`${apiUrl}/api/users`, dataUser, {
      withCredentials: true,
    });
    dataOther.userId = data;
    dataOther.altura = Number(dataOther.altura);
    dataOther.codigoPostal = Number(dataOther.codigoPostal);

    await axios.post(`${apiUrl}/api/seller`, dataOther);
    return 'Registrado';
  } catch (error) {
    if (error.response?.status == 401) {
      window.location.href = '/';
    }
    throw error;
  }
};
