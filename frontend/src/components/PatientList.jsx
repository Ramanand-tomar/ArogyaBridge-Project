import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import toast, { Toaster } from 'react-hot-toast';

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
        if (!contract || !contract.patient) {
          setError('Smart contract not initialized');
          setPatients([]);
          return;
        }

        const activeAccount = account || (await web3?.eth.getAccounts())?.[0];
        const result = await contract.patient.methods
          .getPatientList(hhNumber)
          .call({ from: activeAccount || undefined });

        setPatients(result || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching patient list:', err);
        setError('Error fetching patient list');
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [hhNumber, web3, account, contract]);

  const handleView = (patient_number) => {
    navigate(`/doctor/${hhNumber}/doctorviewpatient/${patient_number}`);
  };

  const handleRemove = async (patientNumber) => {
    if (!window.confirm('Are you sure you want to revoke access for this patient?')) return;
    const toastId = toast.loading('Submitting revocation transaction to blockchain...');
    try {
      setRemoving(patientNumber);
      await contract.patient.methods
        .revokePermission(patientNumber, hhNumber)
        .send({ from: account });

      toast.dismiss(toastId);
      toast.success('Permission revoked successfully!');
      setPatients((prev) => prev.filter((patient) => patient.patient_number !== patientNumber));
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Failed to revoke permission: ' + (err.message || 'Transaction rejected'));
      console.error(err);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-3xl bg-gray-900/90 backdrop-blur-lg p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center border border-teal-500/30">
        <button
          onClick={() => navigate(`/doctor/${hhNumber}`)}
          className="mb-6 self-start px-5 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-xl shadow hover:from-teal-600 hover:to-blue-600 transition"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
          Authorized Patient Roster
        </h1>
        <p className="text-xs text-gray-400 mb-8 text-center">
          Patients who have cryptographically granted you permission to view their electronic health records.
        </p>

        {loading ? (
          <div className="text-teal-300 text-lg font-semibold flex items-center gap-3 mb-6">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-400 border-t-transparent"></div>
            Loading patient roster from blockchain...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-sm mb-6">
            {error}
          </div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center text-gray-400 bg-gray-800/40 rounded-2xl w-full border border-gray-700">
            No patients have granted you access yet. Patients can grant you access using your Doctor HH Number:{" "}
            <span className="font-bold text-teal-400">{hhNumber}</span>.
          </div>
        ) : (
          <div className="w-full space-y-4">
            {patients.map((patient, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-800/60 border border-gray-700 rounded-2xl gap-4 hover:border-teal-500/50 transition"
              >
                <div>
                  <div className="font-bold text-lg text-white">
                    {patient.patient_name || "Patient Record"}
                  </div>
                  <div className="text-xs text-teal-400 font-mono">
                    HH Number: {patient.patient_number}
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleView(patient.patient_number)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-sm transition"
                  >
                    View Records & Prescribe
                  </button>
                  <button
                    onClick={() => handleRemove(patient.patient_number)}
                    disabled={removing === patient.patient_number}
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition disabled:opacity-50"
                  >
                    {removing === patient.patient_number ? "Revoking..." : "Revoke Access"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;