import { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/admin/uploads", { withCredentials: true })
      .then(res => setUploads(res.data.data))
      .catch(err => console.error("Admin fetch error:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👨‍💻 Admin Panel - All Uploads</h1>
      <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
        <thead className="bg-blue-100 text-left">
          <tr>
            <th className="p-3">User ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">File Name</th>
            <th className="p-3">Upload Date</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((item, i) => (
            <tr key={i} className="border-b hover:bg-gray-100 text-sm">
              <td className="p-3">{item.userId}</td>
              <td className="p-3">{item.userName}</td>
              <td className="p-3">{item.fileName}</td>
              <td className="p-3">{new Date(item.uploadDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
