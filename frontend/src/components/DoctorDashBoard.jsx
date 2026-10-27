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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative selection:bg-teal-100 selection:text-teal-900">
      <Toaster position="top-right" reverseOrder={false} />
      <DashboardHeader portalTitle="Doctor Portal" roleBadge="Doctor" />

      {/* Subtle ambient light glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[22rem] bg-blue-100/50 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-12 flex flex-col items-center">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-teal-700">
            <div className="w-12 h-12 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-700">Synchronizing Practitioner Session...</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Header / Intro */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-3 border border-blue-200">
                <span>👨‍⚕️ Licensed Medical Practitioner</span>
                <span>•</span>
                <span className="font-mono">HH #{hhNumber}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Welcome,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-blue-700">
                  {doctorDetails?._doctorName || doctorDetails?.[1] || "Doctor"}
                </span>
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                {doctorDetails?._hospitalName || doctorDetails?.[2] || "Clinical Facility"} • Access authorized patient charts, review medical histories, and issue prescriptions.
              </p>
            </div>

            {error && (
              <div className="w-full p-4 mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {error}
              </div>
            )}

            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <button
                onClick={() => navigate(`/doctor/${hhNumber}/viewdoctorprofile`)}
                className="group p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col items-start text-left hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <span className="p-3.5 rounded-2xl bg-teal-50 text-2xl mb-4 border border-teal-200 text-teal-700 group-hover:scale-110 group-hover:bg-teal-100 transition-transform">
                  👨‍⚕️
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  Practitioner Profile
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Review your blockchain medical credentials, specialization, affiliated hospital, and department records.
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-teal-700 group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <span>→</span>
                </div>
              </button>

              <button
                onClick={() => navigate(`/doctor/${hhNumber}/patientlist`)}
                className="group p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col items-start text-left hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="p-3.5 rounded-2xl bg-blue-50 text-2xl mb-4 border border-blue-200 text-blue-700 group-hover:scale-110 group-hover:bg-blue-100 transition-transform">
                  📋
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Patient Roster
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Look up registered patients, verify active consent permissions, inspect diagnostic reports, and issue digital prescriptions.
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-blue-700 group-hover:translate-x-1 transition-transform">
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