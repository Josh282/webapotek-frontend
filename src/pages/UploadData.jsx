import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ManualEntryForm from "../components/ManualEntryForm";
import FormUpload from "../components/FormUpload";

const UploadData = () => {
  const [tab, setTab] = useState("manual");

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
        {tab === "manual" ? <ManualEntryForm /> : <FormUpload />}
      </div>
    </>
  );
};

export default UploadData;
