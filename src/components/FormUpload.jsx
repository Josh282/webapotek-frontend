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
      setMessage("❗Pilih file terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/upload/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(`✅ ${response.data.message} | Baris: ${response.data.rows_inserted}`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload gagal. Pastikan file valid.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload CSV</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Pilih File Excel</label>
        <input
          type="file"
          accept=".csv, .xlsx"
          onChange={handleFileChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
};


export default FormUpload;
