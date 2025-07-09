import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
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

  // Fetch all data from backend
  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/AllUserReports`);
      return res.data || [];
    } catch {
      return [];
    }
  };
  const fetchPrescriptionReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/prescription_reports`);
      return res.data || [];
    } catch {
      return [];
    }
  };
  const fetchDiagnosisReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/diagnosisreport`);
      return res.data || [];
    } catch {
      return [];
    }
  };
  const fetchUserReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/AllUserReports`);
      return res.data || [];
    } catch {
      return [];
    }
  };

  const fetchLoginHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/Login-history`);
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 font-mono text-white">
      <div className="absolute top-8 right-10 z-30 animate-fade-in">
        <button
          onClick={() => {
            navigate("/home");
          }}
          className="px-6 py-2 bg-gradient-to-r from-pink-700 to-blue-900 text-white rounded-xl font-bold text-lg shadow-lg hover:from-gray-900 hover:to-black transition-all duration-200 border border-gray-400/30"
        >
          Go To Home
        </button>
      </div>
      <h1 className="text-4xl font-extrabold text-center text-teal-400 mb-8 drop-shadow animate-bounce ">
        Admin Panel
      </h1>
      

      <div className="flex flex-wrap justify-center gap-6 mb-10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-teal-400/30 flex-row items-center animate-fade-in">
        <div className="bg-teal-600 rounded-2xl  shadow-lg p-6 min-w-[220px] text-center">
          <div className="text-2xl font-bold">Total Patient Files</div>
          <div className="text-5xl font-extrabold mt-2">{patients.length}</div>
        </div>
        <div className="bg-blue-600 rounded-2xl shadow-lg p-6 min-w-[220px] text-center">
          <div className="text-2xl font-bold">Total Prescriptions</div>
          <div className="text-5xl font-extrabold mt-2">
            {prescriptionReports.length}
          </div>
        </div>
        <div className="bg-pink-500 rounded-2xl shadow-lg p-6 min-w-[220px] text-center">
          <div className="text-2xl font-bold">Diagnosis Reports</div>
          <div className="text-5xl font-extrabold mt-2">
            {diagnosisReports.length}
          </div>
        </div>
        <div className="bg-teal-500 rounded-2xl shadow-lg p-6 min-w-[220px] text-center">
          <div className="text-2xl font-bold">Total Users Logins</div>
          <div className="text-5xl font-extrabold mt-2">
            {LoginHistoryData.length}
          </div>
        </div>
        <div className="bg-purple-600 rounded-2xl shadow-lg p-6 min-w-[220px] text-center">
          <div className="text-2xl font-bold"> Patients Registered</div>
          <div className="text-5xl font-extrabold mt-2">
            {AllPatients.length}
          </div>
        </div>
        <div className="bg-orange-400 rounded-2xl shadow-lg p-6 min-w-[220px] text-center">
          <div className="text-2xl font-bold">Doctor Registered</div>
          <div className="text-5xl font-extrabold mt-2">
            {AllDoctors.length}
          </div>
        </div>
        <div className="bg-green-500 rounded-2xl shadow-lg p-6 min-w-[220px] text-center">
          <div className="text-2xl font-bold">Diagnosis Center Registered</div>
          <div className="text-5xl font-extrabold mt-2">
            {AllDiagnosis.length}
          </div>
        </div>
      </div>
  
     <div className="m-4 flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in border border-teal-400 rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl">
  <div className="bg-gray-900 rounded-2xl shadow-xl p-6 w-full md:w-[400px] flex-1 transition-transform duration-300 hover:scale-105 animate-slide-in-up">
    <h2 className="text-xl font-bold text-center text-teal-300 mb-4 animate-fade-in">
      System Overview
    </h2>
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={summaryData}>
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip
          contentStyle={{ backgroundColor: "#222", borderRadius: "8px", color: "#fff" }}
        />
        <Legend />
        <Bar
          dataKey="value"
          fill="url(#barGradient)"
          radius={[8, 8, 0, 0]}
          animationDuration={1200}
        />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

      {/* Total User Login  */}
      <div className="mb-10 border border-teal-400/30 p-10 rounded-3xl shadow-2xl animate-fade-in ">
        <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">
          User Login History
        </h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr className="bg-teal-700 text-teal-100 border-teal-400/30">
                <th className="py-2 px-4">User hhNumber</th>
                <th className="py-2 px-4">User Name</th>
                <th className="py-2 px-4">User type</th>
                <th className="py-2 px-4">Login At</th>
              </tr>
            </thead>
            <tbody>
              {LoginHistoryData.map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-700 min-w-full border-teal-400/30 text-center"
                >
                  <td className="py-2 px-4">{p.hhNumber}</td>
                  <td className="py-2 px-4">{p.name}</td>
                  <td className="py-2 px-4">{p.type}</td>
                  <td className="py-2 px-4">
                    {new Date(p.uploadedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-10 border border-teal-400/30 p-10 rounded-3xl shadow-2xl animate-fade-in ">
        <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">
          Total Patients Registered
        </h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr className="bg-teal-700 text-teal-100 border-teal-400/30">
                <th className="py-2 px-4">hhNumber</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Address</th>
                <th className="py-2 px-4">DoB</th>
                <th className="py-2 px-4">BloodGroup</th>
              </tr>
            </thead>
            <tbody>
              {AllPatients.map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-700 min-w-full border-teal-400/30 text-center"
                >
                  <td className="py-2 px-4">{p.hhNumber}</td>
                  <td className="py-2 px-4">{p.name}</td>
                  <td className="py-2 px-4">{p.homeAddress}</td>
                  <td className="py-2 px-4">{p.dateOfBirth}</td>
                  <td className="py-2 px-4">{p.bloodGroup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-10 border border-teal-400/30 p-10 rounded-3xl shadow-2xl animate-fade-in ">
        <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">
          Total Doctors Registered
        </h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr className="bg-teal-700 text-teal-100 border-teal-400/30">
                <th className="py-2 px-4">hhNumber</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Hospital</th>
                <th className="py-2 px-4">Specilization</th>
                <th className="py-2 px-4">Experiance</th>
              </tr>
            </thead>
            <tbody>
              {AllDoctors.map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-700 min-w-full border-teal-400/30 text-center"
                >
                  <td className="py-2 px-4">{p.hhNumber}</td>
                  <td className="py-2 px-4">{p.name}</td>
                  <td className="py-2 px-4">{p.hospitalName}</td>
                  <td className="py-2 px-4">{p.specialization}</td>
                  <td className="py-2 px-4">{p.workExperience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-10 border border-teal-400/30 p-10 rounded-3xl shadow-2xl animate-fade-in ">
        <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">
          Total Diagnosis Center Registered
        </h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr className="bg-teal-700 text-teal-100 border-teal-400/30">
                <th className="py-2 px-4">hhNumber</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Hospital</th>
                <th className="py-2 px-4">Location</th>
              </tr>
            </thead>
            <tbody>
              {AllDiagnosis.map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-700 min-w-full border border-teal-400/30 text-center"
                >
                  <td className="py-2 px-4">{p.hhNumber}</td>
                  <td className="py-2 px-4">{p.name}</td>
                  <td className="py-2 px-4">{p.hospitalName}</td>
                  <td className="py-2 px-4">{p.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Files Table */}
      <div className="mb-10 border border-teal-400/30 p-10 rounded-3xl shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-bold text-teal-300 mb-4 text-center">
          Patient Files (IPFS)
        </h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr className="bg-teal-700 text-teal-100">
                <th className="py-2 px-4">Patient Number</th>
                <th className="py-2 px-4">File Name</th>

                <th className="py-2 px-4">Uploaded At</th>
                <th className="py-2 px-4">View</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-700 min-w-full border border-teal-400/30 text-center"
                >
                  <td className="py-2 px-4">{p.patientNumber}</td>
                  <td className="py-2 px-4">{p.fileName}</td>

                  <td className="py-2 px-4">
                    {new Date(p.uploadedAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    <a
                      href={`https://ipfs.io/ipfs/${p.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-3 rounded"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Reports Table */}
      <div className="mb-10 border border-teal-400/30 p-10 rounded-3xl shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">
          Prescription Reports
        </h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr className="bg-blue-700 text-blue-100">
                <th className="py-2 px-4">Patient Number</th>
                <th className="py-2 px-4">Doctor Number</th>
                <th className="py-2 px-4">Title</th>

                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Created At</th>
              </tr>
            </thead>
            <tbody>
              {prescriptionReports.map((pr, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-700 min-w-full border border-teal-400/30 text-center"
                >
                  <td className="py-2 px-4">{pr.patientNumber}</td>
                  <td className="py-2 px-4">{pr.doctorNumber}</td>
                  <td className="py-2 px-4">{pr.title}</td>

                  <td className="py-2 px-4">{pr.date}</td>
                  <td className="py-2 px-4">
                    {new Date(pr.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagnosis Reports Table */}
      <div className="mb-10 border border-teal-400/30 p-10 rounded-3xl shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-bold text-pink-300 mb-4 text-center">
          Diagnosis Reports
        </h2>
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr className="bg-pink-700 text-pink-100">
                <th className="py-2 px-4">HH Number</th>
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Description</th>

                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Created At</th>
                <th className="py-2 px-4">View File</th>
              </tr>
            </thead>
            <tbody>
              {diagnosisReports.map((r, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-700 min-w-full border border-teal-400/30 text-center"
                >
                  <td className="py-2 px-4">{r.hhNumber}</td>
                  <td className="py-2 px-4">{r.title}</td>
                  <td className="py-2 px-4">{r.description}</td>

                  <td className="py-2 px-4">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    <a
                      href={`https://ipfs.io/ipfs/${r.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-1 px-3 rounded"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin_Panel;
