import { getToken } from "./auth";

const BASE_URL = "/api/it-path/auth";

const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (response) => {
    // Try to parse JSON, if fails text
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = { message: await response.text() };
    }

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }
    return data;
};

export const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
};

export const register = async (username, email, password) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
};

export const requestResetPassword = async (email) => {
    const response = await fetch(`${BASE_URL}/reset-password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    return handleResponse(response);
};

export const confirmResetPassword = async (token, newPassword) => {
    const response = await fetch(`${BASE_URL}/reset-password/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
    });
    return handleResponse(response);
};

export const verifyEmail = async (token) => {
    const response = await fetch(`${BASE_URL}/verify-email?token=${token}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    return handleResponse(response);
};
