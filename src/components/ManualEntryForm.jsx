import React, { useState } from "react";
import api from "../services/api";

const ManualEntryForm = () => {
  const [form, setForm] = useState({
    tanggal: "",
    nama_obat: "",
    penyakit: "",
    jenis: "",
    merk: "",
    pabrik: "",
    volume: 1,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/pemakaian/manual", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`✅ Berhasil ditambahkan: ID ${response.data.id}`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Gagal menyimpan data.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-4">Manual Data Entry</h2>
      <p className="text-sm text-gray-500 mb-6">Enter individual prescription records using the form below:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prescription Date</label>
          <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input type="text" name="merk" value={form.merk} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Drug Name</label>
          <input type="text" name="nama_obat" value={form.nama_obat} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Drug Type</label>
          <select name="jenis" value={form.jenis} onChange={handleChange} className="input">
            <option value="">Pilih</option>
            <option value="Tablet">Tablet</option>
            <option value="Kapsul">Kapsul</option>
            <option value="Sirup">Sirup</option>
            <option value="Salep">Salep</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Main Disease/Condition</label>
          <input type="text" name="penyakit" value={form.penyakit} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Volume</label>
          <input type="number" name="volume" value={form.volume} min="1" onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Manufacturer</label>
          <input type="text" name="pabrik" value={form.pabrik} onChange={handleChange} className="input" />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
      >
        Add Record
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default ManualEntryForm;
