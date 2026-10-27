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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative selection:bg-teal-100 selection:text-teal-900">
      <Toaster position="top-right" reverseOrder={false} />
      <DashboardHeader portalTitle="Patient Portal" roleBadge="Patient" />

      {/* Subtle ambient light glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[45rem] h-[25rem] bg-teal-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[20rem] bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-10 flex flex-col items-center">
        {/* Welcome Banner */}
        <div className="w-full text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-3 border border-teal-200">
            <span>🛡️ Decentralized Patient Portal</span>
            <span>•</span>
            <span className="font-mono">HH #{hhNumber}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-cyan-700">
              {patientDetails?.name || "Patient"}
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Manage your sovereign electronic health records, grant doctor consent, and review clinical prescriptions.
          </p>
        </div>

        {/* Action Grid (CSS Grid: 1-col on mobile, 2-col on tablet, 3-col on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {actionCards.map((card, idx) => (
            <button
              key={idx}
              onClick={card.onClick}
              className="group relative flex flex-col items-start p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all duration-200 shadow-sm hover:-translate-y-0.5 text-left focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <div className="flex items-center justify-between w-full mb-4">
                <span className="p-3 rounded-xl bg-teal-50 text-2xl border border-teal-200 text-teal-700 group-hover:scale-110 group-hover:bg-teal-100 transition-all duration-200">
                  {card.icon}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:text-teal-800 group-hover:bg-teal-50 transition">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {card.description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-700 group-hover:translate-x-1 transition-transform">
                <span>Access Feature</span>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Patient Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 relative">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm transition"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="p-3 rounded-2xl bg-teal-50 text-2xl border border-teal-200 text-teal-700">👤</span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Patient Profile</h2>
                <p className="text-xs text-slate-500 font-mono">HH Number: {hhNumber}</p>
              </div>
            </div>

            {loadingPatient ? (
              <div className="py-12 flex justify-center items-center gap-2 text-teal-700 text-sm">
                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                Loading on-chain credentials...
              </div>
            ) : patientDetails ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block font-medium">Full Name</span>
                  <span className="font-bold text-slate-900 text-base mt-0.5 block">{patientDetails.name}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block font-medium">Date of Birth</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">{patientDetails.dateOfBirth}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block font-medium">Gender</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">{patientDetails.gender}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 block font-medium">Blood Group</span>
                  <span className="font-bold text-rose-600 mt-0.5 block">{patientDetails.bloodGroup}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-xs text-slate-500 block font-medium">Email Address</span>
                  <span className="text-teal-700 font-medium mt-0.5 block">{patientDetails.email}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-xs text-slate-500 block font-medium">Home Address</span>
                  <span className="text-slate-700 mt-0.5 block">{patientDetails.homeAddress}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-sm">
                Patient identity details could not be retrieved from the blockchain contract.
              </div>
            )}

            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* Prescription Details Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setShowPrescriptionModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm transition"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="p-3 rounded-2xl bg-teal-50 text-2xl border border-teal-200 text-teal-700">💊</span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Clinical Prescriptions</h2>
                <p className="text-xs text-slate-500">Authenticated doctor directives</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {prescriptionLoading ? (
                <div className="py-12 flex justify-center items-center gap-2 text-teal-700 text-sm">
                  <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  Fetching prescriptions...
                </div>
              ) : prescriptions.length > 0 ? (
                prescriptions.map((pres, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="font-bold text-teal-800 text-base">{pres.title}</h4>
                      <span className="text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {pres.date || "Recorded"}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                      {pres.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-2">
                      <span>Doctor HH: <span className="font-mono font-semibold text-slate-700">{pres.doctorNumber}</span></span>
                      {doctorName && <span>Prescribed By: <span className="text-teal-700 font-semibold">{doctorName}</span></span>}
                      {pres.ipfsHash && (
                        <a
                          href={`https://ipfs.io/ipfs/${pres.ipfsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                        >
                          View Electronic File ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 text-sm">
                  No prescriptions found for this patient ID.
                </div>
              )}
            </div>

            <button
              onClick={() => setShowPrescriptionModal(false)}
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

export default PatientDashBoard;
