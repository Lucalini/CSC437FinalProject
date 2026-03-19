const API_BASE = "/api";

function getToken() {
    return localStorage.getItem("token");
}

export function setToken(token) {
    if (token) {
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("token");
    }
}

async function request(path, options = {}) {
    const token = getToken();
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
}

export async function register(username, email, password) {
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
    });
}

export async function login(username, password) {
    return request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
}

export async function fetchMe() {
    return request("/users/me");
}

export async function updateMe(updates) {
    return request("/users/me", {
        method: "PATCH",
        body: JSON.stringify(updates),
    });
}

export async function fetchProducts() {
    return request("/products");
}

export async function fetchProduct(id) {
    return request(`/products/${id}`);
}

export async function fetchReviews(productId) {
    return request(`/reviews/product/${productId}`);
}

export async function createReview(review) {
    return request("/reviews", {
        method: "POST",
        body: JSON.stringify(review),
    });
}

export async function fetchOrders() {
    return request("/orders");
}

export async function createOrder(order) {
    return request("/orders", {
        method: "POST",
        body: JSON.stringify(order),
    });
}
