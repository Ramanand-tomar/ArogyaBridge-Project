import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import toast, { Toaster } from "react-hot-toast";

const DiagnosisRegistration = () => {
  const { account, contract, connectWallet } = useContext(Web3Context);
  const navigate = useNavigate();

  const [diagnosticName, setDiagnosticName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [diagnosticLocation, setDiagnosticLocation] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [hhNumberError, sethhNumberError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlehhNumberChange = (e) => {
    const input = e.target.value.trim();
    const regex = /^\d{6}$/;
    sethhNumber(input);
    sethhNumberError(regex.test(input) ? "" : "Please enter a valid 6-digit HH Number.");
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.trim();
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(val) ? "" : "Please enter a valid email address.");
  };

  const cancelOperation = () => {
    navigate("/home");
  };

  const handleRegister = async () => {
    if (isLoading) return;

    if (!diagnosticName || !hospitalName || !diagnosticLocation || !email || !hhNumber) {
      toast.error("Please fill in all required diagnostic center fields.");
      return;
    }

    if (hhNumber.length !== 6) {
      toast.error("Diagnostic HH Number must be exactly 6 digits.");
      return;
    }

    if (!contract || !contract.diagnosis) {
      toast.error("Diagnostic smart contract not initialized. Please verify your Web3 connection.");
      return;
    }

    let activeWallet = account;
    if (!activeWallet) {
      try {
        activeWallet = await connectWallet();
      } catch (err) {
        toast.error("Please connect your Web3 wallet to complete registration.");
        return;
      }
    }

    setIsLoading(true);
    const toastId = toast.loading("Checking diagnostic center registry on blockchain...");

    try {
      const isRegDiag = await contract.diagnosis.methods.isRegisteredDiagnostic(hhNumber).call();

      if (isRegDiag) {
        toast.dismiss(toastId);
        toast.error("A diagnostic center with this HH Number is already registered.");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      toast.loading("Please confirm the transaction in your wallet...", { id: toastId });

      await contract.diagnosis.methods
        .registerDiagnostic(
          diagnosticName,
          hospitalName,
          diagnosticLocation,
          email,
          hhNumber
        )
        .send({ from: activeWallet });

      toast.dismiss(toastId);
      toast.success("Diagnostic Center registered successfully on the blockchain! 🔬");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Diagnostic Registration Error:", error);
      toast.dismiss(toastId);
      toast.error(error.message || "An error occurred while registering the diagnostic center.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white min-h-screen flex flex-col justify-center items-center">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-4xl bg-gray-900/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-teal-500/30">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Diagnostic Center Registration
        </h1>
        <p className="text-center text-xs text-gray-400 mb-6">
          Decentralized Laboratory Facility (Zero Passwords on Blockchain • Smart-Contract Verified)
        </p>

        {!account && (
          <div className="mb-8 p-4 rounded-2xl bg-teal-950/50 border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <div className="text-left">
                <p className="text-sm font-bold text-teal-300">Open Access Form View</p>
                <p className="text-xs text-gray-300">
                  You can freely fill out and review your diagnostic center details. A Web3 wallet (like MetaMask) is only required when submitting the registration transaction.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={connectWallet}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow whitespace-nowrap transition"
            >
              Connect Wallet
            </button>
          </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          {/* Diagnostic Center Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="diagnosticName">
              Diagnostic Center / Lab Name *
            </label>
            <input
              id="diagnosticName"
              type="text"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="e.g. LifeCare Diagnostic Labs"
              value={diagnosticName}
              onChange={(e) => setDiagnosticName(e.target.value)}
            />
          </div>

          {/* Affiliated Hospital */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="hospitalName">
              Affiliated Hospital / Clinic *
            </label>
            <input
              id="hospitalName"
              type="text"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="e.g. Metro City Hospital"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="diagnosticLocation">
              Location / City *
            </label>
            <input
              id="diagnosticLocation"
              type="text"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="e.g. Mumbai, Maharashtra"
              value={diagnosticLocation}
              onChange={(e) => setDiagnosticLocation(e.target.value)}
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="email">
              Laboratory Contact Email *
            </label>
            <input
              id="email"
              type="email"
              required
              className={`mt-2 p-3 w-full text-white bg-gray-800 border ${
                emailError ? "border-red-500" : "border-gray-700"
              } rounded-xl focus:ring-2 focus:ring-teal-400 transition`}
              placeholder="e.g. lab@lifecare.com"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
          </div>

          {/* HH Number */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-300" htmlFor="hhNumber">
              Diagnostic Center HH Number (6 Digits) *
            </label>
            <input
              id="hhNumber"
              type="text"
              maxLength={6}
              required
              className={`mt-2 p-3 w-full text-white bg-gray-800 border ${
                hhNumberError ? "border-red-500" : "border-gray-700"
              } rounded-xl focus:ring-2 focus:ring-teal-400 transition`}
              placeholder="e.g. 300001"
              value={hhNumber}
              onChange={handlehhNumberChange}
            />
            {hhNumberError && <p className="text-red-400 text-xs mt-1">{hhNumberError}</p>}
          </div>

          {/* Wallet Address Display */}
          <div className="md:col-span-2 p-3 bg-gray-800/60 rounded-xl border border-gray-700 flex justify-between items-center text-xs">
            <span className="text-gray-400">Connected Wallet:</span>
            <span className="font-mono text-teal-400">
              {account ? `${account.slice(0, 10)}...${account.slice(-8)}` : "Wallet not connected"}
            </span>
          </div>

          {/* Submit & Close Buttons */}
          <div className="md:col-span-2 flex justify-center gap-4 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-8 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? "Submitting Transaction..." : "Register Diagnostic Center"}
            </button>
            <button
              type="button"
              onClick={cancelOperation}
              className="py-3 px-8 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl border border-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiagnosisRegistration;