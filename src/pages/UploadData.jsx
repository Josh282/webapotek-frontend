import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ManualEntryForm from "../components/ManualEntryForm";
import FormUpload from "../components/FormUpload";
import api from "../services/api"; // ⬅️ untuk agregasi

const UploadData = () => {
  const [tab, setTab] = useState("manual");

  // State untuk agregasi
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aggMessage, setAggMessage] = useState("");

  const handleAggregate = async () => {
    if (!startDate || !endDate) {
      setAggMessage("❗Tentukan tanggal awal dan akhir terlebih dahulu.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/pemakaian/aggregate", null, {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAggMessage(`✅ ${res.data.message} | Baris: ${res.data.rows_inserted}`);
    } catch (err) {
      console.error(err);
      setAggMessage("❌ Gagal menjalankan agregasi.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Input Data Pemakaian Obat</h1>

        {/* Tab Switcher */}
        <div className="flex mb-6 space-x-4 border-b">
          <button
            onClick={() => setTab("manual")}
            className={`px-4 py-2 ${
              tab === "manual"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setTab("upload")}
            className={`px-4 py-2 ${
              tab === "upload"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Upload Excel
          </button>
        </div>

        {/* Tab Content */}
        {tab === "upload" ? (
          <>
            <FormUpload />

            {/* Aggregate Form */}
            <div className="mt-10 border-t pt-6">
              <h3 className="font-semibold mb-4 text-center text-lg">Agregasi Data Pemakaian</h3>
            
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4 max-w-3xl mx-auto">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border px-3 py-2 rounded w-full sm:w-1/3"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border px-3 py-2 rounded w-full sm:w-1/3"
                />
                <button
                  onClick={handleAggregate}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Aggregate
                </button>
              </div>
            
              {aggMessage && (
                <p className="text-sm text-center mt-2 text-gray-700">{aggMessage}</p>
              )}
            </div>

          </>
        ) : (
          <ManualEntryForm />
        )}
      </div>
    </>
  );
};

export default UploadData;
