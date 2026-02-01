import { getToken } from "./auth";

const BASE_URL = "/api/it-path/admin/dashboard";

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

export const getDashboardStats = async () => {
    const response = await fetch(`${BASE_URL}/get-stats`, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const getChartData = async () => {
    const response = await fetch(`${BASE_URL}/get-chart`, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const getRecentPostings = async () => {
    const response = await fetch(`${BASE_URL}/get-recent`, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
};
