import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import DashboardHeader from "./DashboardHeader";
import toast, { Toaster } from "react-hot-toast";

const DiagnosticDashBoard = () => {
  const { web3, account, contract } = useContext(Web3Context);
  const { hhNumber } = useParams();
  const navigate = useNavigate();

  const [diagnosticDetails, setDiagnosticDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!contract || !contract.diagnosis || !hhNumber) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const result = await contract.diagnosis.methods.getDiagnosticDetails(hhNumber).call();
        setDiagnosticDetails(result);
        setError(null);
      } catch (err) {
        console.error("Diagnostic details fetch error:", err);
        setError("Could not retrieve diagnostic center credentials from blockchain.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [hhNumber, contract]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative selection:bg-teal-100 selection:text-teal-900">
      <Toaster position="top-right" reverseOrder={false} />
      <DashboardHeader portalTitle="Diagnostic Center" roleBadge="Diagnostic Lab" />

      {/* Subtle ambient light glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[22rem] bg-teal-100/50 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-12 flex flex-col items-center">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-teal-700">
            <div className="w-12 h-12 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-700">Loading Diagnostic Center Portal...</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-semibold mb-3 border border-cyan-200">
                <span>🔬 Diagnostic Laboratory Facility</span>
                <span>•</span>
                <span className="font-mono">HH #{hhNumber}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Welcome,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-cyan-700">
                  {diagnosticDetails?._diagnosticName || diagnosticDetails?.[1] || "Diagnostic Lab"}
                </span>
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Generate laboratory evaluations, upload pathology & radiology findings to IPFS, and publish diagnostic attestations on-chain.
              </p>
            </div>

            {error && (
              <div className="w-full p-4 mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {error}
              </div>
            )}

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <button
                onClick={() => setShowProfile(true)}
                className="group p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-cyan-400 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col items-start text-left hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <span className="p-3.5 rounded-2xl bg-cyan-50 text-2xl mb-4 border border-cyan-200 text-cyan-700 group-hover:scale-110 group-hover:bg-cyan-100 transition-transform">
                  🏥
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  Facility Profile
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Inspect your registered diagnostic center facility credentials, operational address, and verification status.
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-cyan-700 group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <span>→</span>
                </div>
              </button>

              <button
                onClick={() => navigate(`/diagnosis/${hhNumber}/diagnosisform`)}
                className="group p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all duration-200 shadow-sm flex flex-col items-start text-left hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <span className="p-3.5 rounded-2xl bg-teal-50 text-2xl mb-4 border border-teal-200 text-teal-700 group-hover:scale-110 group-hover:bg-teal-100 transition-transform">
                  📝
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  Generate Lab Report
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Issue an official diagnostic report for a patient by uploading lab test documents to IPFS and anchoring the hash on-chain.
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-teal-700 group-hover:translate-x-1 transition-transform">
                  <span>Create Report</span>
                  <span>→</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Facility Profile Modal */}
      {showProfile && diagnosticDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 relative">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm transition"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="p-3 rounded-2xl bg-cyan-50 text-2xl border border-cyan-200 text-cyan-700">🏥</span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Diagnostic Facility Details</h2>
                <p className="text-xs text-slate-500 font-mono">HH Number: {hhNumber}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Facility / Lab Name</span>
                <span className="font-bold text-slate-900 text-base mt-0.5 block">
                  {diagnosticDetails._diagnosticName || diagnosticDetails[1]}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Email Contact</span>
                <span className="text-teal-700 font-medium mt-0.5 block">
                  {diagnosticDetails._email || diagnosticDetails[2]}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Physical Address</span>
                <span className="text-slate-700 mt-0.5 block">
                  {diagnosticDetails._homeAddress || diagnosticDetails[3]}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Contact Phone</span>
                <span className="text-slate-700 font-semibold mt-0.5 block">
                  {diagnosticDetails._contactNumber || diagnosticDetails[4] || "On File"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowProfile(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticDashBoard;