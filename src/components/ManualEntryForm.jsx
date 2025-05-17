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
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post("/pemakaian/manual", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Data berhasil ditambahkan.");
      // reset form
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
      setMessage("❌ Gagal menambahkan data.");
    }
  };

  return (
    <div className="space-y-4 max-w-xl">
      <input name="tanggal" type="date" value={form.tanggal} onChange={handleChange} className="input border p-2 w-full" />
      <input name="nama_obat" placeholder="Nama Obat" value={form.nama_obat} onChange={handleChange} className="input border p-2 w-full" />
      <input name="penyakit" placeholder="Penyakit Utama" value={form.penyakit} onChange={handleChange} className="input border p-2 w-full" />
      <input name="jenis" placeholder="Jenis (Tablet/Kapsul...)" value={form.jenis} onChange={handleChange} className="input border p-2 w-full" />
      <input name="merk" placeholder="Merk" value={form.merk} onChange={handleChange} className="input border p-2 w-full" />
      <input name="pabrik" placeholder="Pabrikan" value={form.pabrik} onChange={handleChange} className="input border p-2 w-full" />
      <input name="volume" type="number" min="1" value={form.volume} onChange={handleChange} className="input border p-2 w-full" />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Tambah Data Manual
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
};

export default ManualEntryForm;
