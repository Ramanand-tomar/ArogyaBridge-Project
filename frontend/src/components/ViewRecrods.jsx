import React, { useState, useEffect } from "react";
import toast , { Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";




function ViewRecords() {
  const Backend_URL = import.meta.env.VITE_BACKEND_URL ;

  const navigate = useNavigate();
  const { hhNumber } = useParams();
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${Backend_URL}/api/records/${hhNumber}`);
        if (!response.ok) throw new Error("Failed to fetch records");
        const data = await response.json();
        setRecords(data);
        toast.success("Records retrieved successfully!");
        setError(null);
      } catch (err) {
        setError("Error retrieving patient records");
        toast.error("Failed to fetch records.");
        console.error(err);
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

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-3xl bg-gray-900 p-10 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <span className="bg-teal-600 rounded-full p-4 mb-2 shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" />
            </svg>
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Patient Records</h1>
          <p className="text-teal-200 text-center text-sm">View and access your uploaded medical documents securely.</p>
        </div>
        {loading ? (
          <div className="text-teal-300 text-lg font-semibold flex items-center gap-2 mb-6">
            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Loading records...
          </div>
        ) : error ? (
          <p className="text-red-500 text-lg font-semibold mb-4 flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </p>
        ) : records.length > 0 ? (
          <ul className="space-y-6 w-full">
            {records.map((record, index) => (
              <li
                key={index}
                className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center gap-4 hover:scale-[1.02] transition-transform duration-200 border border-teal-500"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white text-xl shadow-md">
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6' />
                    </svg>
                  </span>
                  <div>
                    <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded mr-2">#{index + 1}</span>
                    <span className="font-semibold text-lg text-teal-200">{record.fileName || 'Document'}</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
                  <span className="bg-gray-600 text-gray-100 text-xs px-2 py-1 rounded-full mr-2">
                    {record.uploadedAt ? new Date(record.uploadedAt).toLocaleDateString() : 'Unknown Date'}
                  </span>
                  {record.ipfsHash && (
                    <a
                      href={`https://ipfs.io/ipfs/${record.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 underline hover:text-blue-300 transition-colors duration-150 font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                      </svg>
                      View Uploaded File
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300 text-lg font-medium">No records found.</p>
        )}
        <button
          onClick={cancelOperation}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-teal-600 transition-all duration-200 text-lg"
        >
          ← Back to Dashboard
        </button>
      </div>
      <div className="mt-6 text-center">
        <p className="text-lg">
          If you want to upload your past records, please click{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate(`/patient/${hhNumber}/uploadrecords`)}
          >
            here
          </span>
        </p>
      </div>
    </div>
  );
}

export default ViewRecords;
