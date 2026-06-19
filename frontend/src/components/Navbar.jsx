import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-[#0f0f0f] border-b border-[#222] sticky top-0 z-50">
            <Link to="/" className="no-underline">
                <span className="text-[22px] font-bold text-white tracking-tight">
                    Slide<span className="text-[#6c63ff]">Vault</span>
                </span>
            </Link>

            <div className="flex gap-3 items-center">
                {token ? (
                    <>
                        <Link to="/upload">
                            <button className="bg-[#6c63ff] text-white border-none px-[18px] py-2 rounded-lg cursor-pointer font-semibold text-sm hover:bg-[#5a52e0] transition-colors">
                                + Upload
                            </button>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-[#333] text-white border-none px-[18px] py-2 rounded-lg cursor-pointer font-semibold text-sm hover:bg-[#444] transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="bg-[#333] text-white border-none px-[18px] py-2 rounded-lg cursor-pointer font-semibold text-sm hover:bg-[#444] transition-colors">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="bg-[#6c63ff] text-white border-none px-[18px] py-2 rounded-lg cursor-pointer font-semibold text-sm hover:bg-[#5a52e0] transition-colors">
                                Register
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}