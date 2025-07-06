import React, { useState } from "react";
import axios from "axios";

const UploadExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("/api/upload", formData);
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-700">Upload Excel File</h2>
        
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <button
          onClick={handleUpload}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded transition"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadExcel;
