import React, { useState } from "react";
import api from "../services/api";

const FormUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Pilih file CSV terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/upload/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(`✅ ${response.data.message} | Baris: ${response.data.rows_inserted}`);
    } catch (error) {
      console.error("Upload gagal:", error);
      setMessage("❌ Upload gagal. Pastikan file CSV valid.");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      <br />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload CSV
      </button>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default FormUpload;
