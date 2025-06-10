import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import ExcelChart from "../components/custom/ExcelChart.jsx";

// ✅ Reusable Chart Filters Component
const ChartFilters = ({ data, xAxis, setXAxis, yAxis, setYAxis, chartType, setChartType }) => {
  if (!data || !data[0]) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <select value={xAxis} onChange={e => setXAxis(e.target.value)} className="p-2 border rounded">
        {data[0].map((h, i) => <option key={i}>{h}</option>)}
      </select>

      <select value={yAxis} onChange={e => setYAxis(e.target.value)} className="p-2 border rounded">
        {data[0].map((h, i) => <option key={i}>{h}</option>)}
      </select>

      <select value={chartType} onChange={e => setChartType(e.target.value)} className="p-2 border rounded">
        <option value="bar">Bar Chart</option>
        <option value="line">Line Chart</option>
        <option value="pie">Pie Chart</option>
      </select>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [history, setHistory] = useState([]);

  // History states
  const [expandedHistoryIndex, setExpandedHistoryIndex] = useState(null);
  const [historyParsedData, setHistoryParsedData] = useState(null);
  const [historyXAxis, setHistoryXAxis] = useState("");
  const [historyYAxis, setHistoryYAxis] = useState("");
  const [historyChartType, setHistoryChartType] = useState("bar");

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://localhost:4000/api/excel/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const data = res.data.data;
      setParsedData(data);
      if (data[0].length >= 2) {
        setXAxis(data[0][1]);
        setYAxis(data[0][5] || data[0][1]);
      }

      fetchHistory();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/excel/history", {
        withCredentials: true,
      });
      setHistory(res.data.data);
    } catch (err) {
      console.error("History fetch failed", err);
    }
  };

  const handleHistoryClick = async (index, historyItem) => {
    if (expandedHistoryIndex === index) {
      setExpandedHistoryIndex(null);
      setHistoryParsedData(null);
    } else {
      try {
        const res = await axios.get(`http://localhost:4000/api/excel/history/${historyItem._id}/data`, {
          withCredentials: true,
        });

        const data = res.data.data;
        setHistoryParsedData(data);
        setExpandedHistoryIndex(index);

        if (data[0].length >= 2) {
          setHistoryXAxis(data[0][1]);
          setHistoryYAxis(data[0][5] || data[0][1]);
        }
      } catch (err) {
        console.error("Failed to fetch history parsed data", err);
        alert("Failed to load chart data for this history item");
      }
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome, {user.name}</h1>
        <p className="text-gray-600 mb-6">Upload Excel files and generate custom graphs.</p>

        {/* Upload Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input type="file" onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload File
          </button>
        </div>

        {/* Chart Section for Uploaded File */}
        {parsedData && (
          <>
            <ChartFilters
              data={parsedData}
              xAxis={xAxis}
              setXAxis={setXAxis}
              yAxis={yAxis}
              setYAxis={setYAxis}
              chartType={chartType}
              setChartType={setChartType}
            />

            <ExcelChart data={parsedData} xAxis={xAxis} yAxis={yAxis} chartType={chartType} />

            <div className="mt-6">
              <h2 className="text-lg font-semibold text-green-700 mb-2">Raw Data Preview:</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto max-h-64 text-sm">
                {JSON.stringify(parsedData.slice(0, 5), null, 2)}
              </pre>
            </div>
          </>
        )}

        {/* Upload History */}
        {history.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Upload History</h3>
            <ul className="divide-y divide-gray-300 border rounded overflow-hidden">
              {history.map((h, i) => (
                <li key={h._id || i} className="p-4 hover:bg-gray-50">
                  {/* Only Header is clickable now */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => handleHistoryClick(i, h)}
                  >
                    <strong>{h.fileName}</strong>
                    <span className="text-gray-600 text-sm">
                      {h.uploadDate ? new Date(h.uploadDate).toLocaleString() : "N/A"}
                    </span>
                    <span className="ml-2">{expandedHistoryIndex === i ? "▲" : "▼"}</span>
                  </div>

                  {/* Expanded content */}
                  {expandedHistoryIndex === i && historyParsedData && (
                    <div className="mt-4 bg-gray-50 p-4 rounded border">
                      <h4 className="font-semibold mb-2">Chart Preview for {h.fileName}</h4>

                      <ChartFilters
                        data={historyParsedData}
                        xAxis={historyXAxis}
                        setXAxis={setHistoryXAxis}
                        yAxis={historyYAxis}
                        setYAxis={setHistoryYAxis}
                        chartType={historyChartType}
                        setChartType={setHistoryChartType}
                      />

                      <ExcelChart
                        data={historyParsedData}
                        xAxis={historyXAxis}
                        yAxis={historyYAxis}
                        chartType={historyChartType}
                      />

                      <pre className="bg-white p-3 mt-4 rounded max-h-48 overflow-auto text-xs">
                        {JSON.stringify(historyParsedData.slice(0, 5), null, 2)}
                      </pre>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
