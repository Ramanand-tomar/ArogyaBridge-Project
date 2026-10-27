import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import Nav_bar from "./Nav_bar";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const navigate = useNavigate();
  const [hhNumberError, sethhNumberError] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [Type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const { web3, account, contract, network, connectWallet, signMessage } = useContext(Web3Context);

  const handlehhNumberChange = (e) => {
    const input = e.target.value.trim();
    const regex = /^\d{6}$/;
    sethhNumber(input);
    sethhNumberError(
      regex.test(input) ? "" : "Please enter a valid 6-digit HH Number."
    );
  };

  const handleLogin = async (e) => {
    e?.preventDefault();

    if (!Type) {
      toast.error("Please select your user type (Patient, Doctor, Diagnosis).");
      return;
    }

    if (!hhNumber || hhNumber.length !== 6) {
      toast.error("Please enter a valid 6-digit HH Number.");
      return;
    }

    if (!account) {
      toast.loading("Connecting your Ethereum wallet...");
      try {
        await connectWallet();
      } catch (err) {
        toast.dismiss();
        toast.error("Failed to connect wallet: " + err.message);
        return;
      }
    }

    if (!contract) {
      toast.error("Smart contracts are not initialized yet. Please wait a moment.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying identity on blockchain...");

    try {
      let isRegistered = false;
      let details = null;
      let userName = "";
      let registeredWallet = "";

      if (Type === "Patient") {
        isRegistered = await contract.patient.methods.isRegisteredPatient(hhNumber).call();
        if (isRegistered) {
          details = await contract.patient.methods.getPatientDetails(hhNumber).call();
          userName = details.name || details[1] || "";
          registeredWallet = details.walletAddress || details[0] || "";
        }
      } else if (Type === "Doctor") {
        isRegistered = await contract.doctor.methods.isRegisteredDoctor(hhNumber).call();
        if (isRegistered) {
          details = await contract.doctor.methods.getDoctorDetails(hhNumber).call();
          userName = details._doctorName || details[1] || "";
          registeredWallet = details._walletAddress || details[0] || "";
        }
      } else if (Type === "diagnosis") {
        isRegistered = await contract.diagnosis.methods.isRegisteredDiagnostic(hhNumber).call();
        if (isRegistered) {
          details = await contract.diagnosis.methods.getDiagnosticDetails(hhNumber).call();
          userName = details._diagnosticName || details[1] || "";
          registeredWallet = details._walletAddress || details[0] || "";
        }
      }

      if (!isRegistered) {
        toast.dismiss(toastId);
        toast.error(`${Type} with HH Number ${hhNumber} is not registered on the blockchain.`);
        setLoading(false);
        return;
      }

      // Check if the current connected wallet matches the registered wallet
      if (
        registeredWallet &&
        account &&
        registeredWallet.toLowerCase() !== account.toLowerCase()
      ) {
        toast.dismiss(toastId);
        toast.error(
          `Wallet mismatch! This HH Number belongs to wallet: ${registeredWallet.slice(
            0,
            6
          )}...${registeredWallet.slice(-4)}. Connected: ${account.slice(
            0,
            6
          )}...${account.slice(-4)}`
        );
        setLoading(false);
        return;
      }

      toast.loading("Please sign the authentication message in your wallet...", { id: toastId });

      // Request cryptographic signature (EIP-191 / SIWE)
      const authMessage = `ArogyaBridge Login - Role: ${Type}, HH: ${hhNumber}, Wallet: ${account.toLowerCase()}`;
      const signature = await signMessage(authMessage);

      // Verify signature on backend and obtain JWT token
      const verifyRes = await fetch(`${backend_url}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: account,
          signature,
          role: Type,
          hhNumber,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Backend signature verification failed");
      }

      // Store JWT token and authenticated user in localStorage
      localStorage.setItem("arogya_auth_token", verifyData.token);
      localStorage.setItem(
        "arogya_user",
        JSON.stringify({
          hhNumber,
          role: Type,
          walletAddress: account,
          name: userName,
        })
      );

      // Record login history in backend
      try {
        await fetch(`${backend_url}/api/login-history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${verifyData.token}`,
          },
          body: JSON.stringify({
            hhNumber,
            name: userName,
            type: Type,
          }),
        });
      } catch (err) {
        console.warn("Failed to record login history:", err);
      }

      toast.dismiss(toastId);
      toast.success(`Welcome back, ${userName || Type}! Authenticated securely.`);

      setTimeout(() => {
        navigate(`/${Type.toLowerCase() === 'diagnosis' ? 'diagnosis' : Type.toLowerCase()}/${hhNumber}`);
      }, 800);
    } catch (error) {
      console.error("Login Error:", error);
      toast.dismiss(toastId);
      toast.error(error.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white relative">
      <Toaster position="top-right" reverseOrder={false} />
      <Nav_bar />

      <div className="w-full max-w-xl bg-gray-900/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-teal-500/30 mt-16">
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl mb-2">🔐</span>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Secure Web3 Login
          </h2>
          <p className="text-gray-400 text-xs text-center mt-1">
            Sign-In with Ethereum (EIP-4361). Passwordless, tamper-proof cryptographic verification.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Select User Type
            </label>
            <select
              id="type"
              value={Type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              required
            >
              <option value="">Choose role (Patient, Doctor, Diagnosis)</option>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="diagnosis">Diagnosis Center</option>
            </select>
          </div>

          {/* HH Number Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Health Record Number (HH Number)
            </label>
            <input
              id="hhNumber"
              type="text"
              value={hhNumber}
              onChange={handlehhNumberChange}
              placeholder="e.g. 100001 (6 digits)"
              maxLength={6}
              className={`w-full p-3 bg-gray-800 border ${
                hhNumberError ? "border-red-500" : "border-gray-700"
              } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition`}
              required
            />
            {hhNumberError && (
              <p className="text-red-400 text-xs mt-1">{hhNumberError}</p>
            )}
          </div>

          {/* Connected Wallet Info */}
          <div className="p-3 bg-gray-800/60 rounded-xl border border-gray-700 text-xs text-gray-300 flex justify-between items-center">
            <span>Connected Wallet:</span>
            <span className="font-mono text-teal-400">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition duration-200 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign-In with Wallet"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="py-3 px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl border border-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
