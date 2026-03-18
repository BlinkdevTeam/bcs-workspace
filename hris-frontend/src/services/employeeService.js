import api from "./api";

/**
 * Create a new employee
 * @param {Object} employeeData - Employee object matching backend Employee model
 * @returns {Promise} Axios Promise
 */
export const createEmployee = (employeeData) => {
  return api.post("/employees", employeeData);
};

/**
 * Get all employees
 * @returns {Promise} Axios Promise
 */
export const getEmployees = () => {
  return api.get("/employees");
};

/**
 * Get a single employee by ID
 * @param {string} id - Employee UUID
 * @returns {Promise} Axios Promise
 */
export const getEmployeeById = (id) => {
  return api.get(`/employees/${id}`);
};

/**
 * Update an employee by ID
 * @param {string} id - Employee UUID
 * @param {Object} employeeData - Fields to update (first_name, last_name, role_title, department_id, status, etc.)
 * @returns {Promise} Axios Promise
 */
export const updateEmployee = (id, employeeData) => {
  return api.put(`/employees/${id}`, employeeData);
};

/**
 * Delete an employee by ID
 * @param {string} id - Employee UUID
 * @returns {Promise} Axios Promise
 */
export const deleteEmployee = (id) => {
  return api.delete(`/employees/${id}`);
};
