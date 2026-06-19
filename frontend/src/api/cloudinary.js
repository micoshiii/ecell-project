import axios from "axios";

const BASE = "http://localhost:3000/api";

function authHeader() {
    const token = localStorage.getItem("token");
    return { token };
}

async function getSignature(folder = "slides", resourceType = "raw") {
    const res = await axios.post(`${BASE}/sign-url`, { folder, resourceType }, { headers: authHeader() });
    return res.data;
}

// For PDFs and PPTX files
export async function uploadToCloudinary(file, folder = "slides") {
    const { signature, timestamp, cloudName, apiKey } = await getSignature(folder, "image");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
    );
    return res.data.secure_url;
}

// For preview images
export async function uploadImageToCloudinary(file, folder = "previews") {
    const { signature, timestamp, cloudName, apiKey } = await getSignature(folder, "image");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
    );
    return res.data.secure_url;
}