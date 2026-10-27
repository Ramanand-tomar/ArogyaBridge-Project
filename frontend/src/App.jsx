import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import Login from "./components/LoginPage.jsx";
import About from './components/About.jsx';
import Homepage from './components/Homepage.jsx';
import Walletconnect from './components/Walletconnect.jsx';
import DiagnosisRegistration from './components/DiagnosisRegistration.jsx';
import DoctorRegistration from './components/DoctorRegistration.jsx'; 
import PatientRegistration from './components/PatientRegistration.jsx';
import PatientDashBoard from './components/PatientDashBoard.jsx';
import DoctorDashBoard from './components/DoctorDashBoard.jsx';
import DiagnosticDashBoard from './components/DiagnosisDashBoard.jsx';
import ViewRecords from './components/ViewRecrods.jsx';
import UploadRecords from './components/UploadRecords.jsx';
import GrantPermission from './components/GrantPermission.jsx';
import DoctorPrescription from './components/DoctorPrecription.jsx';
import DoctorProfile from './components/DoctorProfile.jsx';
import PatientList from './components/PatientList.jsx';
import DoctorViewPatient from './components/DoctorViewPatient.jsx';
import DiagnosisForm from './components/DiagnosisForm.jsx';
import DiagnosticReport from './components/DiagnosticReport.jsx';
import Admin_Panel from './components/Admin_Panel.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Chatbot from './components/ChatBot.jsx';

function App() {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const onclick_walletconnect = () => {
    setShowWalletConnect(true);
  };

  const Router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    { 
      path: "/home",
      element: <Homepage />,
    },
    {
      path: "/welcome",
      element: (
        <>
          {/* Animated Gradient Background */}
          <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 animate-gradient-x blur-2xl opacity-60"></div>
          {/* Main Content Card */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
            <div className="backdrop-blur-lg bg-white/30 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center border border-white/40">
              <span className="text-6xl mb-4 animate-bounce">🩺</span>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-lg text-center">ArogyaBridge</h1>
              <h2 className="text-lg text-gray-700 mb-4 font-medium text-center">Empowering Secure, Decentralized Healthcare</h2>
              <p className="text-center text-gray-600 mb-6 text-sm">
                Open access for everyone to browse. Connect your Web3 wallet whenever you are ready to manage or verify medical records on-chain.
                Zero plaintext credentials • Complete patient consent control • IPFS integration.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mb-4">
                <button
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                  onClick={onclick_walletconnect}
                >
                  Connect Wallet
                </button>
                <a
                  href="/"
                  className="px-6 py-3 rounded-full bg-white/80 hover:bg-white text-gray-800 font-semibold shadow-md text-center border border-white/60 hover:scale-105 transition-all duration-300"
                >
                  Explore Platform →
                </a>
              </div>
              {showWalletConnect && <Walletconnect />}
              {/* Features Section */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center p-4 bg-white/40 rounded-xl shadow-md">
                  <span className="text-3xl mb-2">🔒</span>
                  <span className="font-bold text-sm">Privacy First</span>
                  <span className="text-xs text-gray-500 text-center">Decentralized consent control. Only authorized doctors view your data.</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/40 rounded-xl shadow-md">
                  <span className="text-3xl mb-2">⚡</span>
                  <span className="font-bold text-sm">Instant Access</span>
                  <span className="text-xs text-gray-500 text-center">Share health records seamlessly with labs and specialists.</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/40 rounded-xl shadow-md">
                  <span className="text-3xl mb-2">🌐</span>
                  <span className="font-bold text-sm">Web3 & IPFS</span>
                  <span className="text-xs text-gray-500 text-center">Tamper-proof blockchain audit trails and distributed storage.</span>
                </div>
              </div>
            </div>
            {/* Footer */}
            <footer className="mt-10 text-gray-700 text-xs opacity-80">
              © {new Date().getFullYear()} ArogyaBridge EHR. Enterprise Grade Decentralized Healthcare.
            </footer>
          </div>
        </>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    { 
      path: "/about",
      element: <About />,
    },
    {
      path: "/diagnosis-Registration",
      element: <DiagnosisRegistration />,
    },
    { 
      path: "/doctor-Registration",
      element: <DoctorRegistration />,
    },
    {
      path: "/patient-Registration",
      element: <PatientRegistration />,
    },
    { 
      path: "/patient/:hhNumber",
      element: (
        <ProtectedRoute requiredRole="Patient">
          <PatientDashBoard />
        </ProtectedRoute>
      ),
    },
    { 
      path: "/doctor/:hhNumber",
      element: (
        <ProtectedRoute requiredRole="Doctor">
          <DoctorDashBoard />
        </ProtectedRoute>
      ),
    },
    { 
      path: "/diagnosis/:hhNumber",
      element: (
        <ProtectedRoute requiredRole="diagnosis">
          <DiagnosticDashBoard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/patient/:hhNumber/viewrecords",
      element: (
        <ProtectedRoute requiredRole="Patient">
          <ViewRecords />
        </ProtectedRoute>
      ),
    },
    {
      path: "/patient/:hhNumber/uploadrecords",
      element: (
        <ProtectedRoute requiredRole="Patient">
          <UploadRecords />
        </ProtectedRoute>
      ),
    },
    {
      path: "/patient/:hhNumber/grantpermission",
      element: (
        <ProtectedRoute requiredRole="Patient">
          <GrantPermission />
        </ProtectedRoute>
      ),
    },
    {
      path: "/doctor/:hhNumber/doctorviewpatient/:patient_Number/doctor-Prescription",
      element: (
        <ProtectedRoute requiredRole="Doctor">
          <DoctorPrescription />
        </ProtectedRoute>
      ),
    },
    {
      path: "/doctor/:hhNumber/viewdoctorprofile",
      element: (
        <ProtectedRoute requiredRole="Doctor">
          <DoctorProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/doctor/:hhNumber/patientlist",
      element: (
        <ProtectedRoute requiredRole="Doctor">
          <PatientList />
        </ProtectedRoute>
      ),
    },
    {
      path: "/doctor/:hhNumber/doctorviewpatient/:patient_Number",
      element: (
        <ProtectedRoute requiredRole="Doctor">
          <DoctorViewPatient />
        </ProtectedRoute>
      ),
    },
    {
      path: "/diagnosis/:hhNumber/diagnosisform",
      element: (
        <ProtectedRoute requiredRole="diagnosis">
          <DiagnosisForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/patient/:hhNumber/diagnosticreport",
      element: (
        <ProtectedRoute requiredRole="Patient">
          <DiagnosticReport />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin-panel",
      element: <Admin_Panel />,
    }
  ]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={Router} />
      <Chatbot />
    </>
  );
}

export default App;
