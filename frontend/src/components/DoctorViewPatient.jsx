import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";


const DoctorViewPatient = () => {

  const backend_url = import.meta.env.VITE_BACKEND_URL;



  const { web3, account, contract } = useContext(Web3Context);
  const { hhNumber, patient_Number } = useParams();
  console.log("hhNumber:", hhNumber);
  console.log("patient_Number:", patient_Number);
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);
  const [UserContract, setUserContract] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!web3 || !contract || !hhNumber || !patient_Number) {
        setError(
          "Web3 or contract not loaded or hhNumber/patient_name is missing."
        );
        setLoading(false);
        return;
      }
      try {
        setAddress(account);
        setUserContract(contract.patient);
        const result = await contract.patient.methods
          .getPatientDetails(patient_Number)
          .call();
        setPatientDetails(result);
        setError(null);
      } catch (error) {
        setError("Error retrieving patient details");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [web3, contract, hhNumber, patient_Number, account]);

  const handleViewRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backend_url}/api/records/${patient_Number}`);
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
      const response = await fetch(`${backend_url}/api/prescriptions/${patient_Number}`);
      if (!response.ok) throw new Error('Failed to fetch prescriptions');
      const data = await response.json();
      setPrescriptions(data);
      setShowPrescriptionModal(true);
    } catch (err) {
      setPrescriptionError('Error retrieving prescriptions');
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
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
       <div className="absolute top-8 right-10 z-30 animate-fade-in">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:from-gray-900 hover:to-black transition-all duration-200 border border-gray-400/30"
          >
            Logout
          </button>
        </div>
        <img
          src= "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          alt="Healthcare Dashboard"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90 z-0"
          style={{ filter: 'blur(0.5px) brightness(0.95)' }}
        />
      <div className="w-full max-w-2xl bg-gray-900 bg-opacity-90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in">

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-teal-300 drop-shadow">
          Patient Details
        </h1>
        {loading ? (
          <div className="text-teal-300 text-lg font-semibold flex items-center gap-2 mb-6">
            <svg
              className="animate-spin h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Loading patient details...
          </div>
        ) : error ? (
          <p className="text-red-500 text-lg font-semibold mb-4 flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </p>
        ) : patientDetails ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Name
              </span>
              <span className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                {patientDetails[1]}
              </span>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                DOB
              </span>
              <span className="text-lg text-white">{patientDetails[2]}</span>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Gender
              </span>
              <span className="text-lg text-white">{patientDetails[3]}</span>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Blood Group
              </span>
              <span className="text-lg text-white">{patientDetails[4]}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Email
              </span>
              <span className="text-lg text-teal-300 font-semibold">
                {patientDetails[5]}
              </span>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Home Address
              </span>
              <span className="text-lg text-teal-200 font-semibold">
                {patientDetails[6]}
              </span>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                HH Number
              </span>
              <span className="text-lg text-yellow-400 font-semibold">
                {patient_Number}
              </span>
            </div>
          </div>
        ) : null}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
          <button
            onClick={handleViewRecords}
            className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold text-white transition-all duration-150 shadow"
          >
            View Records
          </button>
          <button
            onClick={handleViewPrescriptions}
            className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-bold text-white transition-all duration-150 shadow"
          >
            Past Prescriptions
          </button>
          <button
            onClick={handlePrescription}
            className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-white transition-all duration-150 shadow"
          >
            Prescription Consultancy
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-white transition-all duration-150 shadow"
          >
            Close
          </button>
        </div>
      </div>
      {/* Modal for document list */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full animate-fade-in flex flex-col items-center">
            <h2 className="text-2xl font-bold text-teal-300 mb-4">
              Patient Past Medical Records
            </h2>
            {records.length > 0 ? (
              <ul className="w-full space-y-4 mb-4">
                {records.map((rec, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3 shadow hover:bg-gray-700 transition cursor-pointer"
                  >
                    <span className="text-teal-200 font-semibold truncate max-w-xs">
                      {rec.fileName || rec.ipfsHash}
                    </span>
                    <button
                      onClick={() => handleOpenDocument(rec.ipfsHash)}
                      className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded font-bold text-white transition-all duration-150"
                    >
                      Open
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">No documents found.</p>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-white transition-all duration-150"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Modal for prescription list */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full animate-fade-in flex flex-col items-center">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">Patient Prescriptions</h2>
            {prescriptionLoading ? (
              <div className="text-purple-300 text-lg font-semibold flex items-center gap-2 mb-6">
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Loading prescriptions...
              </div>
            ) : prescriptionError ? (
              <p className="text-red-500 text-lg font-semibold mb-4 flex items-center gap-2">
                <span>⚠️</span>
                {prescriptionError}
              </p>
            ) : prescriptions.length > 0 ? (
              <ul className="w-full space-y-4 mb-4">
                {prescriptions.map((pres, idx) => (
                  <li key={idx} className="bg-gray-800 rounded-lg px-4 py-3 shadow flex flex-col gap-1">
                    <span className="text-teal-200 font-bold text-lg">{pres.title}</span>
                    <span className="text-gray-300 text-sm">{pres.description}</span>
                    <span className="text-xs text-gray-400">Doctor: <span className="font-semibold text-purple-300">{pres.doctorNumber}</span></span>
                    <span className="text-xs text-gray-400">Date: <span className="font-semibold text-yellow-300">{pres.date}</span></span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">No prescriptions found.</p>
            )}
            <button
              onClick={() => setShowPrescriptionModal(false)}
              className="mt-2 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-white transition-all duration-150"
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
