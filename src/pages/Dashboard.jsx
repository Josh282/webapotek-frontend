import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ForecastChart from "../components/ForecastChart";

const Dashboard = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [horizon, setHorizon] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token"); // ✅ ambil token
    api
      .get(`/forecast?horizon=${horizon}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ kirim header token
        },
      })
      .then((res) => {
        if (res.data && res.data.forecast) {
          setForecast(res.data.forecast);
        } else {
          setError("Data tidak tersedia.");
        }
      })
      .catch((err) => {
        console.error("Gagal fetch forecast:", err);
        setError("Gagal mengambil data dari server.");
      })
      .finally(() => setLoading(false));
  }, [horizon]);

  const handleExport = () => {
    if (forecast.length === 0) return;
    const csv = [
      ["Obat", "Bulan", "Jumlah Prediksi"],
      ...forecast.map((row) => [row.obat, row.bulan, row.jumlah]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forecast_obat.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard Prediksi Stok Obat</h1>

        <div className="mb-4">
          <label className="mr-2 font-medium">Prediksi untuk:</label>
          <select
            value={horizon}
            onChange={(e) => setHorizon(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={1}>1 bulan ke depan</option>
            <option value={3}>3 bulan ke depan</option>
            <option value={6}>6 bulan ke depan</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>

        {loading && <p>Memuat data...</p>}

        {!loading && error && (
          <p className="text-red-600 text-center mt-6">{error}</p>
        )}

        {!loading && forecast.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-6">Belum ada data prediksi.</p>
        )}

        {!loading && forecast.length > 0 && (
          <>
            <ForecastChart data={forecast} />
            <table className="w-full border border-gray-300 mt-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Obat</th>
                  <th className="border px-4 py-2">Bulan</th>
                  <th className="border px-4 py-2">Jumlah Prediksi</th>
                </tr>
              </thead>
              <tbody>
                {forecast.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border px-4 py-2">{item.obat}</td>
                    <td className="border px-4 py-2">{item.bulan}</td>
                    <td className="border px-4 py-2">{item.jumlah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
