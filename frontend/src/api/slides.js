import axios from "axios";

const BASE = "http://localhost:3000/api";

function authHeader() {
    const token = localStorage.getItem("token");
    return { token };
}

export async function getAllSlides(params = {}) {
    const res = await axios.get(`${BASE}/slides`, { params });
    return res.data;
}

export async function getSlideById(id) {
    const res = await axios.get(`${BASE}/slides/${id}`);
    return res.data;
}

export async function createSlide(data) {
    const res = await axios.post(`${BASE}/slides`, data, { headers: authHeader() });
    return res.data;
}

export async function updateSlide(id, data) {
    const res = await axios.put(`${BASE}/slides/${id}`, data, { headers: authHeader() });
    return res.data;
}

export async function deleteSlide(id) {
    const res = await axios.delete(`${BASE}/slides/${id}`, { headers: authHeader() });
    return res.data;
}