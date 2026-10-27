import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import DashboardHeader from "./DashboardHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const Admin_Panel = () => {
  const { web3, account, contract, network } = useContext(Web3Context);
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [prescriptionReports, setPrescriptionReports] = useState([]);
  const [diagnosisReports, setDiagnosisReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [LoginHistoryData, setLoginHistoryData] = useState([]);
  const [AllPatients, setAllPatients] = useState([]);
  const [AllDoctors, setAllDoctors] = useState([]);
  const [AllDiagnosis, setAllDiagnosis] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("arogya_auth_token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  // Fetch all data from backend
  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/AllUserReports`, getAuthHeaders());
      return res.data || [];
    } catch {
      return [];
    }
  };
  const fetchPrescriptionReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/prescription_reports`, getAuthHeaders());
      return res.data || [];
    } catch {
      return [];
    }
  };
  const fetchDiagnosisReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/diagnosisreport`, getAuthHeaders());
      return res.data || [];
    } catch {
      return [];
    }
  };
  const fetchUserReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/AllUserReports`, getAuthHeaders());
      return res.data || [];
    } catch {
      return [];
    }
  };

  const fetchLoginHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/login-history`, getAuthHeaders());
      return res.data || [];
    } catch {
      return [];
    }
  };
  useEffect(() => {
    const init = async () => {
      if (!web3 || !account || !contract || !network) {
        alert("Web3 or contract not initialized");
        setLoading(false);
        return;
      }
      try {
        const makePatientdata = (len, result) => {
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push({
              name: result.names[i],
              dateOfBirth: result.dateOfBirths[i],
              gender: result.genders[i],
              bloodGroup: result.bloodGroups[i],
              homeAddress: result.homeAddresses[i],
              email: result.emails[i],
              hhNumber: result.hhNumbers[i],
            });
          }
          return data;
        };
        const makeDoctorData = (len, result) => {
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push({
              name: result.doctorNames[i],
              dateOfBirth: result.dateOfBirths[i],
              gender: result.genders[i],
              hospitalName: result.hospitalNames[i],
              specialization: result.specializations[i],
              department: result.departments[i],
              designation: result.designations[i],
              workExperience: result.workExperiences[i],
              email: result.emails[i],
              hhNumber: result.hhNumbers[i],
            });
          }
          return data;
        };
        const makeDiagnosticData = (len, result) => {
          const data = [];
          for (let i = 0; i < len; i++) {
            data.push({
              name: result.diagnosticNames[i],
              hospitalName: result.hospitalNames[i],
              location: result.diagnosticLocations[i],
              email: result.emails[i],
              hhNumber: result.hhNumbers[i],
            });
          }
          return data;
        };
        let details = [];
        details = await contract.patient.methods.getAllPatients().call();
        setAllPatients(makePatientdata(details.hhNumbers.length, details));
        details = await contract.doctor.methods.getAllDoctors().call();
        setAllDoctors(makeDoctorData(details.hhNumbers.length, details));
        details = await contract.diagnosis.methods.getAllDiagnostics().call();
        setAllDiagnosis(makeDiagnosticData(details.hhNumbers.length, details));
      } catch (error) {
        console.error("Error occured due to contact functions:", error);
      }
    };
    init();
  }, [web3, account, contract, network]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [p, pr, dr, ur, l] = await Promise.all([
          fetchPatients(),
          fetchPrescriptionReports(),
          fetchDiagnosisReports(),
          fetchUserReports(),
          fetchLoginHistory(),
        ]);
        setPatients(p);
        setPrescriptionReports(pr);
        setDiagnosisReports(dr);
        setUserReports(ur);
        setLoginHistoryData(l);
      } catch (err) {}
      setLoading(false);
    };
    loadData();
  }, []);

  const summaryData = [
    { name: "Patients", value: AllPatients.length },
    { name: "Doctors", value: AllDoctors.length },
    { name: "Diagnosis Centers", value: AllDiagnosis.length },
    { name: "Prescriptions", value: prescriptionReports.length },
    { name: "Diagnosis Reports", value: diagnosisReports.length },
    { name: "User Logins", value: LoginHistoryData.length },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const adminMetrics = [
    { label: "IPFS Patient Files", count: patients.length, icon: "📁", badgeBg: "bg-teal-50", badgeColor: "text-teal-700" },
    { label: "Digital Prescriptions", count: prescriptionReports.length, icon: "💊", badgeBg: "bg-blue-50", badgeColor: "text-blue-700" },
    { label: "Diagnosis Reports", count: diagnosisReports.length, icon: "🔬", badgeBg: "bg-pink-50", badgeColor: "text-pink-700" },
    { label: "User Session Logins", count: LoginHistoryData.length, icon: "🔐", badgeBg: "bg-purple-50", badgeColor: "text-purple-700" },
    { label: "Patients Registered", count: AllPatients.length, icon: "👤", badgeBg: "bg-emerald-50", badgeColor: "text-emerald-700" },
    { label: "Doctors Registered", count: AllDoctors.length, icon: "👨‍⚕️", badgeBg: "bg-amber-50", badgeColor: "text-amber-700" },
    { label: "Diagnostic Centers", count: AllDiagnosis.length, icon: "🏥", badgeBg: "bg-cyan-50", badgeColor: "text-cyan-700" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative selection:bg-teal-100 selection:text-teal-900">
      <DashboardHeader portalTitle="Admin Analytics" roleBadge="Admin Panel" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Administrative & Clinical Analytics
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Real-time on-chain registry audit trails and decentralized storage activity across ArogyaBridge.
          </p>
        </div>

        {/* 4-column metric grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {adminMetrics.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{m.label}</span>
                <span className={`p-2 rounded-xl text-lg border border-slate-100 ${m.badgeBg} ${m.badgeColor}`}>{m.icon}</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{m.count}</div>
            </div>
          ))}
        </div>
  
        {/* System Overview Chart */}
        <div className="mb-10 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center">
          <h2 className="text-lg font-bold text-center text-slate-900 mb-6">
            System Distribution Overview
          </h2>
          <div className="w-full max-w-2xl h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#0f172a" }}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Total User Login */}
        <div className="mb-10 border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm bg-white">
          <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">
            User Login History
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full bg-white text-slate-800 text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">User hhNumber</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">User type</th>
                  <th className="py-3 px-4">Login At</th>
                </tr>
              </thead>
              <tbody>
                {LoginHistoryData.map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 border-b border-slate-100 text-center transition"
                  >
                    <td className="py-3 px-4 font-mono">{p.hhNumber}</td>
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4">{p.type}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(p.uploadedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patients Registered */}
        <div className="mb-10 border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm bg-white">
          <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">
            Total Patients Registered
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full bg-white text-slate-800 text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">HH Number</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">DoB</th>
                  <th className="py-3 px-4">Blood Group</th>
                </tr>
              </thead>
              <tbody>
                {AllPatients.map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 border-b border-slate-100 text-center transition"
                  >
                    <td className="py-3 px-4 font-mono">{p.hhNumber}</td>
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.homeAddress}</td>
                    <td className="py-3 px-4">{p.dateOfBirth}</td>
                    <td className="py-3 px-4 font-bold text-rose-600">{p.bloodGroup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctors Registered */}
        <div className="mb-10 border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm bg-white">
          <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">
            Total Doctors Registered
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full bg-white text-slate-800 text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">HH Number</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Hospital</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Experience</th>
                </tr>
              </thead>
              <tbody>
                {AllDoctors.map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 border-b border-slate-100 text-center transition"
                  >
                    <td className="py-3 px-4 font-mono">{p.hhNumber}</td>
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.hospitalName}</td>
                    <td className="py-3 px-4 text-teal-700 font-semibold">{p.specialization}</td>
                    <td className="py-3 px-4">{p.workExperience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnosis Centers Registered */}
        <div className="mb-10 border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm bg-white">
          <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">
            Total Diagnostic Centers Registered
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full bg-white text-slate-800 text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">HH Number</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Hospital / Affiliation</th>
                  <th className="py-3 px-4">Location</th>
                </tr>
              </thead>
              <tbody>
                {AllDiagnosis.map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 border-b border-slate-100 text-center transition"
                  >
                    <td className="py-3 px-4 font-mono">{p.hhNumber}</td>
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.hospitalName}</td>
                    <td className="py-3 px-4 text-slate-600">{p.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient Files Table */}
        <div className="mb-10 border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm bg-white">
          <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">
            Patient Files (IPFS)
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full bg-white text-slate-800 text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Patient Number</th>
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Uploaded At</th>
                  <th className="py-3 px-4">View</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 border-b border-slate-100 text-center transition"
                  >
                    <td className="py-3 px-4 font-mono">{p.patientNumber}</td>
                    <td className="py-3 px-4 font-medium">{p.fileName}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(p.uploadedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`https://ipfs.io/ipfs/${p.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1 px-3 rounded-lg text-xs shadow-sm"
                      >
                        View File
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Prescription Reports Table */}
        <div className="mb-10 border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm bg-white">
          <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">
            Prescription Reports
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full bg-white text-slate-800 text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Patient Number</th>
                  <th className="py-3 px-4">Doctor Number</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Created At</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionReports.map((pr, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 border-b border-slate-100 text-center transition"
                  >
                    <td className="py-3 px-4 font-mono">{pr.patientNumber}</td>
                    <td className="py-3 px-4 font-mono">{pr.doctorNumber}</td>
                    <td className="py-3 px-4 font-medium">{pr.title}</td>
                    <td className="py-3 px-4">{pr.date}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(pr.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnosis Reports Table */}
        <div className="mb-10 border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm bg-white">
          <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">
            Diagnosis Reports
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full bg-white text-slate-800 text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">HH Number</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4">View File</th>
                </tr>
              </thead>
              <tbody>
                {diagnosisReports.map((r, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 border-b border-slate-100 text-center transition"
                  >
                    <td className="py-3 px-4 font-mono">{r.hhNumber}</td>
                    <td className="py-3 px-4 font-medium">{r.title}</td>
                    <td className="py-3 px-4 text-slate-600">{r.description}</td>
                    <td className="py-3 px-4">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`https://ipfs.io/ipfs/${r.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-1 px-3 rounded-lg text-xs shadow-sm"
                      >
                        View File
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin_Panel;
