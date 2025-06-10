// src/custom/ExcelChart.jsx
// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Tooltip,
//   Legend
// } from "chart.js";

// import { Bar, Pie, Line } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Tooltip,
//   Legend
// );

// const ExcelChart = ({ data, xAxis, yAxis, chartType }) => {
//   if (!data || data.length < 2) return <p className="text-gray-500">No chart data available</p>;

//   const headers = data[0];
//   const rows = data.slice(1);

//   const xColIndex = headers.indexOf(xAxis);
//   const yColIndex = headers.indexOf(yAxis);

//   if (xColIndex === -1 || yColIndex === -1) {
//     return <p className="text-red-600">❌ Selected columns not found in the data</p>;
//   }

//   const labels = rows.map(row => row[xColIndex]);
//   const values = rows.map(row => Number(row[yColIndex]));

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: `${yAxis} by ${xAxis}`,
//         data: values,
//         backgroundColor: "rgba(59, 130, 246, 0.7)",
//         borderColor: "#2563EB"
//       }
//     ]
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: "top" }
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-4 mt-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">Chart Preview</h3>
//       {chartType === "bar" && <Bar data={chartData} options={chartOptions} />}
//       {chartType === "line" && <Line data={chartData} options={chartOptions} />}
//       {chartType === "pie" && <Pie data={chartData} />}
//     </div>
//   );
// };

// export default ExcelChart;




import React, { useRef } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

const ExcelChart = ({ data, xAxis, yAxis, chartType }) => {
  const chartRef = useRef();

  if (!data || data.length < 2) return <p className="text-gray-500">No chart data available</p>;

  const headers = data[0];
  const rows = data.slice(1);
  const xCol = headers.indexOf(xAxis);
  const yCol = headers.indexOf(yAxis);

  if (xCol === -1 || yCol === -1) return <p className="text-red-600">Selected columns not found</p>;

  const labels = rows.map(row => row[xCol]);
  const values = rows.map(row => Number(row[yCol]));

  const chartData = {
    labels,
    datasets: [{
      label: `${yAxis} by ${xAxis}`,
      data: values,
      backgroundColor: "rgba(59, 130, 246, 0.7)",
      borderColor: "#2563EB"
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } }
  };

  const handleExport = async () => {
    const canvas = await html2canvas(chartRef.current);
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, 180, 100);
    pdf.save("chart.pdf");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">📊 Chart Preview</h3>
      <div ref={chartRef}>
        {chartType === "bar" && <Bar data={chartData} options={chartOptions} />}
        {chartType === "line" && <Line data={chartData} options={chartOptions} />}
        {chartType === "pie" && <Pie data={chartData} />}
      </div>
      <button onClick={handleExport} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Export Chart as PDF</button>
    </div>
  );
};

export default ExcelChart;


