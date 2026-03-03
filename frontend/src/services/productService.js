import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/products`;

// 🟢 ADD PRODUCT
export const addProduct = (data) => {
  
  return axios.post(`${API}/add`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 🟢 GET VENDOR PRODUCTS
export const getVendorProducts = (vendorId) => {
  return axios.get(`${API}/vendor/${vendorId}`);
};

// 🔴 DELETE PRODUCT
export const deleteProduct = (id) => {
  return axios.delete(`${API}/${id}`);
};

// 🟡 UPDATE PRODUCT
export const updateProduct = (id, data) =>
  axios.put(`${API}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });