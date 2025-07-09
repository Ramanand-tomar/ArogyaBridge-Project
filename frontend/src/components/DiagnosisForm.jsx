import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { useParams, useNavigate } from 'react-router-dom';
import { uploadFileToIPFS } from '../assets/uploadToPinata';
import toast, {Toaster} from 'react-hot-toast';



const DiagnosisForm = () => {

  const backend_url = import.meta.env.VITE_BACKEND_URL


  const { web3, contract, account } = useContext(Web3Context);
  const { hhNumber } = useParams(); // diagnosis center's number
  const navigate = useNavigate();
  const [diagnosisDetails, setDiagnosisDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [PatienthhNumber, setPatienthhNumber] = useState('');

  useEffect(() => {
    const init = async () => {
      if (!web3 || !contract || !hhNumber) {
        setError('Web3 or contract not loaded or hhNumber is missing.');
        setLoading(false);
        return;
      }
      try {
        const result = await contract.diagnostic.methods.getDiagnosticDetails(hhNumber).call();
        setDiagnosisDetails(result);
        setError(null);
      } catch (error) {
        setError('Error retrieving diagnostic details');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [web3, contract, hhNumber]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCancel = () => {
    navigate(`/diagnosis/${hhNumber}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError(null);
    try {
      let ipfsHash = '';
      if (file) {
        ipfsHash = await uploadFileToIPFS(file);
      }
      // Send report details to backend
      const response = await fetch(`${backend_url}/api/diagnosis/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hhNumber:PatienthhNumber,
          title,
          description,
          ipfsHash,
          date: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to save report to backend');
      toast.success('Report submitted successfully!');
      setTitle('');
      setPatienthhNumber('');
      setDescription('');
      setFile(null);
      navigate(`/diagnosis/${hhNumber}`); // Redirect to diagnosis dashboard
    } catch (err) {
      toast.error('Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-2xl bg-gray-900 bg-opacity-90 backdrop-blur-lg p-0 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in">
        <div className="w-full flex flex-col items-center justify-center bg-gradient-to-tr from-teal-500 to-blue-500 py-8 px-4 rounded-t-3xl">
          <span className="bg-white rounded-full p-3 shadow-lg mb-2">
            <svg className="h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" /></svg>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-1 text-white drop-shadow">Create Diagnosis Report</h1>
          {diagnosisDetails && (
            <p className="text-lg sm:text-xl text-teal-100 mb-2">Welcome, <span className="font-bold text-yellow-200">{diagnosisDetails[1]}</span>!</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-7 px-8 py-10">
          <div>
            <label className="block font-bold mb-2 text-teal-300">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-teal-300">Enter Patient hhNumber : </label>
            <input
              type="text"
              value={PatienthhNumber}
              onChange={e => setPatienthhNumber(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-teal-300">Description / Findings</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-teal-300">Upload Report File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-white bg-gray-800 border border-gray-700 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600 transition"
              required
            />
            {file && (
              <div className="mt-2 text-teal-200 text-sm font-medium animate-fade-in">
                Selected: <span className="font-semibold">{file.name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-xl font-bold text-white transition-all duration-150 shadow disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl font-bold text-white transition-all duration-150 shadow"
            >
              Cancel
            </button>
          </div>
          {success && <p className="text-green-400 font-bold mt-4 animate-fade-in">{success}</p>}
          {error && <p className="text-red-400 font-bold mt-4 animate-fade-in">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default DiagnosisForm;