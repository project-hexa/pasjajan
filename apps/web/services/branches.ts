import { api } from "@/lib/utils/axios";

export const getBranches = async () => {
  const response = await api.get("/branches");
  return response.data;
};

export const getBranch = async (id: string | number) => {
  const response = await api.get(`/branches/${id}`);
  return response.data;
};

export const createBranch = async (payload: {
  code: string;
  name: string;
  address: string;
  phone_number: string;
  status?: "Active" | "Inactive";
  is_active?: boolean;
}) => {
  const response = await api.post("/branches", payload);
  return response;
};

export const updateBranch = async (
  id: string | number,
  payload: {
    code: string;
    name: string;
    address: string;
    phone_number: string;
    is_active?: boolean;
  },
) => {
  const response = await api.put(`/branches/${id}`, payload);
  return response;
};

export const toggleBranch = async (
  id: string | number,
  active: boolean,
) => {
  const endpoint = `/branches/${id}/${active ? "activate" : "deactivate"}`;
  const response = await api.patch(endpoint);
  return response;
};
