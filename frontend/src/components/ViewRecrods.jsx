import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

function ViewRecords() {
  const Backend_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const navigate = useNavigate();
  const { hhNumber } = useParams();
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("arogya_auth_token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${Backend_URL}/api/records/${hhNumber}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch records");
        const data = await response.json();
        setRecords(data || []);
        setError(null);
      } catch (err) {
        console.error("Error retrieving patient records:", err);
        setError("Error retrieving patient records from server.");
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [hhNumber]);

  const cancelOperation = () => {
    navigate("/patient/" + hhNumber);
  };

  const handleOpenDocument = (ipfsHash) => {
    window.open(`https://ipfs.io/ipfs/${ipfsHash}`, "_blank");
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-3xl bg-gray-900/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center border border-teal-500/30">
        <button
          onClick={cancelOperation}
          className="mb-6 self-start px-5 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-xl shadow hover:from-teal-600 hover:to-blue-600 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="flex flex-col items-center mb-6">
          <span className="bg-teal-600/80 rounded-2xl p-4 mb-3 shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" />
            </svg>
          </span>
          <h1 className="text-3xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
            Uploaded Health Documents
          </h1>
          <p className="text-gray-400 text-xs">
            Decentralized IPFS Storage for Patient: <span className="text-yellow-400 font-bold">{hhNumber}</span>
          </p>
        </div>

        {loading ? (
          <div className="text-teal-300 text-sm font-semibold flex items-center gap-3 my-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-400 border-t-transparent"></div>
            Retrieving documents from IPFS network...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-sm mb-6 w-full text-center">
            {error}
          </div>
        ) : records.length > 0 ? (
          <ul className="space-y-4 w-full">
            {records.map((record, index) => (
              <li
                key={index}
                className="bg-gray-800/70 border border-gray-700/80 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-teal-500/50 transition"
              >
                <div>
                  <h3 className="font-bold text-base text-white">{record.fileName || "Medical Record"}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-1 break-all">CID: {record.ipfsHash}</p>
                  <p className="text-xs text-teal-400 mt-1">
                    Uploaded: {record.uploadedAt ? new Date(record.uploadedAt).toLocaleString() : "Recorded"}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenDocument(record.ipfsHash)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition shadow"
                >
                  View on IPFS ↗
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-400 bg-gray-800/40 rounded-2xl w-full border border-gray-700">
            No medical documents found. You can upload records from your patient dashboard.
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewRecords;
