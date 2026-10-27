import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Nav_bar from "./Nav_bar";
import SliderBar from "./Slider";
import { Web3Context } from "../context/Web3Context";
import toast, { Toaster } from "react-hot-toast";
import { FaStar, FaRegStar, FaPaperPlane, FaCheckCircle, FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";

const feedbackCategories = [
  "Patient Experience",
  "Clinical Workflow",
  "Feature Suggestion",
  "Security & Privacy",
  "General Feedback"
];

const userRoles = [
  "Patient",
  "Doctor",
  "Diagnostic Lab",
  "General Visitor"
];

const Homepage = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { account, connectWallet } = useContext(Web3Context);

  // Enhanced Feedback Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("Patient Experience");
  const [selectedRole, setSelectedRole] = useState("Patient");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const ratingDescriptions = {
    1: "Needs Significant Improvement",
    2: "Fair, but has issues",
    3: "Good, meets basic expectations",
    4: "Very Good, smooth experience",
    5: "Exceptional Healthcare Experience!"
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !feedback.trim()) {
      toast.error("Please provide your email and feedback message.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Submitting your feedback...");

    try {
      // Structure message with metadata prefix for rich testimonials parsing
      const formattedMessage = `[Rating: ${rating}/5 | Category: ${category} | Role: ${selectedRole}${name ? ` | Name: ${name}` : ""}] ${feedback.trim()}`;

      const res = await fetch(`${backend_url}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), message: formattedMessage }),
      });

      if (!res.ok) {
        throw new Error("Server responded with error status");
      }

      toast.success("Thank you! Your feedback has been received.", { id: toastId });
      setSubmitted(true);
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to send feedback. Please check connection and try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setFeedback("");
    setRating(5);
    setCategory("Patient Experience");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative selection:bg-teal-100 selection:text-teal-900">
      <Toaster position="top-right" reverseOrder={false} />
      <Nav_bar />

      {/* Subtle Ambient Background Gradients (Light Medical Aesthetic) */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-100/60 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] pt-28 pb-16 px-4">
        {/* Open Access Mode Badge */}
        <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 shadow-sm text-xs">
          {account ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-700 font-semibold">Web3 Wallet:</span>
              <span className="font-mono text-teal-700 font-bold">{account.slice(0, 6)}...{account.slice(-4)}</span>
            </>
          ) : (
            <>
              <span className="text-base">🌐</span>
              <span className="text-slate-800 font-semibold">Open Access:</span>
              <span className="text-slate-600">Anyone can browse the platform freely.</span>
              <span className="hidden sm:inline text-teal-700 font-bold">• MetaMask only required when transacting</span>
              <button
                onClick={connectWallet}
                className="ml-2 px-2.5 py-0.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] transition shadow-sm"
              >
                Connect Wallet
              </button>
            </>
          )}
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-center text-slate-900 tracking-tight mb-4 max-w-4xl leading-tight">
          Revolutionizing Healthcare Records with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
            Sovereign Consent
          </span>
        </h1>
        <p className="text-base sm:text-xl text-center text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Empowering patients, licensed practitioners, and diagnostic laboratories with instant,
          tamper-proof, and decentralized electronic health record management.
        </p>

        {/* Portal Action Buttons */}
        <div className="flex flex-wrap gap-3.5 justify-center mb-8">
          <button
            onClick={() => navigate("/patient-Registration")}
            className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-7 py-3 rounded-full text-sm font-bold shadow-sm hover:shadow transition-all duration-200 active:scale-95"
          >
            Patient Registration
          </button>
          <button
            onClick={() => navigate("/doctor-Registration")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-7 py-3 rounded-full text-sm font-bold shadow-sm hover:shadow transition-all duration-200 active:scale-95"
          >
            Doctor Registration
          </button>
          <button
            onClick={() => navigate("/diagnosis-Registration")}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-7 py-3 rounded-full text-sm font-bold shadow-sm hover:shadow transition-all duration-200 active:scale-95"
          >
            Diagnostic Lab Registration
          </button>
          <button
            onClick={() => navigate("/admin-panel")}
            className="bg-slate-800 hover:bg-slate-900 text-white px-7 py-3 rounded-full text-sm font-bold shadow-sm hover:shadow transition-all duration-200 active:scale-95 border border-slate-700"
          >
            Admin Panel
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto mb-16 px-6 py-12 bg-white rounded-3xl shadow-sm border border-slate-200/80">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Enterprise Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Why Choose Our Healthcare Network?
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-xl mx-auto">
            Engineered with strict zero-knowledge principles and decentralization to safeguard your medical history.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col items-start bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-6 border border-slate-200/80 transition-all duration-200">
            <span className="text-2xl mb-3 p-3 rounded-xl bg-teal-100/70 text-teal-800 border border-teal-200">🔒</span>
            <h3 className="font-bold text-slate-900 text-base">Secure & Encrypted</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              All patient records are stored securely with zero plaintext credentials published to the public ledger.
            </p>
          </div>

          <div className="flex flex-col items-start bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-6 border border-slate-200/80 transition-all duration-200">
            <span className="text-2xl mb-3 p-3 rounded-xl bg-cyan-100/70 text-cyan-800 border border-cyan-200">⚡</span>
            <h3 className="font-bold text-slate-900 text-base">Instant Record Access</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Patients, doctors, and diagnostic labs access clinical summaries anytime, eliminating cumbersome paperwork.
            </p>
          </div>

          <div className="flex flex-col items-start bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-6 border border-slate-200/80 transition-all duration-200">
            <span className="text-2xl mb-3 p-3 rounded-xl bg-blue-100/70 text-blue-800 border border-blue-200">🌐</span>
            <h3 className="font-bold text-slate-900 text-base">Smart Contract Integrity</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Ethereum smart contracts enforce cryptographic consent rules and an immutable audit log of practitioner access.
            </p>
          </div>

          <div className="flex flex-col items-start bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-6 border border-slate-200/80 transition-all duration-200">
            <span className="text-2xl mb-3 p-3 rounded-xl bg-purple-100/70 text-purple-800 border border-purple-200">🤝</span>
            <h3 className="font-bold text-slate-900 text-base">Seamless Collaboration</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Streamlined clinical handoffs between patients, hospital specialists, and diagnostic laboratories.
            </p>
          </div>

          <div className="flex flex-col items-start bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-6 border border-slate-200/80 transition-all duration-200">
            <span className="text-2xl mb-3 p-3 rounded-xl bg-emerald-100/70 text-emerald-800 border border-emerald-200">🌱</span>
            <h3 className="font-bold text-slate-900 text-base">Paperless IPFS Pinning</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Discharge notes and diagnostic imaging reports are archived directly onto interplanetary storage pipelines.
            </p>
          </div>

          <div className="flex flex-col items-start bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-6 border border-slate-200/80 transition-all duration-200">
            <span className="text-2xl mb-3 p-3 rounded-xl bg-amber-100/70 text-amber-800 border border-amber-200">🚀</span>
            <h3 className="font-bold text-slate-900 text-base">Fast & Gas-Optimized</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Lightweight off-chain indexes ensure gas efficiency while keeping identity attestations cryptographically verified.
            </p>
          </div>
        </div>
      </section>

      {/* Elevated Feedback Form Section */}
      <section className="max-w-3xl w-full mx-auto mb-16 px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-10 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
              <FaCommentDots className="text-teal-600" />
              <span>Patient & Provider Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Share Your Experience With ArogyaBridge
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-lg mx-auto">
              Your feedback directly shapes our decentralized electronic health record platform.
            </p>
          </div>

          {submitted ? (
            <div className="py-10 flex flex-col items-center text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-4 border border-emerald-200">
                <FaCheckCircle />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Thank You for Your Feedback!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mb-6 leading-relaxed">
                Your evaluation and suggestions help us deliver a more secure, accessible, and seamless healthcare platform for all users.
              </p>
              <button
                type="button"
                onClick={handleResetForm}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
              >
                Submit Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Star Rating Selector */}
              <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Rate Your Experience
                </label>
                <div className="flex items-center gap-2 mb-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-2xl sm:text-3xl transition-transform hover:scale-125 focus:outline-none"
                      aria-label={`Rate ${star} star`}
                    >
                      {star <= (hoverRating || rating) ? (
                        <FaStar className="text-amber-400 drop-shadow-sm" />
                      ) : (
                        <FaRegStar className="text-slate-300" />
                      )}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-teal-800">
                  {ratingDescriptions[hoverRating || rating]}
                </span>
              </div>

              {/* Feedback Category Pills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Feedback Topic
                </label>
                <div className="flex flex-wrap gap-2">
                  {feedbackCategories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                        category === cat
                          ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Role Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  I am using ArogyaBridge as a:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {userRoles.map((role) => (
                    <button
                      type="button"
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-center transition border ${
                        selectedRole === role
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email inputs in 2-col grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm pointer-events-none">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Kumar"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm pointer-events-none">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. user@healthcare.org"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Feedback Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Your Feedback or Suggestion <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {feedback.length} / 500
                  </span>
                </div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
                  required
                  rows={4}
                  placeholder="Share details on what worked well, what features you'd like added, or any difficulties you encountered..."
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold text-sm shadow-sm transition hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span>Submitting Feedback...</span>
                  </span>
                ) : (
                  <>
                    <FaPaperPlane className="text-xs" />
                    <span>Send Healthcare Feedback</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Community Testimonials & Feedback Showcase */}
      <SliderBar />

      {/* Architectural Vision Section (Clean Light Theme) */}
      <section className="max-w-5xl mx-auto mb-20 px-8 py-12 bg-gradient-to-br from-teal-50/70 via-white to-blue-50/70 text-slate-900 rounded-3xl shadow-sm border border-teal-200/80">
        <div className="text-center mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-teal-800 bg-teal-100/70 px-3 py-1 rounded-full border border-teal-200">
            Architectural Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Our Vision for Decentralized Healthcare
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
            We envision a borderless healthcare paradigm where medical records are secure, interoperable, and patient-sovereign.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
            <span className="text-2xl mb-2 block">📄</span>
            <h3 className="font-bold text-slate-900 text-base">Eliminate Paperwork & Manual Friction</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Replace fragile paper prescriptions and physical binders with tamper-proof IPFS document pipelines.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
            <span className="text-2xl mb-2 block">🛡️</span>
            <h3 className="font-bold text-slate-900 text-base">Cryptographic Consent Sovereignty</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Empower patients to hold cryptographic control and dynamically grant or revoke doctor viewing access.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
            <span className="text-2xl mb-2 block">⚡</span>
            <h3 className="font-bold text-slate-900 text-base">Real-Time Clinical Interoperability</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Enable instant handoffs and record verification between emergency responders, primary care, and diagnostics.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
            <span className="text-2xl mb-2 block">🔒</span>
            <h3 className="font-bold text-slate-900 text-base">Zero Plaintext On-Chain</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Strict HIPAA & GDPR alignment by ensuring passwords and medical diagnoses are never stored in public blockchain state.
            </p>
          </div>
        </div>

        <p className="text-slate-600 text-center text-sm font-medium">
          Join us in transforming healthcare records for everyone, everywhere.
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-500 text-xs sm:text-sm bg-white border-t border-slate-200">
        © {new Date().getFullYear()} ArogyaBridge EHR. Enterprise Decentralized Healthcare System.
      </footer>
    </div>
  );
};

export default Homepage;
