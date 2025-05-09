import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // ✅ Pindah ke sini

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white px-6 py-3 mb-4 shadow-md">
      <div className="font-bold text-lg">WebApotek</div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Dashboard</Link>
        {role === "admin" && (
          <Link to="/upload" className="hover:underline">Upload</Link>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
