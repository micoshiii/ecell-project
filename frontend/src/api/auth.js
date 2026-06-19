import axios from "axios";

const BASE = "http://localhost:3000/api/auth";

export async function register(username, password) {
    const res = await axios.post(`${BASE}/register`, { username, password });
    return res.data;
}

export async function login(username, password) {
    const res = await axios.post(`${BASE}/login`, { username, password });
    return res.data;
}