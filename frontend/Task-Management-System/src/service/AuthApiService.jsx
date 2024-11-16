import axios from "axios";

// Axios client for auth-related calls
const authApiClient = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
});

// Helper to format login credentials
const loginCredentials = (username, password) => ({ username, password });

// API call for registration
export const registerApi = (user) => authApiClient.post('/register', user);

// Updated API call for login
export const loginApi = async (username, password) => {
  try {
    const response = await authApiClient.post('/authenticate', loginCredentials(username, password));
    const { data } = response.data;
    
    // Save logged-in user details and JWT token
    saveLoggedUser(data.userId, data.username, data.role, data.token);

    return response.data; // Return the whole response if needed
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

// Function to save user details and token in session storage
export const saveLoggedUser = (userId, username, role, token) => {
  sessionStorage.setItem('activeUserId', userId);
  sessionStorage.setItem('authenticatedUser', username);
  sessionStorage.setItem('role', role);
  sessionStorage.setItem('jwtToken', token); // Save the JWT token
};

// Function to get JWT token from session storage  
export const getJwtToken = () => sessionStorage.getItem('jwtToken');

// Check if a user is logged in
export const isUserLoggedIn = () => !!sessionStorage.getItem('authenticatedUser');

// Get logged-in user's ID and username
export const getLoggedInUserId = () => sessionStorage.getItem('activeUserId');
export const getLoggedInUser = () => sessionStorage.getItem('authenticatedUser');

// Check if the logged-in user is an admin
export const isAdminUser = () => sessionStorage.getItem('role') === 'ROLE_ADMIN';

// Logout: Clear session storage
export const logout = () => {
  sessionStorage.clear();
};

// Local storage methods for user ID
export const saveUserIdToLocalStorage = (userId) => {
  localStorage.setItem('userId', userId);
};

export const getUserIdFromLocalStorage = () => localStorage.getItem('userId');

export const clearUserIdFromLocalStorage = () => {
  localStorage.removeItem('userId');
};

// Example usage for handling login
export const handleLogin = (userId, token) => {
  saveUserIdToLocalStorage(userId);
  sessionStorage.setItem('jwtToken', token); // Store the JWT token
};
