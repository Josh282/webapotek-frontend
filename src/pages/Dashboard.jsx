import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [tab, setTab] = useState("pemakaian");
  const [horizonTab, setHorizonTab] = useState(1);

  const [topUsed, setTopUsed] = useState([]);
  const [forecast1, setForecast1] = useState([]);
  const [forecast3, setForecast3] = useState([]);
  const [forecast6, setForecast6] = useState([]);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
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

    return (
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
            {paginated.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.obat}</td>
                <td className="border px-4 py-2">{item.jumlah}</td>
                {item.bulan && <td className="border px-4 py-2">{item.bulan}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  page === idx + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setPage(1); // Reset pagination setiap horizon atau tab berubah
  }, [horizonTab, tab]);

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
