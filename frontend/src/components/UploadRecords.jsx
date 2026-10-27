// src/components/UploadRecords.jsx
import React, { useState, useContext } from 'react';
import { uploadFileToIPFS } from '../assets/uploadToPinata';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Web3Context } from '../context/Web3Context.jsx';

const UploadRecords = () => {
  const Backend_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const { hhNumber } = useParams();
  const { account } = useContext(Web3Context);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload first.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Uploading medical record to decentralized IPFS...');

    try {
      // 1. Upload via secure backend IPFS proxy
      const hash = await uploadFileToIPFS(file);
      setIpfsHash(hash);
      toast.loading('Indexing record in database...', { id: toastId });

      const token = localStorage.getItem('arogya_auth_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 2. Store record pointer in backend database
      const response = await fetch(`${Backend_URL}/api/records`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          patientNumber: hhNumber,
          ipfsHash: hash,
          fileName: file.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record document metadata in database');
      }

      toast.dismiss(toastId);
      toast.success('Medical record uploaded and pinned successfully! 📄');
    } catch (err) {
      console.error('Record upload failed:', err);
      toast.dismiss(toastId);
      toast.error(err.message || 'Upload transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const BackToDashboard = () => {
    navigate(`/patient/${hhNumber}`);
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white min-h-screen flex flex-col justify-center items-center">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-3xl bg-gray-900/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-teal-500/30 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Upload Medical Records
        </h1>
        <p className="text-xs text-gray-400 mb-8 text-center">
          Decentralized Storage on IPFS • Patient ID: <span className="text-yellow-400 font-bold">{hhNumber}</span>
        </p>

        <label
          htmlFor="file-upload"
          className="w-full mb-6 flex flex-col items-center cursor-pointer bg-gray-800/80 hover:bg-gray-700/80 text-white font-semibold py-8 px-6 rounded-2xl shadow-md transition duration-200 border-2 border-dashed border-teal-500/50 hover:border-teal-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
          </svg>
          <span className="text-base font-bold text-teal-300">Click to choose a medical record file</span>
          <span className="text-xs text-gray-400 mt-1">Supports PDF, PNG, JPG, DICOM scans (Up to 25 MB)</span>
          <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
        </label>

        {file && (
          <div className="w-full mb-6 p-4 bg-teal-950/40 border border-teal-500/40 rounded-xl text-teal-200 text-sm flex justify-between items-center">
            <span>Selected File: <strong className="text-white">{file.name}</strong></span>
            <span className="text-xs text-gray-400 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        )}

        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload & Pin to IPFS'}
          </button>
          <button
            onClick={BackToDashboard}
            className="py-3 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl border border-gray-700 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {ipfsHash && (
          <div className="w-full mt-6 p-4 bg-gray-800/60 rounded-xl border border-teal-500/40 text-sm">
            <p className="text-green-400 font-bold mb-1">✅ Uploaded & Verified on IPFS</p>
            <p className="text-xs text-gray-400 break-all font-mono">CID: {ipfsHash}</p>
            <a
              href={`https://ipfs.io/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-blue-400 hover:underline"
            >
              Open Document on IPFS Gateway ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadRecords;
