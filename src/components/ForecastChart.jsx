import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ForecastChart = ({ data }) => {
  return (
    <div className="w-full h-72">
      <h2 className="text-xl font-semibold mb-2">Grafik Prediksi Jumlah Obat</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="obat" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="jumlah" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
