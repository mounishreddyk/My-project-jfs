import axios from 'axios';

const API_URL = '/api/products';

// Create a basic Axios instance
const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getProducts = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

export const addProduct = async (productData) => {
    const response = await api.post(API_URL, productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await api.put(`${API_URL}/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};

export const searchProducts = async (name) => {
    const response = await api.get(`${API_URL}/search`, { params: { name } });
    return response.data;
};

// --- Category API ---
const CATEGORY_API_URL = '/api/categories';

export const getCategories = async () => {
    const response = await api.get(CATEGORY_API_URL);
    return response.data;
};

export const createCategory = async (name) => {
    const response = await api.post(CATEGORY_API_URL, { name });
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`${CATEGORY_API_URL}/${id}`);
    return response.data;
};

// --- Dashboard API ---
const DASHBOARD_API_URL = '/api/dashboard';

export const getDashboardAnalytics = async () => {
    const response = await api.get(DASHBOARD_API_URL);
    return response.data;
};

// --- AI API ---
const AI_API_URL = '/api/ai';

export const queryAI = async (query) => {
    const response = await api.post(`${AI_API_URL}/query`, query, {
        headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
};

// --- Auth API ---
const AUTH_API_URL = '/api/auth';

export const loginUser = async (username, password) => {
    const response = await api.post(`${AUTH_API_URL}/login`, { username, password });
    return response.data;
};

export const registerUser = async (username, password) => {
    const response = await api.post(`${AUTH_API_URL}/register`, { username, password });
    return response.data;
};
