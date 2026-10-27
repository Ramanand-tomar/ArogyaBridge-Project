import React, { useState, useEffect, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const DoctorPrescription = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const { web3, contract } = useContext(Web3Context);
  const { hhNumber, patient_Number } = useParams();
  const navigate = useNavigate();

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!contract || !contract.doctor || !hhNumber) {
        setError('Doctor contract not loaded or Doctor ID is missing.');
        setLoading(false);
        return;
      }
      try {
        const result = await contract.doctor.methods.getDoctorDetails(hhNumber).call();
        setDoctorDetails(result);
        setError(null);
      } catch (err) {
        console.error('Error retrieving doctor details:', err);
        setError('Error retrieving doctor details from blockchain.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [contract, hhNumber]);

  const handleCancel = () => {
    navigate(`/doctor/${hhNumber}/doctorviewpatient/${patient_Number}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please provide a title and prescription description.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem('arogya_auth_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const date = new Date().toISOString().split('T')[0];
      const response = await fetch(`${backend_url}/api/prescriptions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          patientNumber: patient_Number,
          doctorNumber: hhNumber,
          title: title.trim(),
          description: description.trim(),
          date,
          ipfsHash: '',
          fileName: `Prescription-${patient_Number}-${date}.txt`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save prescription');
      }

      toast.success('Prescription created and recorded successfully! 📝');
      setTitle('');
      setDescription('');

      setTimeout(() => {
        navigate(`/doctor/${hhNumber}/doctorviewpatient/${patient_Number}`);
      }, 1000);
    } catch (err) {
      console.error('Prescription submission error:', err);
      setError(err.message || 'Failed to submit prescription.');
      toast.error(err.message || 'Failed to submit prescription.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white flex flex-col justify-center items-center min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-2xl bg-gray-900/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center border border-teal-500/30">
        <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
          Issue Medical Prescription
        </h1>
        <p className="text-xs text-gray-400 mb-6 text-center">
          Patient HH: <span className="text-yellow-400 font-bold">{patient_Number}</span> • Doctor HH:{" "}
          <span className="text-teal-400 font-bold">{hhNumber}</span>
        </p>

        {doctorDetails && (
          <div className="w-full p-4 bg-gray-800/50 rounded-2xl border border-gray-700 mb-6 text-sm flex justify-between items-center">
            <div>
              <span className="text-gray-400 text-xs">Prescribing Doctor:</span>
              <p className="font-bold text-yellow-300">{doctorDetails._doctorName || doctorDetails[1]}</p>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-xs">Facility:</span>
              <p className="text-gray-200">{doctorDetails._hospitalName || doctorDetails[2]}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-sm mb-4 w-full">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Prescription Title / Diagnosis *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acute Bronchitis Treatment & Dosage"
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Prescription Instructions, Medications & Dosage *
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. &#10;1. Amoxicillin 500mg - 1 capsule every 8 hours for 7 days.&#10;2. Paracetamol 650mg - as needed for fever.&#10;3. Drink plenty of warm fluids."
              className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Issue Prescription'}
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

export default DoctorPrescription;