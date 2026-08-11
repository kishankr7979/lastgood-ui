import api from "../api";

export const getOrganization = async () => {
  const response = await api.get("/organization");
  return response.data.data;
};

export const getOrganizationCount = async () => {
  try {
    const response = await api.get("/organizations/count");
    if (typeof response.data?.count === 'number') return response.data.count;
    if (typeof response.data?.data?.count === 'number') return response.data.data.count;
    if (typeof response.data === 'number') return response.data;
    return response.data?.count || 0;
  } catch (err) {
    // Return null if count endpoint fails so hook can handle fallback or error gracefully
    return null;
  }
};

