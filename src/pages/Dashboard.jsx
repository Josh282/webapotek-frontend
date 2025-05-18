import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [tab, setTab] = useState("pemakaian");

  const [topUsed, setTopUsed] = useState([]);
  const [forecast1, setForecast1] = useState([]);
  const [forecast3, setForecast3] = useState([]);
  const [forecast6, setForecast6] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [usedRes, f1, f3, f6] = await Promise.all([
          api.get("/pemakaian/top15"),
          api.get("/forecast/top15?horizon=1"),
          api.get("/forecast/top15?horizon=3"),
          api.get("/forecast/top15?horizon=6"),
        ]);

        setTopUsed(usedRes.data);
        setForecast1(f1.data.forecast_top15 || f1.data.forecast);
        setForecast3(f3.data.forecast_top15 || f3.data.forecast);
        setForecast6(f6.data.forecast_top15 || f6.data.forecast);
      } catch (err) {
        console.error(err);
        setError("❌ Gagal mengambil data dari server.");
      }
    };

    fetchData();
  }, []);

  const renderTable = (title, data) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Obat</th>
            <th className="border px-4 py-2">Jumlah</th>
            {data[0]?.bulan && <th className="border px-4 py-2">Bulan</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{item.obat}</td>
              <td className="border px-4 py-2">{item.jumlah}</td>
              {item.bulan && <td className="border px-4 py-2">{item.bulan}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Prediksi Obat</h1>

        {/* Tab Switcher */}
        <div className="flex mb-6 space-x-4 border-b">
          <button
            onClick={() => setTab("pemakaian")}
            className={`px-4 py-2 ${
              tab === "pemakaian"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Top Pemakaian
          </button>
          <button
            onClick={() => setTab("forecast")}
            className={`px-4 py-2 ${
              tab === "forecast"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Top Forecast
          </button>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {tab === "pemakaian" ? (
          renderTable("🔁 15 Obat Paling Sering Dipakai", topUsed)
        ) : (
          <>
            {renderTable("📈 Forecast 1 Bulan", forecast1)}
            {renderTable("📉 Forecast 3 Bulan", forecast3)}
            {renderTable("📊 Forecast 6 Bulan", forecast6)}
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
