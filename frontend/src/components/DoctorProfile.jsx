import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import toast, { Toaster } from "react-hot-toast";

const DoctorProfile = () => {
  const { account, contract } = useContext(Web3Context);
  const { hhNumber } = useParams();
  const navigate = useNavigate();

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!contract || !contract.doctor || !hhNumber) {
        setError("Smart contract not loaded or Doctor ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const details = await contract.doctor.methods.getDoctorDetails(hhNumber).call();
        setDoctorDetails(details);
        setError(null);
      } catch (err) {
        console.error("Failed to load doctor profile:", err);
        setError("Failed to load doctor profile from blockchain.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [contract, hhNumber]);

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white relative">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-2xl bg-gray-900/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-teal-500/30">
        <button
          onClick={() => navigate(`/doctor/${hhNumber}`)}
          className="mb-6 px-5 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-xl shadow hover:from-teal-600 hover:to-blue-600 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-4xl shadow-lg mb-4">
            👨‍⚕️
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
            Doctor Profile
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Verified Healthcare Practitioner Credentials
          </p>
        </div>

        {loading ? (
          <div className="text-teal-300 text-center py-8 flex justify-center items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-400 border-t-transparent"></div>
            Loading credentials from blockchain...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/40 border border-red-500/50 rounded-xl text-red-200 text-sm mb-6">
            {error}
          </div>
        ) : doctorDetails ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 text-sm">
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Doctor Name</span>
                <p className="text-lg font-bold text-yellow-400">{doctorDetails._doctorName || doctorDetails[1]}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Hospital / Clinic</span>
                <p className="text-base text-white">{doctorDetails._hospitalName || doctorDetails[2]}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Specialization</span>
                <p className="text-base text-teal-300 font-semibold">{doctorDetails._specialization || doctorDetails[6]}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Department</span>
                <p className="text-base text-white">{doctorDetails._department || doctorDetails[7]}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Designation</span>
                <p className="text-base text-white">{doctorDetails._designation || doctorDetails[8]}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Work Experience</span>
                <p className="text-base text-white">{doctorDetails._workExperience || doctorDetails[9]}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Doctor HH Number</span>
                <p className="text-base font-bold text-yellow-400 font-mono">{hhNumber}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs font-semibold uppercase">Contact Email</span>
                <p className="text-base text-teal-300">{doctorDetails._email || doctorDetails[5]}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-800/30 rounded-2xl border border-gray-700/60 text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>Registered Wallet Address:</span>
              <span className="font-mono text-teal-400 break-all">
                {doctorDetails._walletAddress || doctorDetails[0]}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DoctorProfile;