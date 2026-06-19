import axios from "axios";

const BASE = "http://localhost:3000/api";

function authHeader() {
    const token = localStorage.getItem("token");
    return { token };
}

export async function getSignature(folder = "slides") {
    const res = await axios.post(`${BASE}/sign-url`, { folder }, { headers: authHeader() });
    return res.data;
}

export async function uploadToCloudinary(file, folder = "slides") {
    const { signature, timestamp, cloudName, apiKey } = await getSignature(folder);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        formData
    );
    return res.data.secure_url;
}