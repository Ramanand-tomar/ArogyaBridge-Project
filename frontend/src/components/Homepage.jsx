import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Nav_bar from "./Nav_bar";
import SliderBar from "./Slider";
import { Web3Context } from "../context/Web3Context";


const Homepage = () => {

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const { account, connectWallet } = useContext(Web3Context);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
 


  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Submit feedback to backend API
      await fetch(`${backend_url}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message: feedback }),
      });
      setSubmitted(true);
      setLoading(false);
      setFeedback("");
      setEmail("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <>
      <Nav_bar />
      {/* Logo Section */}

      {/* Animated Background Shapes */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-[32rem] h-[32rem] bg-gradient-to-br from-blue-400 to-teal-300 rounded-full opacity-30 blur-2xl animate-pulse"
          style={{ top: "-6rem", left: "-6rem" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-gradient-to-tr from-pink-400 to-yellow-300 rounded-full opacity-30 blur-2xl animate-pulse"
          style={{ bottom: "-6rem", right: "-6rem" }}
        ></div>
        <div className="absolute left-1/2 top-1/3 w-96 h-96 bg-gradient-to-br from-purple-400 to-blue-300 rounded-full opacity-20 blur-3xl animate-float"></div>
      </div>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] pt-24 px-4 animate-fade-in-up">
        {/* Open Access Mode Badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-teal-300 shadow-sm text-xs">
          {account ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-gray-700 font-semibold">Web3 Wallet:</span>
              <span className="font-mono text-teal-700 font-bold">{account.slice(0, 6)}...{account.slice(-4)}</span>
            </>
          ) : (
            <>
              <span className="text-base">🌐</span>
              <span className="text-gray-800 font-semibold">Open Access:</span>
              <span className="text-gray-600">Anyone can browse the website freely.</span>
              <span className="hidden sm:inline text-teal-700 font-bold">• MetaMask only required when transacting</span>
              <button
                onClick={connectWallet}
                className="ml-2 px-2.5 py-0.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] transition shadow"
              >
                Connect Wallet
              </button>
            </>
          )}
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-center text-teal-700 drop-shadow-sm tracking-tight mb-4">
          Revolutionizing Healthcare Records
        </h1>
        <p className="text-lg sm:text-xl text-center text-gray-700 max-w-2xl mb-8 leading-relaxed">
          Empowering patients, doctors, and diagnosis centers with secure,
          instant, and decentralized access to medical records. Experience the
          future of healthcare today.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => navigate("/patient-Registration")}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-7 py-3 rounded-full text-base font-bold shadow-lg hover:scale-105 transition-all duration-200"
          >
            Patient Registration
          </button>
          <button
            onClick={() => navigate("/doctor-Registration")}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-7 py-3 rounded-full text-base font-bold shadow-lg hover:scale-105 transition-all duration-200"
          >
            Doctor Registration
          </button>
          <button
            onClick={() => navigate("/diagnosis-Registration")}
            className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white px-7 py-3 rounded-full text-base font-bold shadow-lg hover:scale-105 transition-all duration-200"
          >
            Diagnosis Registration
          </button>
          <button
            onClick={() => navigate("/admin-panel")}
            className="bg-slate-800 hover:bg-slate-700 text-white px-7 py-3 rounded-full text-base font-bold shadow-lg hover:scale-105 transition-all duration-200 border border-slate-700"
          >
            Admin Panel
          </button>
        </div>
      </section>
      {/* Features Section */}
      <section className="max-w-5xl mx-auto mb-16 px-6 py-10 bg-white/80 rounded-3xl shadow-2xl border border-teal-200/40 animate-fade-in-up">
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center animate-fade-in">
          Why Choose Our Healthcare System?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group flex flex-col items-center bg-white/70 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-teal-100 transition-all duration-300">
            <span className="text-3xl mb-3 p-3 rounded-2xl bg-teal-50 border border-teal-100 group-hover:scale-110 transition-transform">🔒</span>
            <span className="font-bold text-teal-800 text-lg">Secure & Encrypted</span>
            <span className="text-gray-600 text-center text-sm mt-2 leading-relaxed">
              All patient records are stored securely and encrypted for privacy with zero plaintext credentials.
            </span>
          </div>
          <div className="group flex flex-col items-center bg-white/70 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-teal-100 transition-all duration-300">
            <span className="text-3xl mb-3 p-3 rounded-2xl bg-cyan-50 border border-cyan-100 group-hover:scale-110 transition-transform">⚡</span>
            <span className="font-bold text-teal-800 text-lg">Easy Access</span>
            <span className="text-gray-600 text-center text-sm mt-2 leading-relaxed">
              Patients, doctors, and diagnosis centers can access records anytime, anywhere without paperwork.
            </span>
          </div>
          <div className="group flex flex-col items-center bg-white/70 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-teal-100 transition-all duration-300">
            <span className="text-3xl mb-3 p-3 rounded-2xl bg-blue-50 border border-blue-100 group-hover:scale-110 transition-transform">🌐</span>
            <span className="font-bold text-teal-800 text-lg">
              Blockchain Integration
            </span>
            <span className="text-gray-600 text-center text-sm mt-2 leading-relaxed">
              Ensures data integrity, cryptographic audit trails, and transparency for all consent actions.
            </span>
          </div>
          <div className="group flex flex-col items-center bg-white/70 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-teal-100 transition-all duration-300">
            <span className="text-3xl mb-3 p-3 rounded-2xl bg-purple-50 border border-purple-100 group-hover:scale-110 transition-transform">🤝</span>
            <span className="font-bold text-teal-800 text-lg">
              Seamless Collaboration
            </span>
            <span className="text-gray-600 text-center text-sm mt-2 leading-relaxed">
              Smooth peer-to-peer communication between patients, licensed doctors, and diagnostic labs.
            </span>
          </div>
          <div className="group flex flex-col items-center bg-white/70 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-teal-100 transition-all duration-300">
            <span className="text-3xl mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 group-hover:scale-110 transition-transform">🌱</span>
            <span className="font-bold text-teal-800 text-lg">
              Paperless & Eco-friendly
            </span>
            <span className="text-gray-600 text-center text-sm mt-2 leading-relaxed">
              Eliminate lost files and physical clutter with decentralized cloud prescriptions and documents.
            </span>
          </div>
          <div className="group flex flex-col items-center bg-white/70 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-teal-100 transition-all duration-300">
            <span className="text-3xl mb-3 p-3 rounded-2xl bg-amber-50 border border-amber-100 group-hover:scale-110 transition-transform">🚀</span>
            <span className="font-bold text-teal-800 text-lg">Fast & Reliable</span>
            <span className="text-gray-600 text-center text-sm mt-2 leading-relaxed">
              Quick registration, instant IPFS pinning, and responsive real-time permission management.
            </span>
          </div>
        </div>
      </section>
      {/* Feedback Form Section */}

      {/* Feedback Form Section */}
      <section className="max-w-xl mx-auto mb-16 px-8 py-10 bg-white/95 rounded-3xl shadow-xl border border-teal-200/60 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-teal-800 mb-2 text-center">
          We Value Your Feedback
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Have suggestions for improving our Decentralized Healthcare Record System? Share your thoughts below!
        </p>
        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-base font-semibold text-center">
            Thank you for your feedback! Your insight helps us improve patient care. 💡
          </div>
        ) : (
          <form
            onSubmit={handleFeedbackSubmit}
            className="w-full flex flex-col gap-4"
          >
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                placeholder=" "
              />
              <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-teal-600 peer-focus:bg-white peer-focus:px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                Your Email Address
              </label>
            </div>
            <div className="relative">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                rows={3}
                className="peer w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 resize-none"
                placeholder=" "
              />
              <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-teal-600 peer-focus:bg-white peer-focus:px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500">
                Your Feedback or Suggestions
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Feedback"
              )}
            </button>
          </form>
        )}
      </section>

      <SliderBar/>

      {/* Impactful Vision Section */}
      <section className="max-w-5xl mx-auto mb-20 px-8 py-12 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl shadow-2xl border border-teal-500/30">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            Architectural Vision
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3">
            Our Vision for Decentralized Healthcare
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
            We believe in a world where medical records are secure, interoperable, and patient-sovereign.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition">
            <span className="text-2xl mb-2 block">📄</span>
            <h3 className="font-bold text-white text-base">Eliminate Paperwork & Errors</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Replace fragile paper prescriptions and physical binders with tamper-proof IPFS document pipelines.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition">
            <span className="text-2xl mb-2 block">🛡️</span>
            <h3 className="font-bold text-white text-base">Patient Consent Sovereignty</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Empower patients to hold cryptographic control and dynamically grant or revoke doctor viewing access.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition">
            <span className="text-2xl mb-2 block">⚡</span>
            <h3 className="font-bold text-white text-base">Real-Time Clinical Interoperability</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Enable instant handoffs and record verification between emergency responders, primary care, and diagnostics.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition">
            <span className="text-2xl mb-2 block">🔒</span>
            <h3 className="font-bold text-white text-base">Zero Plaintext On-Chain</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Strict HIPAA & GDPR alignment by ensuring passwords and medical diagnoses are never stored in public blockchain state.
            </p>
          </div>
        </div>
        <p className="text-gray-700 text-lg">
          Join us in transforming healthcare for everyone, everywhere.
        </p>
       
      </section>
      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-600 text-sm bg-white/80 border-t border-teal-200/40 animate-fade-in">
        © {new Date().getFullYear()} HealthRecords dApp. Built By NextGen
        MedTech.
      </footer>
    </>
  );
};

export default Homepage;
