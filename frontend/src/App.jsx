import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import SlideDetail from "./pages/SlideDetail";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/slides/:id" element={<SlideDetail />} />
                <Route path="/upload" element={
                    <ProtectedRoute>
                        <Upload />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}