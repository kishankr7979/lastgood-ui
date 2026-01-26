import api from "../api";

export const getAPIKeyByOrg = async (id) => {
  const response = await api.get(`/api-keys/${id}`);
  return response.data.data;
};

export const createAPIKey = async (name) => {
  const response = await api.post(`/api-keys/create`, {
    name,
  });

  return response.data.data;
};
