import { getToken } from "./auth";

const BASE_URL = "/api/it-path/admin/users";

const getHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

const handleResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = { message: await response.text() };
    }

    if (!response.ok) {
        throw new Error(data.message || "Request failed");
    }
    return data.data; // Backend returns { code, message, data }
};

export const getAllUsers = async () => {
    const response = await fetch(`${BASE_URL}`, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const updateUser = async (id, userData) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const deleteUser = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });
    // Delete might not return data in the same format or might be void
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Delete failed" }));
        throw new Error(error.message);
    }
    return true;
};

export const blockUser = async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/status`, {
        method: "POST",
        headers: getHeaders(),
    });
    return handleResponse(response);
};
