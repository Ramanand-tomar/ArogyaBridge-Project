import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";

const DiagnosticDashBoard = () => {
  const { web3, account, contract } = React.useContext(Web3Context);

  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [UserContract, setUserContract] = useState(null);
  const [diagnosticDetails, setDiagnosticDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const diagnosticUpload = () => {
    navigate("/diagnosis/" + hhNumber + "/diagnosisform");
  };

  const viewDiagnosticProfile = () => {
    setShowProfile(true);
  };
  const closeProfile = () => {
    setShowProfile(false);
  };

  useEffect(() => {
    const init = async () => {
      if (!web3 || !contract || !hhNumber) {
        console.error("Web3 or contract not loaded or hhNumber is missing.");
        alert("Web3 or contract not loaded or hhNumber is missing.");
        setLoading(false);
        return;
      }
      try {
        setUserContract(contract.diagnosis);
        const result = await contract.diagnosis.methods
          .getDiagnosticDetails(hhNumber)
          .call();
        setDiagnosticDetails(result);
      } catch (error) {
        console.error("Error retrieving diagnostic details:", error);
        setError("Error retrieving diagnostic details");
      }
      setLoading(false);
    };

    init();
  }, [hhNumber, web3, contract]);

  const handleLogout = () => {
    navigate("/home");
  };

  return (
    <div>
      <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white min-h-screen flex flex-col justify-center items-center relative">
        {/* Logout Button */}
        <div className="absolute top-8 right-10 z-30 animate-fade-in">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:from-gray-900 hover:to-black transition-all duration-200 border border-gray-400/30"
          >
            Logout
          </button>
        </div>
        

        {/* Loading Animation */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-teal-400 mb-6"></div>
            <div className="text-xl text-teal-300 font-bold animate-pulse">Loading Diagnostic Dashboard...</div>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-gray-900/90 p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in-up border border-teal-400/30">
            <h2 className="text-4xl font-extrabold text-center text-pink-400 mb-6 drop-shadow animate-bounce">
              Diagnostic Dashboard
            </h2>
            {diagnosticDetails && (
              <p className="text-2xl mb-12 animate-fade-in">
                Welcome{" "}
                <span className="font-bold text-yellow-400 drop-shadow-lg">
                  {diagnosticDetails[1]}!
                </span>
              </p>
            )}
            {error && (
              <div className="text-red-500 mb-4">{error}</div>
            )}
            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
              <button
                onClick={viewDiagnosticProfile}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:from-teal-600 hover:to-blue-600 transition-all duration-300 animate-pulse"
              >
                View Profile
              </button>
              <button
                onClick={diagnosticUpload}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:from-pink-600 hover:to-yellow-500 transition-all duration-300 animate-pulse"
              >
                Create Report
              </button>
            </div>
          </div>
        )}

        {/* Modal for Diagnosis Centre Profile */}
        {showProfile && diagnosticDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full animate-fade-in flex flex-col items-center border border-teal-400/40">
              <h2 className="text-2xl font-bold text-teal-300 mb-4 animate-bounce">Diagnosis Centre Profile</h2>
              <div className="w-full grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Name</span>
                  <span className="text-lg font-bold text-yellow-400">{diagnosticDetails[1]}</span>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Email</span>
                  <span className="text-lg text-teal-300 font-semibold">{diagnosticDetails[2]}</span>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Address</span>
                  <span className="text-lg text-teal-200 font-semibold">{diagnosticDetails[3]}</span>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Contact</span>
                  <span className="text-lg text-white font-semibold">{diagnosticDetails[4]}</span>
                  {/* Add more fields as needed */}
                </div>
              </div>
              <button
                onClick={closeProfile}
                className="mt-2 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-white transition-all duration-150"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticDashBoard;