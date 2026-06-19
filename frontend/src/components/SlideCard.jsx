import { useNavigate } from "react-router-dom";
import { deleteSlide } from "../api/slides";

export default function SlideCard({ slide, onDelete }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    async function handleDelete(e) {
        e.stopPropagation();
        if (!window.confirm("Delete this slide?")) return;
        await deleteSlide(slide._id);
        onDelete(slide._id);
    }

    return (
        <div
            onClick={() => navigate(`/slides/${slide._id}`)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[#6c63ff]"
        >
            <div className="w-full h-[180px] bg-[#111] overflow-hidden">
                {slide.previewImage ? (
                    <img
                        src={slide.previewImage}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#444] text-sm">
                        No preview
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex gap-1.5 flex-wrap mb-2">
                    {slide.tags?.map(tag => (
                        <span
                            key={tag}
                            className="bg-[#6c63ff22] text-[#6c63ff] text-[11px] px-2 py-0.5 rounded-full font-semibold"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="text-white m-0 mb-1.5 text-[15px] font-bold">
                    {slide.title}
                </h3>
                <p className="text-[#777] text-[13px] m-0 mb-3 leading-relaxed">
                    {slide.description?.slice(0, 80)}{slide.description?.length > 80 ? "..." : ""}
                </p>

                <div className="flex justify-between items-center">
                    <span className="text-[#555] text-xs">
                        {new Date(slide.createdAt).toLocaleDateString()}
                    </span>
                    {token && (
                        <button
                            onClick={handleDelete}
                            className="bg-transparent border border-[#ff4444] text-[#ff4444] px-2.5 py-1 rounded-md cursor-pointer text-xs hover:bg-[#ff444422] transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}