import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import DashboardHeader from "./DashboardHeader";
import toast, { Toaster } from "react-hot-toast";

const DoctorDashBoard = () => {
  const { web3, account, contract } = useContext(Web3Context);
  const { hhNumber } = useParams();
  const navigate = useNavigate();

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!contract || !contract.doctor || !hhNumber) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const result = await contract.doctor.methods.getDoctorDetails(hhNumber).call();
        setDoctorDetails(result);
        setError(null);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
        setError("Could not retrieve doctor credentials from smart contract.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [contract, hhNumber]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      <DashboardHeader portalTitle="Doctor Portal" roleBadge="Doctor" />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[22rem] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-12 flex flex-col items-center">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-teal-400">
            <div className="w-12 h-12 border-3 border-teal-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-300">Synchronizing Practitioner Session...</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Header / Intro */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-3 border border-blue-500/20">
                <span>👨‍⚕️ Licensed Medical Practitioner</span>
                <span>•</span>
                <span className="font-mono">HH #{hhNumber}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                  {doctorDetails?._doctorName || doctorDetails?.[1] || "Doctor"}
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                {doctorDetails?._hospitalName || doctorDetails?.[2] || "Clinical Facility"} • Access authorized patient charts, review medical histories, and issue prescriptions.
              </p>
            </div>

            {error && (
              <div className="w-full p-4 mb-6 rounded-2xl bg-red-900/30 border border-red-500/40 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <button
                onClick={() => navigate(`/doctor/${hhNumber}/viewdoctorprofile`)}
                className="group p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 transition-all duration-300 shadow-xl flex flex-col items-start text-left hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <span className="p-3.5 rounded-2xl bg-teal-500/10 text-2xl mb-4 border border-teal-500/20 group-hover:scale-110 transition-transform">
                  👨‍⚕️
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                  Practitioner Profile
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Review your blockchain medical credentials, specialization, affiliated hospital, and department records.
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <span>→</span>
                </div>
              </button>

              <button
                onClick={() => navigate(`/doctor/${hhNumber}/patientlist`)}
                className="group p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all duration-300 shadow-xl flex flex-col items-start text-left hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span className="p-3.5 rounded-2xl bg-cyan-500/10 text-2xl mb-4 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  📋
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Patient Roster
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Look up registered patients, verify active consent permissions, inspect diagnostic reports, and issue digital prescriptions.
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Roster</span>
                  <span>→</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashBoard;