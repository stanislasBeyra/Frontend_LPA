import axiosInstance from "./ApiConfig";

export const postResource = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la requête POST:', error);
    throw error;
  }
};


export const getResource = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    console.error('Erreur lors de la requête GET:', error);
    throw error;
  }
};


export const deleteResource = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response;
  } catch (error) {
    console.error('Erreur lors de la requête DELETE:', error);
    throw error;
  }
};
