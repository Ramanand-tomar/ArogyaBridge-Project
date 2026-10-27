import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import DashboardHeader from "./DashboardHeader";
import toast, { Toaster } from "react-hot-toast";

const PatientDashBoard = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const { hhNumber } = useParams();
  const { web3, account, contract } = useContext(Web3Context);
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [doctorName, setDoctorName] = useState(null);

  // Fetch patient profile details from smart contract
  useEffect(() => {
    const loadPatientDetails = async () => {
      if (!contract || !contract.patient || !hhNumber) {
        setLoadingPatient(false);
        return;
      }
      try {
        setLoadingPatient(true);
        const details = await contract.patient.methods.getPatientDetails(hhNumber).call();
        setPatientDetails(details);
      } catch (err) {
        console.warn("Could not retrieve patient details from blockchain:", err);
      } finally {
        setLoadingPatient(false);
      }
    };
    loadPatientDetails();
  }, [contract, hhNumber]);

  // Fetch prescriptions
  const handlePrescriptionDetails = async () => {
    try {
      setShowPrescriptionModal(true);
      setPrescriptionLoading(true);
      const response = await fetch(`${backend_url}/api/prescriptions/${hhNumber}`);
      if (!response.ok) throw new Error("Failed to fetch prescriptions");
      const data = await response.json();
      setPrescriptions(data || []);

      const doctorNumber = data[0]?.doctorNumber;
      if (doctorNumber && contract?.doctor) {
        try {
          const doc = await contract.doctor.methods.getDoctorDetails(doctorNumber).call();
          setDoctorName(doc._doctorName || doc[1] || "Dr. Medical Specialist");
        } catch {
          setDoctorName("Licensed Medical Practitioner");
        }
      }
    } catch (err) {
      console.error("Prescriptions load error:", err);
      setPrescriptions([]);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  const actionCards = [
    {
      title: "View Medical Profile",
      description: "Inspect on-chain demographic identity, blood group, and contact records.",
      icon: "👤",
      badge: "Identity",
      onClick: () => setShowProfileModal(true),
    },
    {
      title: "View Medical Records",
      description: "Browse and download encrypted health records stored on the IPFS network.",
      icon: "📁",
      badge: "IPFS Files",
      onClick: () => navigate(`/patient/${hhNumber}/viewrecords`),
    },
    {
      title: "Upload Past Records",
      description: "Securely pin lab reports, discharge summaries, and radiology files to IPFS.",
      icon: "📤",
      badge: "Upload",
      onClick: () => navigate(`/patient/${hhNumber}/uploadrecords`),
    },
    {
      title: "Grant Permission",
      description: "Authorize or revoke specific doctor viewing privileges via smart contracts.",
      icon: "🔑",
      badge: "Consent",
      onClick: () => navigate(`/patient/${hhNumber}/grantpermission`),
    },
    {
      title: "Prescription Details",
      description: "Access official digital prescriptions, medications, and clinical directions.",
      icon: "💊",
      badge: "Clinical",
      onClick: handlePrescriptionDetails,
    },
    {
      title: "Diagnostic Center Reports",
      description: "View lab diagnostic findings, pathology evaluations, and test summaries.",
      icon: "🔬",
      badge: "Diagnostics",
      onClick: () => navigate(`/patient/${hhNumber}/diagnosticreport`),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      <DashboardHeader portalTitle="Patient Portal" roleBadge="Patient" />

      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[45rem] h-[25rem] bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[20rem] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-10 flex flex-col items-center">
        {/* Welcome Banner */}
        <div className="w-full text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold mb-3 border border-teal-500/20">
            <span>🛡️ Decentralized Patient Portal</span>
            <span>•</span>
            <span className="font-mono">HH #{hhNumber}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              {patientDetails?.name || "Patient"}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Manage your sovereign electronic health records, grant doctor consent, and review clinical prescriptions.
          </p>
        </div>

        {/* Action Grid (CSS Grid: 1-col on mobile, 2-col on tablet, 3-col on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {actionCards.map((card, idx) => (
            <button
              key={idx}
              onClick={card.onClick}
              className="group relative flex flex-col items-start p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-800/80 transition-all duration-300 shadow-xl hover:-translate-y-1 text-left focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              <div className="flex items-center justify-between w-full mb-4">
                <span className="p-3 rounded-xl bg-teal-500/10 text-2xl border border-teal-500/20 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-300">
                  {card.icon}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 group-hover:text-teal-300 group-hover:bg-slate-700 transition">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {card.description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition-transform">
                <span>Access Feature</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Patient Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="p-3 rounded-2xl bg-teal-500/10 text-2xl border border-teal-500/20">👤</span>
              <div>
                <h2 className="text-xl font-bold text-white">Patient Profile</h2>
                <p className="text-xs text-slate-400 font-mono">HH Number: {hhNumber}</p>
              </div>
            </div>

            {loadingPatient ? (
              <div className="py-12 flex justify-center items-center gap-2 text-teal-400 text-sm">
                <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                Loading on-chain credentials...
              </div>
            ) : patientDetails ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Full Name</span>
                  <span className="font-bold text-white text-base mt-0.5 block">{patientDetails.name}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Date of Birth</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{patientDetails.dateOfBirth}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Gender</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{patientDetails.gender}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-medium">Blood Group</span>
                  <span className="font-bold text-rose-400 mt-0.5 block">{patientDetails.bloodGroup}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 sm:col-span-2">
                  <span className="text-xs text-slate-400 block font-medium">Email Address</span>
                  <span className="text-teal-300 font-medium mt-0.5 block">{patientDetails.email}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 sm:col-span-2">
                  <span className="text-xs text-slate-400 block font-medium">Home Address</span>
                  <span className="text-slate-300 mt-0.5 block">{patientDetails.homeAddress}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 bg-slate-800/30 rounded-2xl border border-slate-800">
                Patient identity details could not be retrieved from the blockchain contract.
              </div>
            )}

            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Prescription Details Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowPrescriptionModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="p-3 rounded-2xl bg-teal-500/10 text-2xl border border-teal-500/20">💊</span>
              <div>
                <h2 className="text-xl font-bold text-white">Clinical Prescriptions</h2>
                <p className="text-xs text-slate-400">Authenticated doctor directives</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {prescriptionLoading ? (
                <div className="py-12 flex justify-center items-center gap-2 text-teal-400 text-sm">
                  <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                  Fetching prescriptions...
                </div>
              ) : prescriptions.length > 0 ? (
                prescriptions.map((pres, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-800/60 border border-slate-800 flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="font-bold text-teal-300 text-base">{pres.title}</h4>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700">
                        {pres.date || "Recorded"}
                      </span>
                    </div>

                    <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                      {pres.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800 flex flex-wrap justify-between items-center text-xs text-slate-400 gap-2">
                      <span>Doctor HH: <span className="font-mono text-slate-300">{pres.doctorNumber}</span></span>
                      {doctorName && <span>Prescribed By: <span className="text-teal-300 font-semibold">{doctorName}</span></span>}
                      {pres.ipfsHash && (
                        <a
                          href={`https://ipfs.io/ipfs/${pres.ipfsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                        >
                          View Electronic File ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-800/30 rounded-2xl border border-slate-800 text-sm">
                  No prescriptions found for this patient ID.
                </div>
              )}
            </div>

            <button
              onClick={() => setShowPrescriptionModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashBoard;
