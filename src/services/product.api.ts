import api from "./axios";

export const getProductsApi = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string; // 🔥 ADD THIS
}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

// 🔥 GET SINGLE PRODUCT
export const getSingleProductApi = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// 🔥 GET MY PRODUCTS (ADMIN)
export const getMyProductsApi = async () => {
  const res = await api.get("/products/my");
  return res.data;
};

// 🔥 CREATE PRODUCT
export const createProductApi = async (formData: FormData) => {
  const res = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 🔥 UPDATE PRODUCT
export const updateProductApi = (id: string, data: any) => {
  return api.patch(`/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data", // 🔥 MUST
    },
  });
};
// 🔥 DELETE PRODUCT
export const deleteProductApi = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
