import api from "./api";

/**
 * Submits the initial setup data to the backend
 * @param {Object} company - Company info
 * @param {Object} admin - Admin account info
 * @returns Axios Promise
 */
export const submitInitialSetup = (company, admin) => {
  return api.post("/setup", { company, admin });
};

/**
 * Checks if a super admin already exists
 * @returns Promise<{ exists: boolean }>
 */
export const checkSuperAdmin = async () => {
  const res = await api.get("api/setup/check-super-admin");
  return res.data; // { exists: true/false }
};
