import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";

const DoctorDashBoard = () => {
  const { web3, account, contract, network } = React.useContext(Web3Context);
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [DoctorContract, setDoctorContract] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // For buffing animation

  const viewPatientList = () => {
    navigate("/doctor/" + hhNumber + "/patientlist");
  };

  const viewDoctorProfile = () => {
    navigate("/doctor/" + hhNumber + "/viewdoctorprofile");
  };

  useEffect(() => {
    const init = async () => {
      if (!web3 || !account || !contract) {
        alert("Web3 or contract not initialized");
        setLoading(false);
        return;
      } else {
        try {
          const result = await contract.doctor.methods
            .getDoctorDetails(hhNumber)
            .call();
          setDoctorContract(contract.doctor);
          setDoctorDetails(result);
        } catch (err) {
          console.error("Error fetching doctor details:", err);
          setError("Failed to fetch doctor details");
        }
        setLoading(false);
      }
    };
    init();
  }, [hhNumber]);

  const handleLogout = () => {
    navigate("/home");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black to-gray-800 font-mono text-white flex flex-col items-center justify-center">
      {/* Logout Button */}
      <div className="absolute top-8 right-10 z-30 animate-fade-in">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:from-gray-900 hover:to-black transition-all duration-200 border border-gray-400/30"
        >
          Logout
        </button>
      </div>
      

      {/* Buffing Animation */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-teal-400 mb-6"></div>
          <div className="text-xl text-teal-300 font-bold animate-pulse">Loading Doctor Dashboard...</div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-gray-900/90 p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in-up border border-teal-400/30">
          <h2 className="text-4xl font-extrabold text-center text-teal-400 mb-6 drop-shadow animate-bounce">
            Doctor Dashboard
          </h2>
          {doctorDetails && (
            <p className="text-2xl mb-12 animate-fade-in">
              Welcome{" "}
              <span className="font-bold text-yellow-400 drop-shadow-lg">
                {doctorDetails[1]}!
              </span>
            </p>
          )}
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
            <button
              onClick={viewDoctorProfile}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:from-teal-600 hover:to-blue-600 transition-all duration-300 animate-pulse"
            >
              View Profile
            </button>
            <button
              onClick={viewPatientList}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:from-pink-600 hover:to-yellow-500 transition-all duration-300 animate-pulse"
            >
              View Patient List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashBoard;