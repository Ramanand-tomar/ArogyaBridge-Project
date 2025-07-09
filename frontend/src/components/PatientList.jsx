import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import toast , {Toaster} from 'react-hot-toast';

const PatientList = () => {
  const { hhNumber } = useParams();
  const { web3, account, contract } = useContext(Web3Context);
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      let toastId;
      try {
        setLoading(true);
        if (!web3 || !account || !contract) {
          setError('Web3 or contract not initialized');
          setPatients([]);
          return;
        }
        toastId = toast.loading('Fetching patient list...');
        const result = await contract.patient.methods.getPatientList(hhNumber).call({ from: account });
        console.log('Fetched patients:', result);
        setPatients(result || []);
        setError(null);
      } catch (err) {
        setError('Error fetching patient list');
        toast.error('Error fetching patient list');
        setPatients([]);
      } finally {
        setLoading(false);
        if (toastId) toast.dismiss(toastId);
      }
    };
    fetchPatients();
  }, [hhNumber, web3, account, contract, removing]);

  const handleView = (patient_number) => {
    navigate(`/doctor/${hhNumber}/doctorviewpatient/${patient_number}`);
  };

  const handleRemove = async (patientNumber) => {
    if (!window.confirm('Are you sure you want to remove this patient?')) return;
    try {
      setRemoving(patientNumber);
      await contract.patient.methods.revokePermission(patientNumber, hhNumber).send({ from: account , gas: 4000000 });
      toast.success('Permission removed successfully!');
      setPatients(patients.filter(patient => patient.patient_number !== patientNumber));
      setRemoving(null);
    } catch (err) {
      alert('Failed to remove permission');
      console.error(err);
      setRemoving(null);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <div className="w-full max-w-2xl bg-gray-900 bg-opacity-90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in">
        <button
          onClick={() => navigate(`/doctor/${hhNumber}`)}
          className="mb-6 self-start px-5 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-lg shadow hover:from-teal-600 hover:to-blue-600 transition-all duration-200"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-extrabold mb-8 text-teal-300 drop-shadow">Patients with Granted Permission</h1>
        {loading ? (
          <div className="text-teal-300 text-lg font-semibold flex items-center gap-2 mb-6">
            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            Loading patients...
          </div>
        ) : error ? (
          <p className="text-red-500 text-lg font-semibold mb-4 flex items-center gap-2"><span>⚠️</span>{error}</p>
        ) : patients.length > 0 ? (
          <ul className="space-y-6 w-full">
            {patients.map((patient, idx) => (
              <li key={idx} className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform duration-200 border border-teal-500">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-600 text-white text-xl shadow-md">
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
                </span>
                <div className="flex flex-col flex-1">
                  <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded mb-1">{patient.patient_number || 'N/A'}</span>
                  <span className="font-semibold text-lg text-teal-200">{patient.patient_name || 'Unknown'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(patient.patient_number)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold text-white transition-all duration-150"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleRemove(patient.patient_number)}
                    className={`px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-white transition-all duration-150 ${removing === patient.patient_number ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={removing === patient.patient_number}
                  >
                    {removing === patient.patient_number ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300 text-lg font-medium">No patients have granted permission yet.</p>
        )}
      </div>
    </div>
  );
};

export default PatientList;