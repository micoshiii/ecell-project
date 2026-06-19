import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin() {
        if (!username || !password) return setError("Fill in both fields");
        setLoading(true);
        setError("");
        try {
            const data = await login(username, password);
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
        setLoading(false);
    }

    return (
        <div className="min-h-[calc(100svh-65px)] bg-[#0f0f0f] flex items-center justify-center px-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-10 w-full max-w-[400px]">
                <h2 className="text-white mb-1.5 text-2xl font-bold">Welcome back</h2>
                <p className="text-[#666] mb-7 text-sm">
                    Log in to upload and manage slides
                </p>

                {error && <p className="text-[#ff4444] mb-4 text-sm">{error}</p>}

                <input
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3.5 py-3 text-white text-sm mb-3.5 outline-none focus:border-[#6c63ff] placeholder:text-[#444]"
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3.5 py-3 text-white text-sm mb-3.5 outline-none focus:border-[#6c63ff] placeholder:text-[#444]"
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-[#6c63ff] text-white border-none rounded-lg py-3.5 font-bold text-[15px] cursor-pointer mt-1 hover:bg-[#5a52e0] transition-colors disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Log in"}
                </button>

                <p className="text-[#555] text-[13px] mt-5 text-center">
                    No account? <Link to="/register" className="text-[#6c63ff] hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}