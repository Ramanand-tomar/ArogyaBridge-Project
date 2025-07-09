import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context.jsx';
import { useParams , useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import toast for notifications

const GrantPermission = () => {
  const { account, contract } = useContext(Web3Context);
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [patientNumber] = useState(hhNumber || '');
  const [doctorNumber, setDoctorNumber] = useState('');
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleGrant = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!contract || !contract.patient) {
      setError('Smart contract not loaded.');
      return;
    }
    setLoading(true);
    try {
      // Use .call() for read-only contract methods
      const isGranted = await contract.patient.methods
        .isPermissionGranted(patientNumber, doctorNumber)
        .call({ from: account });

      if (isGranted) {
        setMessage('Permission already granted to this doctor.');
        setLoading(false);
        toast.error('Permission already granted to this doctor.');
        return;
      }

      // Use .send() for state-changing contract methods
      await contract.patient.methods
        .grantPermission(patientNumber, doctorNumber, patientName)
        .send({ from: account, gas: 4000000 });

      toast.success('Permission granted successfully!');
      setMessage('Permission granted successfully!');
      setDoctorNumber('');
      setPatientName('');
      navigate(`/patient/${hhNumber}`); // Redirect to the patient's view page
    } catch (err) {
      console.error('Error granting permission:', err);
      setError(err?.message || 'Transaction failed.');
      toast.error(err?.message || 'Transaction failed.');
    }
    setLoading(false);
  };
  const backToDashboard = () => {
    navigate(`/patient/${patientNumber}`); // Adjust the path as needed
  };
  const handleLogout = () => {
    navigate('/home'); // Adjust the path as needed
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-md bg-gray-900 p-0 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
         <div className="absolute top-8 right-10 z-30 animate-fade-in">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:from-gray-900 hover:to-black transition-all duration-200 border border-gray-400/30"
          >
            Logout
          </button>
        </div>
        <div className="flex flex-col items-center justify-center bg-teal-600 py-8 px-4">
          <div className="bg-white rounded-full p-3 shadow-lg mb-2">
            <svg className="h-10 w-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0V7m0 4v4m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-3xl font-bold mb-1 text-white">Grant Permission</h2>
          <p className="text-teal-100 text-center text-sm">Allow a doctor to view your medical records securely on-chain.</p>
        </div>
        {/* Back to Dashboard Button */}
        <div className="px-8 pt-6">
          <button
            type="button"
            className="w-full py-2 mb-2 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl font-semibold text-base text-white hover:from-gray-800 hover:to-black transition-all duration-200 border border-gray-700 shadow-md"
            onClick={() => backToDashboard()}
          >
            Back to Dashboard
          </button>
        </div>
        <form onSubmit={handleGrant} className="space-y-7 px-8 py-10">
          <div className="relative">
            <input
              type="text"
              value={patientNumber}
              disabled
              className="peer w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition disabled:opacity-70 disabled:cursor-not-allowed"
              required
            />
            <label className="absolute left-3 top-1 text-xs text-teal-400 font-bold peer-focus:text-teal-300 transition-all">Patient Number</label>
          </div>
          <div className="relative">
            <input
              type="text"
              value={doctorNumber}
              onChange={e => setDoctorNumber(e.target.value)}
              className="peer w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              required
            />
            <label className="absolute left-3 top-1 text-xs text-teal-400 font-bold peer-focus:text-teal-300 transition-all">Doctor Number</label>
          </div>
          <div className="relative">
            <input
              type="text"
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              className="peer w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              required
            />
            <label className="absolute left-3 top-1 text-xs text-teal-400 font-bold peer-focus:text-teal-300 transition-all">Patient Name</label>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl font-bold text-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            )}
            {loading ? 'Granting...' : 'Grant Permission'}
          </button>
        </form>
        {message && (
          <div className="flex items-center justify-center gap-2 mt-2 text-green-400 text-center font-semibold animate-fade-in">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {message}
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center gap-2 mt-2 text-red-400 text-center font-semibold animate-fade-in">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrantPermission;