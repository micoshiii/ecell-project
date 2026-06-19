import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary, uploadImageToCloudinary } from "../api/cloudinary";
import { createSlide } from "../api/slides";

export default function Upload() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [slideFile, setSlideFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    async function handleUpload() {
        if (!title || !slideFile) return setError("Title and slide file are required");
        setLoading(true);
        setError("");

        try {
            setStatus("Uploading slide to Cloudinary...");
            const slideUrl = await uploadToCloudinary(slideFile, "slides");

            let previewImage = "";
            if (previewFile) {
                setStatus("Uploading preview image...");
                previewImage = await uploadImageToCloudinary(previewFile, "previews");
            }

            setStatus("Saving to database...");
            await createSlide({ title, description, tags, previewImage, slideUrl });

            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed");
        }

        setLoading(false);
        setStatus("");
    }

    return (
        <div className="min-h-[calc(100svh-65px)] bg-[#0f0f0f] px-5 py-10">
            <div className="max-w-[600px] mx-auto">
                <h2 className="text-white mb-1.5 text-2xl font-bold">Upload a slide</h2>
                <p className="text-[#666] mb-8 text-sm">
                    Share your case competition work with the community
                </p>

                {error && <p className="text-[#ff4444] mb-4 text-sm">{error}</p>}
                {status && <p className="text-[#6c63ff] mb-4 text-sm">{status}</p>}

                <label className="block text-[#aaa] text-[13px] font-semibold mb-1.5 uppercase tracking-wide">
                    Slide file (PDF / PPTX)
                </label>
                <input
                    type="file"
                    accept=".pdf,.pptx,.key"
                    onChange={e => setSlideFile(e.target.files[0])}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-white text-sm mb-5 outline-none file:bg-[#6c63ff] file:text-white file:border-none file:rounded-md file:px-3 file:py-1.5 file:mr-3 file:cursor-pointer"
                />

                <label className="block text-[#aaa] text-[13px] font-semibold mb-1.5 uppercase tracking-wide">
                    Preview image (optional)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setPreviewFile(e.target.files[0])}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-white text-sm mb-5 outline-none file:bg-[#6c63ff] file:text-white file:border-none file:rounded-md file:px-3 file:py-1.5 file:mr-3 file:cursor-pointer"
                />

                <label className="block text-[#aaa] text-[13px] font-semibold mb-1.5 uppercase tracking-wide">
                    Title
                </label>
                <input
                    placeholder="e.g. Global Strategy Case 2024"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-white text-sm mb-5 outline-none focus:border-[#6c63ff] placeholder:text-[#444]"
                />

                <label className="block text-[#aaa] text-[13px] font-semibold mb-1.5 uppercase tracking-wide">
                    Description
                </label>
                <textarea
                    placeholder="Brief summary of your case..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-white text-sm mb-5 outline-none focus:border-[#6c63ff] placeholder:text-[#444] resize-y"
                />

                <label className="block text-[#aaa] text-[13px] font-semibold mb-1.5 uppercase tracking-wide">
                    Tags (comma separated)
                </label>
                <input
                    placeholder="e.g. finance, strategy, marketing"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3.5 py-3 text-white text-sm mb-5 outline-none focus:border-[#6c63ff] placeholder:text-[#444]"
                />

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full bg-[#6c63ff] text-white border-none rounded-lg py-3.5 font-bold text-[15px] cursor-pointer mt-2 hover:bg-[#5a52e0] transition-colors disabled:opacity-60"
                >
                    {loading ? status || "Uploading..." : "Publish slide"}
                </button>
            </div>
        </div>
    );
}