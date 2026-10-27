import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { useParams, useNavigate } from 'react-router-dom';
import { uploadFileToIPFS } from '../assets/uploadToPinata';
import toast, { Toaster } from 'react-hot-toast';

const DiagnosisForm = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const { web3, contract } = useContext(Web3Context);
  const { hhNumber } = useParams(); // diagnosis center's number
  const navigate = useNavigate();

  const [diagnosisDetails, setDiagnosisDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [PatienthhNumber, setPatienthhNumber] = useState('');

  useEffect(() => {
    const init = async () => {
      const diagContract = contract?.diagnosis || contract?.diagnostic;
      if (!diagContract || !hhNumber) {
        setError('Diagnostic smart contract not loaded or Center ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const result = await diagContract.methods.getDiagnosticDetails(hhNumber).call();
        setDiagnosisDetails(result);
        setError(null);
      } catch (err) {
        console.error('Error retrieving diagnostic details:', err);
        setError('Error retrieving diagnostic center details from blockchain.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [contract, hhNumber]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    navigate(`/diagnosis/${hhNumber}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!PatienthhNumber || PatienthhNumber.length !== 6) {
      toast.error('Please enter a valid 6-digit Patient HH Number.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.error('Please enter report title and description.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(file ? 'Uploading medical scan to IPFS...' : 'Submitting report...');

    try {
      let ipfsHash = '';
      if (file) {
        ipfsHash = await uploadFileToIPFS(file);
        toast.loading('Saving diagnosis report to database...', { id: toastId });
      }

      const token = localStorage.getItem('arogya_auth_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Send report details to backend
      const response = await fetch(`${backend_url}/api/diagnosis/report`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          hhNumber: PatienthhNumber.trim(),
          title: title.trim(),
          description: description.trim(),
          ipfsHash: ipfsHash || 'N/A',
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save diagnostic report');
      }

      toast.dismiss(toastId);
      toast.success('Diagnostic report uploaded and linked successfully! 🔬');
      setTitle('');
      setPatienthhNumber('');
      setDescription('');
      setFile(null);

      setTimeout(() => {
        navigate(`/diagnosis/${hhNumber}`);
      }, 1000);
    } catch (err) {
      console.error('Diagnosis report error:', err);
      toast.dismiss(toastId);
      toast.error(err.message || 'Failed to submit diagnostic report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white flex flex-col justify-center items-center min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-2xl bg-gray-900/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center border border-teal-500/30">
        <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
          Upload Diagnostic Lab Report
        </h1>
        <p className="text-xs text-gray-400 mb-6 text-center">
          Diagnostic Center ID: <span className="text-teal-400 font-bold">{hhNumber}</span>
        </p>

        {diagnosisDetails && (
          <div className="w-full p-4 bg-gray-800/50 rounded-2xl border border-gray-700 mb-6 text-sm flex justify-between items-center">
            <div>
              <span className="text-gray-400 text-xs">Diagnostic Center:</span>
              <p className="font-bold text-yellow-300">{diagnosisDetails._diagnosticName || diagnosisDetails[1]}</p>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-xs">Facility Location:</span>
              <p className="text-gray-200">{diagnosisDetails._diagnosticLocation || diagnosisDetails[3]}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-sm mb-4 w-full">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Patient HH Number (6 Digits) *</label>
            <input
              type="text"
              maxLength={6}
              value={PatienthhNumber}
              onChange={(e) => setPatienthhNumber(e.target.value)}
              placeholder="e.g. 100001"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Test / Report Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Blood Count (CBC) & Metabolic Panel"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Clinical Findings & Remarks *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter summary of lab findings, reference ranges, and observations"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Attach Lab Scan / Document (PDF, Image)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"
            />
            {file && <p className="text-xs text-teal-300 mt-1 font-mono">Selected: {file.name}</p>}
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Upload & Pin Report'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="py-3 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl border border-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiagnosisForm;