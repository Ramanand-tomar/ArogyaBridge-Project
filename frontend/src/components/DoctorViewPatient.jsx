import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import toast, { Toaster } from "react-hot-toast";

const DoctorViewPatient = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const { web3, account, contract } = useContext(Web3Context);
  const { hhNumber, patient_Number } = useParams();
  const navigate = useNavigate();

  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!contract || !contract.patient || !hhNumber || !patient_Number) {
        setError("Web3 connection or patient contract not initialized.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Verify that the patient has granted permission to this doctor
        const hasPermission = await contract.patient.methods
          .isPermissionGranted(patient_Number, hhNumber)
          .call();

        if (!hasPermission) {
          setPermissionDenied(true);
          setError("Access Denied: The patient has not granted you viewing permission for their records.");
          setLoading(false);
          return;
        }

        const result = await contract.patient.methods
          .getPatientDetails(patient_Number)
          .call();

        setPatientDetails(result);
        setError(null);
      } catch (err) {
        console.error("Error retrieving patient details:", err);
        setError("Error retrieving patient details from blockchain.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [contract, hhNumber, patient_Number]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("arogya_auth_token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const handleViewRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backend_url}/api/records/${patient_Number}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch records");
      const data = await response.json();
      setRecords(data || []);
      setError(null);
      setShowModal(true);
    } catch (err) {
      setError("Error retrieving patient records");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescriptions = async () => {
    setPrescriptionLoading(true);
    setPrescriptionError(null);
    try {
      const response = await fetch(`${backend_url}/api/prescriptions/${patient_Number}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch prescriptions");
      const data = await response.json();
      setPrescriptions(data || []);
      setShowPrescriptionModal(true);
    } catch (err) {
      setPrescriptionError("Error retrieving prescriptions");
      setPrescriptions([]);
      setShowPrescriptionModal(true);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  const handleOpenDocument = (ipfsHash) => {
    window.open(`https://ipfs.io/ipfs/${ipfsHash}`, "_blank");
  };

  const handlePrescription = () => {
    navigate(`/doctor/${hhNumber}/doctorviewpatient/${patient_Number}/doctor-Prescription`);
  };

  const handleClose = () => {
    navigate(`/doctor/${hhNumber}/patientlist`);
  };

  const handleLogout = () => {
    localStorage.removeItem("arogya_auth_token");
    localStorage.removeItem("arogya_user");
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white relative">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="absolute top-8 right-10 z-30">
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold text-sm shadow hover:from-gray-900 hover:to-black transition border border-gray-600"
        >
          Logout
        </button>
      </div>

      <div className="w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center border border-teal-500/30">
        <h1 className="text-3xl font-extrabold mb-6 text-teal-300 drop-shadow">
          Patient Medical Profile
        </h1>

        {loading ? (
          <div className="text-teal-300 text-base font-semibold flex items-center gap-3 mb-6">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-400 border-t-transparent"></div>
            Verifying permission on blockchain...
          </div>
        ) : permissionDenied ? (
          <div className="w-full p-6 bg-red-900/30 border border-red-500/50 rounded-2xl flex flex-col items-center text-center gap-4">
            <span className="text-4xl">🚫</span>
            <h2 className="text-xl font-bold text-red-300">Viewing Access Not Granted</h2>
            <p className="text-sm text-gray-300">
              The patient (HH Number: <span className="font-bold text-yellow-300">{patient_Number}</span>) has not granted viewing permission to your Doctor ID (<span className="font-bold text-teal-300">{hhNumber}</span>).
            </p>
            <p className="text-xs text-gray-400">
              Please ask the patient to navigate to "Grant Permission" on their dashboard and add your Doctor ID.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-bold transition"
            >
              ← Back to Patient List
            </button>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-sm mb-4">
            {error}
          </div>
        ) : patientDetails ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-gray-800/40 p-6 rounded-2xl border border-gray-700">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-xs font-semibold uppercase">Patient Name</span>
              <span className="text-xl font-bold text-yellow-400">{patientDetails.name || patientDetails[1]}</span>
              <span className="text-gray-400 text-xs font-semibold uppercase mt-2">Date of Birth</span>
              <span className="text-sm text-white">{patientDetails.dateOfBirth || patientDetails[2]}</span>
              <span className="text-gray-400 text-xs font-semibold uppercase mt-2">Gender</span>
              <span className="text-sm text-white">{patientDetails.gender || patientDetails[3]}</span>
              <span className="text-gray-400 text-xs font-semibold uppercase mt-2">Blood Group</span>
              <span className="text-sm text-white">{patientDetails.bloodGroup || patientDetails[4]}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-xs font-semibold uppercase">Email</span>
              <span className="text-sm text-teal-300">{patientDetails.email || patientDetails[6]}</span>
              <span className="text-gray-400 text-xs font-semibold uppercase mt-2">Home Address</span>
              <span className="text-sm text-gray-200">{patientDetails.homeAddress || patientDetails[5]}</span>
              <span className="text-gray-400 text-xs font-semibold uppercase mt-2">HH Number</span>
              <span className="text-sm font-bold text-yellow-400 font-mono">{patient_Number}</span>
              <span className="text-gray-400 text-xs font-semibold uppercase mt-2">Access Status</span>
              <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span> Blockchain Verified
              </span>
            </div>
          </div>
        ) : null}

        {!permissionDenied && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            <button
              onClick={handleViewRecords}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-xs text-white transition shadow"
            >
              View Records
            </button>
            <button
              onClick={handleViewPrescriptions}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-xs text-white transition shadow"
            >
              Prescriptions
            </button>
            <button
              onClick={handlePrescription}
              className="px-4 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl font-bold text-xs text-white transition shadow"
            >
              Write Prescription
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-xs text-white transition shadow"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Modal for Records List */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full border border-teal-500/40 flex flex-col items-center">
            <h2 className="text-xl font-bold text-teal-300 mb-4">Patient Past Medical Records</h2>
            {records.length > 0 ? (
              <ul className="w-full space-y-3 mb-4 max-h-60 overflow-y-auto">
                {records.map((rec, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3 border border-gray-700"
                  >
                    <span className="text-teal-200 text-sm font-semibold truncate max-w-xs">
                      {rec.fileName || rec.ipfsHash}
                    </span>
                    <button
                      onClick={() => handleOpenDocument(rec.ipfsHash)}
                      className="ml-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-xs text-white transition"
                    >
                      View on IPFS
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm mb-4">No records found for this patient.</p>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-bold text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Prescriptions List */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full border border-purple-500/40 flex flex-col items-center">
            <h2 className="text-xl font-bold text-purple-300 mb-4">Patient Prescription History</h2>
            {prescriptionLoading ? (
              <p className="text-gray-400 text-sm mb-4">Loading prescriptions...</p>
            ) : prescriptions.length > 0 ? (
              <ul className="w-full space-y-3 mb-4 max-h-60 overflow-y-auto">
                {prescriptions.map((pres, idx) => (
                  <li key={idx} className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex flex-col gap-1">
                    <span className="text-teal-300 font-bold text-base">{pres.title}</span>
                    <span className="text-gray-300 text-xs">{pres.description}</span>
                    <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                      <span>Doctor: {pres.doctorNumber}</span>
                      <span>Date: {pres.date}</span>
                    </div>
                    {pres.ipfsHash && (
                      <button
                        onClick={() => handleOpenDocument(pres.ipfsHash)}
                        className="mt-2 self-start text-xs text-blue-400 hover:underline"
                      >
                        📄 View Attached PDF
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm mb-4">No prescriptions found for this patient.</p>
            )}
            <button
              onClick={() => setShowPrescriptionModal(false)}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-bold text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorViewPatient;
