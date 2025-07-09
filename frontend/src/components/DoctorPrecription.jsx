import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import toast for notifications


const DoctorPrecription = () => {

  const backend_url = import.meta.env.VITE_BACKEND_URL;


  const { web3, contract, account } = useContext(Web3Context);
  const { hhNumber, patient_Number } = useParams();
  const navigate = useNavigate();
  const [doctorContract, setDoctorContract] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const init = async () => {
      if (!web3 || !contract || !hhNumber) {
        setError('Web3 or contract not loaded or hhNumber is missing.');
        setLoading(false);
        return;
      }
      try {
        setDoctorContract(contract.doctor);
        const result = await contract.doctor.methods.getDoctorDetails(hhNumber).call();
        setDoctorDetails(result);
        setError(null);
      } catch (error) {
        setError('Error retrieving doctor details');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [web3, contract, hhNumber]);

  const handleCancel = () => {
    navigate(`/doctor/${hhNumber}/doctorviewpatient/${patient_Number}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError(null);
    try {
      // Store prescription in MongoDB via backend API
      const date = new Date().toISOString().split('T')[0];
      const response = await fetch(`${backend_url}/api/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientNumber: patient_Number,
          doctorNumber: hhNumber,
          title,
          description,
          date
        })
      });
      if (response.ok) {
        toast.success('Prescription submitted and saved to Ethereum Blockchain!');
        setTitle('');
        setDescription('');
      } else {
        toast.error('Failed to save prescription to blockchain.');
      }
    } catch (err) {
      setError('Failed to submit prescription.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white flex flex-col justify-center items-center min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-2xl bg-gray-900 bg-opacity-80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Doctor Prescription</h1>
        {doctorDetails && (
          <p className="text-xl sm:text-2xl mb-4">Welcome, {doctorDetails[1]}!</p>
        )}
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
          <div>
            <label className="block font-bold mb-2">Prescription Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Description / Notes</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              rows={4}
              required
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-white transition-all duration-150 shadow disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Prescription'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-white transition-all duration-150 shadow"
            >
              Cancel
            </button>
          </div>
          {success && <p className="text-green-400 font-bold mt-4">{success}</p>}
          {error && <p className="text-red-400 font-bold mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default DoctorPrecription;