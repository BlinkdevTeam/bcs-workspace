import api from "./api";

/**
 * Create a new employee
 * @param {Object} employeeData - Employee object matching backend Employee model
 * @returns Axios Promise
 */
export const createEmployee = (employeeData) => {
  return api.post("/employees", employeeData);
};

/**
 * Get all employees
 * @returns Axios Promise
 */
export const getEmployees = () => {
  return api.get("/employees");
};

/**
 * Get a single employee by ID
 * @param {string} id
 * @returns Axios Promise
 */
export const getEmployeeById = (id) => {
  return api.get(`/employees/${id}`);
};

/**
 * Update an employee by ID
 * @param {string} id
 * @param {Object} employeeData
 * @returns Axios Promise
 */
export const updateEmployee = (id, employeeData) => {
  return api.put(`/employees/${id}`, employeeData);
};

/**
 * Delete an employee by ID
 * @param {string} id
 * @returns Axios Promise
 */
export const deleteEmployee = (id) => {
  return api.delete(`/employees/${id}`);
};
