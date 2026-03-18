import api from "./api";

// GET all departments
export const getDepartments = () => api.get("/api/departments");

// CREATE new department
export const createDepartment = (data) => api.post("/api/departments", data);

// ✅ ADD THIS
export const updateDepartment = (id, data) => {
  return api.put(`/api/departments/${id}`, data);
};
