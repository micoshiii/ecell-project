import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSlideById, updateSlide, deleteSlide } from "../api/slides";

export default function SlideDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [slide, setSlide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchSlide() {
            try {
                const data = await getSlideById(id);
                setSlide(data);
                setTitle(data.title || "");
                setDescription(data.description || "");
                setTags((data.tags || []).join(", "));
            } catch (err) {
                setNotFound(true);
            }
            setLoading(false);
        }
        fetchSlide();
    }, [id]);

    async function handleSave() {
        setSaving(true);
        setError("");
        try {
            const updated = await updateSlide(id, { title, description, tags });
            setSlide(updated);
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || "Could not save changes");
        }
        setSaving(false);
    }

    async function handleDelete() {
        if (!window.confirm("Delete this slide? This can't be undone.")) return;
        await deleteSlide(id);
        navigate("/");
    }

    if (loading) {
        return (
            <div className="min-h-[calc(100svh-65px)] bg-[#0f0f0f] flex items-center justify-center">
                <p className="text-[#555] text-sm">Loading slide...</p>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-[calc(100svh-65px)] bg-[#0f0f0f] flex flex-col items-center justify-center gap-3">
                <p className="text-[#444] text-lg">This slide doesn't exist or was removed.</p>
                <Link to="/" className="text-[#6c63ff] text-sm hover:underline">Back to the Gallery</Link>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100svh-65px)] bg-[#0f0f0f] px-5 py-10">
            <div className="max-w-[700px] mx-auto">
                <Link to="/" className="text-[#6c63ff] text-sm hover:underline">Back to the Gallery</Link>

                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden mt-5">
                    <div className="w-full h-[280px] bg-[#111]">
                        {slide.previewImage ? (
                            <img src={slide.previewImage} alt={slide.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#444] text-sm">
                                No preview
                            </div>
                        )}
                    </div>

                    <div className="p-8">
                        {error && <p className="text-[#ff4444] mb-4 text-sm">{error}</p>}

                        {editing ? (
                            <div>
                                <label className="block text-[#aaa] text-[13px] font-semibold mb-1.5 uppercase tracking-wide">Title</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3.5 py-3 text-white text-sm mb-5 outline-none focus:border-[#6c63ff]"
                                />

                                <label className="block text-[#aaa] text-[13px] font-semibold mb-1.5 uppercase tracking-wide">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3.5 py-3 text-white text-sm mb-5 outline-none focus:border-[#6c63ff] resize-y"
                                />

                                <label className="block text-[#aaa] text-[13px] font-semibold mb-1.5 uppercase tracking-wide">Tags (comma separated)</label>
                                <input
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3.5 py-3 text-white text-sm mb-6 outline-none focus:border-[#6c63ff]"
                                />

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-[#6c63ff] text-white border-none rounded-lg px-5 py-2.5 font-semibold text-sm cursor-pointer hover:bg-[#5a52e0] transition-colors disabled:opacity-60"
                                    >
                                        {saving ? "Saving..." : "Save changes"}
                                    </button>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="bg-[#333] text-white border-none rounded-lg px-5 py-2.5 font-semibold text-sm cursor-pointer hover:bg-[#444] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex gap-1.5 flex-wrap mb-3">
                                    {slide.tags && slide.tags.map((tag) => (
                                        <span key={tag} className="bg-[#6c63ff22] text-[#6c63ff] text-[11px] px-2 py-0.5 rounded-full font-semibold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h1 className="text-white text-2xl font-bold mb-3">{slide.title}</h1>
                                <p className="text-[#999] text-sm leading-relaxed mb-6">{slide.description}</p>
                                <p className="text-[#555] text-xs mb-6">
                                    Uploaded {new Date(slide.createdAt).toLocaleDateString()}
                                </p>

                                <div className="flex gap-3 flex-wrap">
                                    
                                        <a
                                        href={slide.slideUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-[#6c63ff] text-white no-underline rounded-lg px-5 py-2.5 font-semibold text-sm hover:bg-[#5a52e0] transition-colors"
                                    >
                                        Open slide
                                    </a>

                                    {token && (
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="bg-[#333] text-white border-none rounded-lg px-5 py-2.5 font-semibold text-sm cursor-pointer hover:bg-[#444] transition-colors"
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {token && (
                                        <button
                                            onClick={handleDelete}
                                            className="bg-transparent border border-[#ff4444] text-[#ff4444] rounded-lg px-5 py-2.5 font-semibold text-sm cursor-pointer hover:bg-[#ff444422] transition-colors"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}