import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [tab, setTab] = useState("utama");
  const [horizonTab, setHorizonTab] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [topUsed, setTopUsed] = useState([]);
  const [forecast1, setForecast1] = useState([]);
  const [forecast3, setForecast3] = useState([]);
  const [forecast6, setForecast6] = useState([]);
  const [topPenyakit, setTopPenyakit] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usedRes, f1, f3, f6, penyakitRes] = await Promise.all([
          api.get("/pemakaian/top15"),
          api.get("/forecast?horizon=1"),
          api.get("/forecast?horizon=3"),
          api.get("/forecast?horizon=6"),
          api.get("/pemakaian/top5-penyakit"),
        ]);

        setTopUsed(usedRes.data);
        setForecast1(f1.data.forecast);
        setForecast3(f3.data.forecast);
        setForecast6(f6.data.forecast);
        setTopPenyakit(penyakitRes.data);
      } catch (err) {
        console.error(err);
        setError("❌ Gagal mengambil data dari server.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [horizonTab, tab]);

  const getForecastByTab = () => {
    if (horizonTab === 1) return forecast1;
    if (horizonTab === 3) return forecast3;
    if (horizonTab === 6) return forecast6;
    return [];
  };

  const paginate = (data) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const renderTable = (title, data) => {
    const paginated = paginate(data);
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    const getPaginationItems = () => {
      const maxButtons = 5;
      const pages = [];
  
      if (totalPages <= maxButtons) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (page <= 3) {
          pages.push(1, 2, 3, "...", totalPages);
        } else if (page >= totalPages - 2) {
          pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, "...", page, "...", totalPages);
        }
      }
  
      return pages;
    };
  
    return (
      <div className="mb-8 max-w-6xl mx-auto">
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
            {paginated.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.obat || item.penyakit}</td>
                <td className="border px-4 py-2">{item.jumlah}</td>
                {item.bulan && <td className="border px-4 py-2">{item.bulan}</td>}
              </tr>
            ))}
          </tbody>
        </table>
  
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2 flex-wrap">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              {"<"}
            </button>
  
            {getPaginationItems().map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded ${
                    page === p
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {p}
                </button>
              )
            )}
  
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    );
  };
  

  const renderChart = (title, data, dataKey, labelKey) => (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={labelKey}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#3182ce" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Prediksi Obat</h1>

        {/* Tab Switcher */}
        <div className="flex mb-6 space-x-4 border-b">
          {["utama", "pemakaian", "forecast"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 ${
                tab === t
                  ? "border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {t === "utama"
                ? "Utama"
                : t === "pemakaian"
                ? "Top Pemakaian"
                : "Forecast"}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600">{error}</p>}

        {tab === "utama" && (
          <>
            {renderChart("📊 5 Penyakit Terbanyak Bulan Ini", topPenyakit, "jumlah", "penyakit")}
            {renderChart("📈 Top 15 Forecast", forecast1.slice(0, 15), "jumlah", "obat")}
            {renderTable("📋 Top 15 Pemakaian Obat", topUsed.slice(0, 15))}
          </>
        )}

        {tab === "pemakaian" &&
          renderTable("📋 Semua Data Pemakaian", topUsed)}

        {tab === "forecast" && (
          <>
            {/* Sub-tab Horizon */}
            <div className="flex mb-4 space-x-4">
              {[1, 3, 6].map((bulan) => (
                <button
                  key={bulan}
                  onClick={() => setHorizonTab(bulan)}
                  className={`px-3 py-1 rounded ${
                    horizonTab === bulan
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {bulan} Bulan
                </button>
              ))}
            </div>

            {renderTable(`📊 Forecast ${horizonTab} Bulan`, getForecastByTab())}
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
