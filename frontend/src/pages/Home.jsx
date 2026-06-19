import { useState, useEffect } from "react";
import { getAllSlides } from "../api/slides";
import SlideCard from "../components/SlideCard";

export default function Home() {
    const [slides, setSlides] = useState([]);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    async function fetchSlides() {
        setLoading(true);
        try {
            const data = await getAllSlides({ page, limit: 9, search, tags, sortBy, order });
            setSlides(data.slides);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchSlides();
    }, [page, sortBy, order]);

    function handleSearch(e) {
        e.preventDefault();
        setPage(1);
        fetchSlides();
    }

    function handleDelete(id) {
        setSlides(prev => prev.filter(s => s._id !== id));
    }

    return (
        <div className="min-h-[calc(100svh-65px)] bg-[#0f0f0f] px-6 py-10">
            <div className="max-w-[1100px] mx-auto">

                <div className="mb-8">
                    <h1 className="text-white text-[32px] font-extrabold m-0 mb-2">
                        The Gallery
                    </h1>
                    <p className="text-[#555] text-[15px] m-0">
                        Browse case competition slides from across the community
                    </p>
                </div>

                <div className="flex gap-3 flex-wrap mb-8">
                    <input
                        placeholder="Search slides..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSearch(e)}
                        className="flex-1 min-w-[200px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#6c63ff] placeholder:text-[#444]"
                    />
                    <input
                        placeholder="Filter by tags (e.g. finance)"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSearch(e)}
                        className="w-[220px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-[#6c63ff] placeholder:text-[#444]"
                    />
                    <select
                        value={sortBy}
                        onChange={e => { setSortBy(e.target.value); setPage(1); }}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none cursor-pointer"
                    >
                        <option value="createdAt">Newest</option>
                        <option value="title">Title A–Z</option>
                    </select>
                    <select
                        value={order}
                        onChange={e => { setOrder(e.target.value); setPage(1); }}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 text-white text-sm outline-none cursor-pointer"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                    <button
                        onClick={handleSearch}
                        className="bg-[#6c63ff] text-white border-none rounded-lg px-5 py-2.5 font-semibold cursor-pointer text-sm hover:bg-[#5a52e0] transition-colors"
                    >
                        Search
                    </button>
                </div>

                {loading ? (
                    <p className="text-[#555] text-center py-16">Loading slides...</p>
                ) : slides.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-[#444] text-base">No slides found.</p>
                        <p className="text-[#333] text-sm">Try a different search or upload the first one.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
                        {slides.map(slide => (
                            <SlideCard key={slide._id} slide={slide} onDelete={handleDelete} />
                        ))}
                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="bg-[#1a1a1a] disabled:bg-[#111] text-white disabled:text-[#333] border border-[#2a2a2a] rounded-lg px-4 py-2 cursor-pointer disabled:cursor-not-allowed text-sm"
                        >
                            ← Prev
                        </button>
                        <span className="text-[#555] px-3 py-2 text-sm">
                            Page {page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                            disabled={page === pagination.totalPages}
                            className="bg-[#1a1a1a] disabled:bg-[#111] text-white disabled:text-[#333] border border-[#2a2a2a] rounded-lg px-4 py-2 cursor-pointer disabled:cursor-not-allowed text-sm"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}