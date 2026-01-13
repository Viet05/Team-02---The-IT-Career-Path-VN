// Save session data (token + role) to localStorage
export const saveSession = ({ token, role }) => {
  localStorage.setItem("access_token", token);
  localStorage.setItem("role", role);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("access_token");
};

// Get role from localStorage
export const getRole = () => {
  return localStorage.getItem("role");
};

// Logout: clear localStorage
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
};
