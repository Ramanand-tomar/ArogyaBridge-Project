import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const DiagnosticReport = () => {

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backend_url}/api/${hhNumber}/diagnosticreport`);
        if (!response.ok) throw new Error('Failed to fetch diagnosis reports');
        const data = await response.json();
        setReports(data);
        setError(null);
      } catch (err) {
        setError('No diagnosis reports found for this patient.');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [hhNumber]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-teal-100 to-pink-100 relative overflow-hidden font-mono">
      
      <div className="w-full max-w-3xl bg-white/80 p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in border border-teal-400/30 mt-20 mb-10">
        <h1 className="text-4xl font-extrabold mb-6 text-teal-700 drop-shadow text-center animate-bounce">Diagnostic Centre Report Details</h1>
        {loading ? (
          <div className="text-teal-500 text-lg font-semibold flex items-center gap-2 mb-6">
            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Loading reports...
          </div>
        ) : error ? (
          <p className="text-red-500 text-lg font-semibold mb-4 flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </p>
        ) : reports.length > 0 ? (
          <ul className="space-y-6 w-full">
            {reports.map((report, idx) => (
              <li key={idx} className="bg-gradient-to-r from-gray-100 to-teal-100 p-6 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center gap-4 hover:scale-[1.02] transition-transform duration-200 border border-teal-500">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white text-xl shadow-md">
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6' />
                    </svg>
                  </span>
                  <div>
                    <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded mr-2">#{idx + 1}</span>
                    <span className="font-semibold text-lg text-teal-700">{report.title}</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
                  <span className="bg-gray-300 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                    {report.date ? new Date(report.date).toLocaleDateString() : 'Unknown Date'}
                  </span>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mr-2">
                    Created: {new Date(report.createdAt).toLocaleString()}
                  </span>
                  {report.ipfsHash && (
                    <a
                      href={`https://ipfs.io/ipfs/${report.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 underline hover:text-blue-400 transition-colors duration-150 font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                      </svg>
                      View Report File
                    </a>
                  )}
                </div>
                <div className="mt-2 text-gray-700 text-base font-medium">
                  {report.description}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-lg font-medium">No diagnostic reports found.</p>
        )}
        <button
          onClick={() => navigate(`/patient/${hhNumber}`)}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-teal-600 transition-all duration-200 text-lg"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DiagnosticReport;