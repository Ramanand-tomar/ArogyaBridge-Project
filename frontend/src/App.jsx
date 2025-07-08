import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';


import Login from "./components/LoginPage.jsx"
import About from './components/About.jsx';
import Homepage from './components/Homepage.jsx';
import Walletconnect from './components/Walletconnect.jsx'
import DiagnosisRegistration from './components/DiagnosisRegistration.jsx';
import DoctorRegistration from './components/DoctorRegistration.jsx'; 
import PatientRegistration from './components/PatientRegistration.jsx';
import PatientDashBoard from './components/PatientDashBoard.jsx';
import DoctorDashBoard from './components/DoctorDashBoard.jsx';
import DiagnosticDashBoard from './components/DiagnosisDashBoard.jsx';
import ViewRecrods from './components/ViewRecrods.jsx';
import UploadRecords from './components/UploadRecords.jsx';
import GrantPermission from './components/GrantPermission.jsx';
import DoctorPrescription from './components/DoctorPrecription.jsx';
import DoctorProfile from './components/DoctorProfile.jsx';
import PatientList from './components/PatientList.jsx';
import DoctorViewPatient from './components/DoctorViewPatient.jsx';
import DiagnosisForm from './components/DiagnosisForm.jsx';
import DiagnosticReport from './components/DiagnosticReport.jsx';
import Admin_Panel from './components/Admin_Panel.jsx';



function App() {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const onclick_walletconnect = () => {
    setShowWalletConnect(true);
  }
  const Router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          {/* Animated Gradient Background */}
          <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 animate-gradient-x blur-2xl opacity-60"></div>
          {/* Main Content Card */}
          <div className="relative z-10 flex flex-col items-center justify-center h-screen">
            <div className="backdrop-blur-lg bg-white/30 rounded-3xl shadow-2xl p-10 max-w-xl w-full flex flex-col items-center border border-white/40">
              <img src="/vite.svg" alt="Logo" className="w-20 h-20 mb-4 animate-bounce" />
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-lg">HealthRecords dApp</h1>
              <h2 className="text-lg text-gray-700 mb-4 font-medium">Empowering Secure, Decentralized Healthcare</h2>
              <p className="text-center text-gray-600 mb-6">Connect your wallet to access, manage, and share your health records securely with doctors and diagnostic centers. Experience the future of healthcare with blockchain and IPFS.</p>
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 mb-4" onClick={onclick_walletconnect}>
                Connect Wallet
              </button>
              {showWalletConnect && <Walletconnect />}
              {/* Features Section */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-center p-4 bg-white/40 rounded-xl shadow-md">
                  <span className="text-3xl mb-2 animate-spin">🔒</span>
                  <span className="font-bold">Privacy First</span>
                  <span className="text-xs text-gray-500 text-center">Your data is encrypted and only accessible by you and those you trust.</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/40 rounded-xl shadow-md">
                  <span className="text-3xl mb-2 animate-spin">⚡</span>
                  <span className="font-bold">Instant Access</span>
                  <span className="text-xs text-gray-500 text-center">Access and share records instantly with doctors and labs.</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white/40 rounded-xl shadow-md">
                  <span className="text-3xl mb-2 animate-spin">🌐</span>
                  <span className="font-bold">Decentralized</span>
                  <span className="text-xs text-gray-500 text-center">Built on blockchain & IPFS for transparency and security.</span>
                </div>
              </div>
            </div>
            {/* Footer */}
            <footer className="mt-10 text-gray-700 text-xs opacity-80">© {new Date().getFullYear()} HealthRecords dApp. All rights reserved.</footer>
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
      path: "/home",
      element: <Homepage />,
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
      element: <PatientDashBoard />,
    },
    { 
      path: "/doctor/:hhNumber",
      element: <DoctorDashBoard />,
    },
    { 
      path: "/diagnosis/:hhNumber",
      element: <DiagnosticDashBoard />,
    },
  
    {
      path: "/patient/:hhNumber/viewrecords",
      element: <ViewRecrods />,
    },
    {
      path: "/patient/:hhNumber/uploadrecords",
      element: <UploadRecords />, 
    },
    {
      path: "/patient/:hhNumber/grantpermission",
      element: <GrantPermission />,
    },
    {
      path: "/doctor/:hhNumber/doctorviewpatient/:patient_Number/doctor-Prescription",
      element: <DoctorPrescription />,
    },
    {
      path: "/doctor/:hhNumber/viewdoctorprofile",
      element: <DoctorProfile />,
    },
    {
      path: "/doctor/:hhNumber/patientlist",
      element: <PatientList />,
    },
    {
      path: "/doctor/:hhNumber/doctorviewpatient/:patient_Number",
      element: <DoctorViewPatient />, 
    },
    {
      path: "/diagnosis/:hhNumber/diagnosisform",
      element: <DiagnosisForm />,
    },
    {
      path: "/patient/:hhNumber/diagnosticreport",
      element: <DiagnosticReport />,
    },
    {
      path: "/admin-panel",
      element: <Admin_Panel />,
    }
  ]);

  

  return (
    <>
      <RouterProvider router={Router} />
      
    </>
  )
}

export default App




































