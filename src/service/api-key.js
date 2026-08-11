import api from "../api";

export const getAPIKeyByOrg = async (id) => {
  try {
    const response = await api.get(`/api-keys/${id}`);
    return response.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

export const createAPIKey = async (name) => {
  const response = await api.post(`/api-keys/create`, {
    name,
  });

  return response.data.data;
};
