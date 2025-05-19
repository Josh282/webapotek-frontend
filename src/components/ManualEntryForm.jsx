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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/pemakaian/manual", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("✅ Data berhasil disimpan");
      setForm({
        tanggal: "",
        nama_obat: "",
        penyakit: "",
        jenis: "",
        merk: "",
        pabrik: "",
        volume: 1,
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Gagal menyimpan data");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Manual Data Entry
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium">Prescription Date</label>
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Brand</label>
          <input
            type="text"
            name="merk"
            value={form.merk}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Drug Name</label>
          <input
            type="text"
            name="nama_obat"
            value={form.nama_obat}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Drug Type</label>
          <select
            name="jenis"
            value={form.jenis}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          >
            <option value="">Pilih jenis</option>
            <option value="Tablet">Tablet</option>
            <option value="Kapsul">Kapsul</option>
            <option value="Injeksi">Injeksi</option>
            <option value="Sirup">Sirup</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Main Disease/Condition</label>
          <input
            type="text"
            name="penyakit"
            value={form.penyakit}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Manufacturer</label>
          <input
            type="text"
            name="pabrik"
            value={form.pabrik}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Volume</label>
          <input
            type="number"
            name="volume"
            value={form.volume}
            onChange={handleChange}
            min="1"
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Record
        </button>
      </div>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
};

export default ManualEntryForm;
