import React, { useEffect, useState, useContext } from "react";
import Web3 from "web3";
import { useParams, useNavigate, Await } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";

const PatientDashBoard = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const { hhNumber } = useParams(); // Retrieve the hhNumber from the URL parameter

  const { web3, account, contract, network } = useContext(Web3Context);

  const Navigate = useNavigate();

  const viewRecord = () => {
    Navigate("/patient/" + hhNumber + "/viewrecords");
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  const viewprofile = () => {
    setShowProfileModal(true);
  };
  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const UploadRecords = () => {
    Navigate("/patient/" + hhNumber + "/uploadrecords");
  };
  const GrantPermission = () => {
    Navigate("/patient/" + hhNumber + "/grantpermission");
  };

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  const handlePrescriptionDetails = async () => {
    try {
      setShowPrescriptionModal(true);
      const response = await fetch(
        `${backend_url}/api/prescriptions/${hhNumber}`
      );
      if (!response.ok) throw new Error("Failed to fetch prescriptions");
      const data = await response.json();
      setPrescriptions(data || []);

      const doctorNumber = data[0]?.doctorNumber; // get doctorNumber directly
      if (doctorNumber) {
        const DoctorNo = await contract.doctor.methods
          .getDoctorDetails(doctorNumber)
          .call();
        setDoctorName(DoctorNo[1]);
        setDoctorHHNumber(doctorNumber);
      } else {
        console.warn("No doctor number found in prescription");
        setDoctorName("Unknown");
      }
    } catch (err) {
      console.error(err);
      setPrescriptions([]);
    }
  };

  const [PatientContract, setPatientContract] = useState(null);
  const [patientPhoneNo, setPatientPhoneNo] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);
  const [DoctorHHNumber, setDoctorHHNumber] = useState(null);
  const [DoctorName, setDoctorName] = useState(null);

  useEffect(() => {
    const loadPatientContract = async () => {
      if (!web3 || !contract || !hhNumber) {
        alert("Web3 or contract not loaded or hhNumber is missing.");
        return;
      }
      try {
        const patientContract = contract.patient; // Assuming contract.patient is the Patient contract
        console.log("Patient Contract: ", patientContract);
        setPatientContract(patientContract);

        // Fetch patient details
        const details = await patientContract.methods
          .getPatientDetails(hhNumber)
          .call();

        console.log("Patient Details: ", details);
        setPatientDetails(details); // patient profile details
      } catch (err) {
        console.error("Error loading patient contract:", err);
        alert("Failed to load patient details. Please try again later.");
      }
    };
    loadPatientContract();
  }, [contract, web3, hhNumber]);

  // Logout handler
  const handleLogout = () => {
    // Optionally clear any local/session storage or context here
    // localStorage.clear();
    // sessionStorage.clear();
    Navigate("/home");
  };

  return (
    <div>
      {/* <NavBar_Logout /> */}
      <div
        className="relative bg-gradient-to-b from-black to-gray-800 p-0 font-mono text-white min-h-screen flex flex-col justify-center items-center overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {/* Top-right Logout Button */}
        <div className="absolute top-8 right-10 z-30 animate-fade-in">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:from-gray-900 hover:to-black transition-all duration-200 border border-gray-400/30"
          >
            Logout
          </button>
        </div>
        {/* Background Image for Modern UI */}
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          alt="Healthcare Dashboard"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90 z-0"
          style={{ filter: "blur(0.5px) brightness(0.95)" }}
        />
        {/* Overlay for glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-teal-900/60 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full min-h-screen">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-12 px-6">
            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col items-center animate-fade-in border border-teal-400/30">
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-teal-300 drop-shadow-lg tracking-tight text-center">
                Patient Dashboard
              </h2>
              {patientDetails && (
                <p className="text-2xl sm:text-3xl mb-10 text-white text-center font-semibold">
                  Welcome{" "}
                  <span className="font-bold text-yellow-400">
                    {patientDetails.name}!
                  </span>
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-6 w-full mt-2">
                <button
                  onClick={viewprofile}
                  className="my-2 px-6 sm:px-10 py-5 w-full sm:w-1/4 rounded-xl bg-gradient-to-r from-pink-400 to-teal-400 text-gray-900 font-bold text-lg shadow-lg hover:from-pink-500 hover:to-teal-500 transition-all duration-200 border border-pink-200/30"
                >
                  View Profile
                </button>
                <button
                  onClick={viewRecord}
                  className="my-2 px-6 sm:px-10 py-5 w-full sm:w-1/4 rounded-xl bg-gradient-to-r from-teal-400 to-blue-400 text-gray-900 font-bold text-lg shadow-lg hover:from-teal-500 hover:to-blue-500 transition-all duration-200 border border-teal-200/30"
                >
                  View Record
                </button>
                <button
                  onClick={UploadRecords}
                  className="my-2 px-6 sm:px-10 py-5 w-full sm:w-1/4 rounded-xl bg-gradient-to-r from-yellow-400 to-pink-400 text-gray-900 font-bold text-lg shadow-lg hover:from-yellow-500 hover:to-pink-500 transition-all duration-200 border border-yellow-200/30"
                >
                  Upload Past Records
                </button>
                <button
                  onClick={GrantPermission}
                  className="my-2 px-6 sm:px-10 py-5 w-full sm:w-1/4 rounded-xl bg-gradient-to-r from-blue-400 to-teal-400 text-gray-900 font-bold text-lg shadow-lg hover:from-blue-500 hover:to-teal-500 transition-all duration-200 border border-blue-200/30"
                >
                  Grant Permission
                </button>
                <button
                  onClick={handlePrescriptionDetails}
                  className="my-2 px-6 sm:px-10 py-5 w-full sm:w-1/4 rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-gray-900 font-bold text-lg shadow-lg hover:from-green-500 hover:to-blue-500 transition-all duration-200 border border-green-200/30"
                >
                  Prescription Details
                </button>
                <button
                  onClick={() =>
                    Navigate("/patient/" + hhNumber + "/diagnosticreport")
                  }
                  className="my-2 px-6 sm:px-10 py-5 w-full sm:w-1/4 rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-gray-900 font-bold text-lg shadow-lg hover:from-green-500 hover:to-blue-500 transition-all duration-200 border border-green-200/30"
                >
                  Diagnotic Centre Report
                </button>
              </div>
            </div>
          </div>
          {/* Patient Profile Modal */}
          {showProfileModal && patientDetails && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="w-full max-w-2xl bg-gray-900 bg-opacity-90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in relative">
                <button
                  onClick={closeProfileModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-pink-400 text-2xl font-bold focus:outline-none"
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="flex flex-col items-center mb-8">
                  <span className="bg-gradient-to-tr from-pink-400 to-teal-400 rounded-full p-4 mb-2 shadow-lg">
                    <svg
                      className="h-16 w-16 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                      />
                    </svg>
                  </span>
                  <h1 className="text-4xl font-extrabold mb-1 text-pink-300 drop-shadow">
                    Patient's Profile
                  </h1>
                  <p className="text-teal-200 text-center text-base mb-2">
                    Personal and medical details at a glance
                  </p>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      Name
                    </span>
                    <span className="text-xl font-bold text-pink-400 flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-pink-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {patientDetails.name}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      DOB
                    </span>
                    <span className="text-lg text-white">
                      {patientDetails.dateOfBirth}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      Gender
                    </span>
                    <span className="text-lg text-white">
                      {patientDetails.gender}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      Blood Group
                    </span>
                    <span className="text-lg text-white">
                      {patientDetails.bloodGroup}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      Address
                    </span>
                    <span className="text-lg text-teal-300 font-semibold">
                      {patientDetails.homeAddress}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      Email
                    </span>
                    <span className="text-lg text-teal-200 font-semibold">
                      {patientDetails.email}
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                  <span className="bg-gray-800 text-pink-400 px-4 py-2 rounded-full font-bold text-lg shadow">
                    HH Number: {hhNumber}
                  </span>
                  <button
                    onClick={closeProfileModal}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-pink-400 to-teal-400 text-gray-900 font-extrabold text-lg rounded-xl shadow-lg hover:from-pink-500 hover:to-teal-500 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Prescription Modal */}
          {showPrescriptionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="w-full max-w-2xl bg-gray-900 bg-opacity-95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in relative">
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-green-400 text-2xl font-bold focus:outline-none"
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-3xl font-extrabold mb-6 text-green-300 drop-shadow text-center">
                  Prescription Details
                </h2>
                {prescriptions.length > 0 ? (
                  <ul className="w-full space-y-4 mb-4">
                    {prescriptions.map((pres, idx) => (
                      <li
                        key={idx}
                        className="bg-gray-800 rounded-lg px-4 py-3 shadow flex flex-col gap-1"
                      >
                        <span className="text-lg font-bold text-green-300">
                          {pres.title}
                        </span>
                        <span className="text-white">{pres.description}</span>
                        <span className="text-sm text-gray-400">
                          Doctor Number: {pres.doctorNumber}
                        </span>
                        <span className="text-sm text-gray-400">
                          Doctor Name: {DoctorName}
                        </span>
                        <span className="text-sm text-gray-400">
                          Created At: {pres.date}
                        </span>
                        <a
                          href={`https://ipfs.io/ipfs/${pres.ipfsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 underline hover:text-blue-300 transition-colors duration-150 font-medium"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z"
                            />
                          </svg>
                          View Elctronic File
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300">No prescriptions found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashBoard;
