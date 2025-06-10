import React, { useState } from "react";
import axios from "axios";

const UploadExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post("http://localhost:4000/api/excel/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data); // Excel data from backend
      })
      .catch((err) => {
        console.error("Upload failed:", err);
      });
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadExcel;
