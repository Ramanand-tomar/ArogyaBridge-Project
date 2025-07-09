import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav_bar from "./Nav_bar";
import Chatbot from "./Chatbot";
import SliderBar from "./Slider";


const Homepage = () => {

  const backend_url = import.meta.env.VITE_BACKEND_URL;



  const navigate = useNavigate();
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
      <section className="flex flex-col items-center justify-center min-h-[60vh] pt-24 animate-fade-in-up">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-teal-700 drop-shadow-lg tracking-tight mb-4 animate-bounce">
          Revolutionizing Healthcare Records
        </h1>
        <p className="text-xl sm:text-2xl text-center text-gray-700 max-w-2xl mb-8 animate-fade-in">
          Empowering patients, doctors, and diagnosis centers with secure,
          instant, and decentralized access to medical records. Experience the
          future of healthcare today.
        </p>
        <div className="flex flex-wrap gap-6 justify-center mb-8 animate-fade-in">
          <button
            onClick={() => navigate("/patient-Registration")}
            className="bg-gradient-to-r from-blue-500 to-teal-400 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-teal-500 transition-all duration-300 animate-pulse"
          >
            Patient Registration
          </button>
          <button
            onClick={() => navigate("/doctor-Registration")}
            className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:scale-105 hover:from-pink-600 hover:to-yellow-500 transition-all duration-300 animate-pulse"
          >
            Doctor Registration
          </button>
          <button
            onClick={() => navigate("/diagnosis-Registration")}
            className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-pink-500 transition-all duration-300 animate-pulse"
          >
            Diagnosis Registration
          </button>
          <button
            onClick={() => navigate("/admin-panel")}
            className="bg-gradient-to-r from-blue-300 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:scale-105 hover:from-blue-800 hover:to-pink-500 transition-all duration-300 animate-pulse border border-gray-700"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-white/60 rounded-xl p-6 shadow-md animate-fade-in-up">
            <span className="text-4xl mb-2 animate-spin">🔒</span>
            <span className="font-bold text-teal-700">Secure & Encrypted</span>
            <span className="text-gray-700 text-center mt-2">
              All patient records are stored securely and encrypted for privacy.
            </span>
          </div>
          <div className="flex flex-col items-center bg-white/60 rounded-xl p-6 shadow-md animate-fade-in-up">
            <span className="text-4xl mb-2 animate-spin">⚡</span>
            <span className="font-bold text-teal-700">Easy Access</span>
            <span className="text-gray-700 text-center mt-2">
              Patients, doctors, and diagnosis centers can access records
              anytime, anywhere.
            </span>
          </div>
          <div className="flex flex-col items-center bg-white/60 rounded-xl p-6 shadow-md animate-fade-in-up">
            <span className="text-4xl mb-2 animate-spin">🌐</span>
            <span className="font-bold text-teal-700">
              Blockchain Integration
            </span>
            <span className="text-gray-700 text-center mt-2">
              Ensures data integrity and transparency for all transactions.
            </span>
          </div>
          <div className="flex flex-col items-center bg-white/60 rounded-xl p-6 shadow-md animate-fade-in-up">
            <span className="text-4xl mb-2 animate-spin">🤝</span>
            <span className="font-bold text-teal-700">
              Seamless Collaboration
            </span>
            <span className="text-gray-700 text-center mt-2">
              Smooth communication between patients, doctors, and diagnosis
              centers.
            </span>
          </div>
          <div className="flex flex-col items-center bg-white/60 rounded-xl p-6 shadow-md animate-fade-in-up">
            <span className="text-4xl mb-2 animate-spin">🌱</span>
            <span className="font-bold text-teal-700">
              Paperless & Eco-friendly
            </span>
            <span className="text-gray-700 text-center mt-2">
              Go green with digital records and prescriptions.
            </span>
          </div>
          <div className="flex flex-col items-center bg-white/60 rounded-xl p-6 shadow-md animate-fade-in-up">
            <span className="text-4xl mb-2 animate-spin">🚀</span>
            <span className="font-bold text-teal-700">Fast & Reliable</span>
            <span className="text-gray-700 text-center mt-2">
              Quick registration, uploads, and permission management.
            </span>
          </div>
        </div>
      </section>
      {/* Feedback Form Section */}

      <section className="max-w-xl mx-auto mb-16 px-8 py-10 bg-white/90 rounded-3xl shadow-2xl border border-teal-200/40 flex flex-col items-center animate-fade-in-up">
        <h2 className="text-2xl animate-bounce font-bold text-teal-700 mb-4  animate-fade-in">
          We Value Your Feedback
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          Have suggestions for improving our Healthcare Record System? Share
          your thoughts below!
        </p>
        {submitted ? (
          <div className="text-green-600 text-lg font-semibold animate-fade-in-up">
            Thank you for your feedback! 💡
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
                className="peer w-full px-4 py-3 rounded-lg border border-teal-300 bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200"
                placeholder=" "
              />
              <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-teal-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500">
                Your Email
              </label>
            </div>
            <div className="relative">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                rows={3}
                className="peer w-full px-4 py-3 rounded-lg border border-teal-300 bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 resize-none"
                placeholder=" "
              />
              <label className="absolute left-4 top-3 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-teal-600 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500">
                Your Suggestions
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:from-teal-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-60 animate-pulse"
            >
              {loading ? (
                <span className="flex items-center gap-2">
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
      <Chatbot />
      <SliderBar/>
      {/* Impactful Info Section */}
      
      <section className="max-w-6xl border border-teal-700/40  mx-auto mb-16 px-8 py-10 bg-gradient-to-br from-blue-100 via-teal-100 to-pink-100 rounded-3xl shadow-xl  animate-fade-in-up">
        <h2 className="text-2xl text-center animate-bounce font-bold text-teal-700 mb-4 animate-fade-in">
          Our Vision for the Future
        </h2>
        <p className="text-gray-700 text-lg mb-4">
          We believe in a world where healthcare is accessible, secure, and
          patient-centric. Our system leverages blockchain and decentralized
          storage to:
        </p>
       
          
        <ul className="list-arrows flex justify-evenly  list-inside text-lg text-gray-700 space-y-1 mb-4">
          <li className="bg-green-400 m-4 p-4 rounded-xl shadow-2xl border border-red-600 hover:bg-rose-400 transform hover:scale-120 transition-all duration-400">Eliminate paperwork and manual errors</li>
          <li className="bg-teal-300 m-4 p-4 rounded-xl shadow-2xl border border-red-600  hover:bg-blue-400 transform hover:scale-120 transition-all duration-400">Empower patients with full control over their data</li>
          <li className="bg-pink-300 m-4 p-4 rounded-xl shadow-2xl border border-red-600  hover:bg-purple-400 transform hover:scale-120 transition-all duration-400">Enable real-time collaboration between healthcare providers</li>
          <li className="bg-purple-300 m-4 p-4 rounded-xl shadow-2xl border border-red-600  hover:bg-teal-400 transform hover:scale-120 transition-all duration-400">Ensure data privacy, security, and transparency</li>
        </ul>
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
