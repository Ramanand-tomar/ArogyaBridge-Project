import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import toast, { Toaster } from "react-hot-toast";

const PatientRegistration = () => {
  const { web3, account, contract, connectWallet } = useContext(Web3Context);
  const Navigate = useNavigate();

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [hhNumberError, sethhNumberError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [gender, setGender] = useState("");
  const [bg, setBloodGroup] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (account) setWalletAddress(account);
  }, [account]);

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
    Navigate("/home");
  };

  const handleRegister = async () => {
    if (isLoading) return;

    if (!name || !dateOfBirth || !homeAddress || !hhNumber || !gender || !bg || !email) {
      toast.error("Please fill in all required patient fields.");
      return;
    }

    if (hhNumber.length !== 6) {
      toast.error("HH Number must be exactly 6 digits.");
      return;
    }

    if (!contract || !contract.patient) {
      toast.error("Smart contract not loaded yet. Please verify your Web3 connection.");
      return;
    }

    let activeWallet = walletAddress || account;
    if (!activeWallet) {
      try {
        activeWallet = await connectWallet();
      } catch (err) {
        toast.error("Please connect your Web3 wallet to complete registration.");
        return;
      }
    }

    setIsLoading(true);
    const toastId = toast.loading("Checking patient registry on blockchain...");

    try {
      const isRegPatient = await contract.patient.methods.isRegisteredPatient(hhNumber).call();

      if (isRegPatient) {
        toast.dismiss(toastId);
        toast.error("A patient with this HH Number is already registered.");
        setIsLoading(false);
        Navigate("/login");
        return;
      }

      toast.loading("Please confirm the transaction in your wallet...", { id: toastId });

      await contract.patient.methods
        .registerPatient(
          activeWallet,
          name,
          dateOfBirth,
          gender,
          bg,
          homeAddress,
          email,
          hhNumber
        )
        .send({ from: activeWallet });

      toast.dismiss(toastId);
      toast.success("Patient registered successfully on the blockchain! 🎉");

      setTimeout(() => {
        Navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Patient Registration Error:", error);
      toast.dismiss(toastId);
      toast.error(error.message || "An error occurred while registering the patient.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white min-h-screen flex flex-col justify-center items-center">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-4xl bg-gray-900/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-teal-500/30">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Patient Registration
        </h1>
        <p className="text-center text-xs text-gray-400 mb-6">
          Decentralized Patient Identity (Zero Passwords on Blockchain • Wallet-Protected Identity)
        </p>

        {!account && (
          <div className="mb-8 p-4 rounded-2xl bg-teal-950/50 border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <div className="text-left">
                <p className="text-sm font-bold text-teal-300">Open Access Form View</p>
                <p className="text-xs text-gray-300">
                  You can freely fill out and review your patient details. A Web3 wallet (like MetaMask) is only required when submitting the registration transaction.
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
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="dateOfBirth">
              Date of Birth *
            </label>
            <input
              id="dateOfBirth"
              type="date"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="gender">
              Gender *
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="bloodGroup">
              Blood Group *
            </label>
            <select
              id="bloodGroup"
              value={bg}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* HH Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="hhNumber">
              HH Number (6 Digits) *
            </label>
            <input
              id="hhNumber"
              type="text"
              maxLength={6}
              required
              className={`mt-2 p-3 w-full text-white bg-gray-800 border ${
                hhNumberError ? "border-red-500" : "border-gray-700"
              } rounded-xl focus:ring-2 focus:ring-teal-400 transition`}
              placeholder="e.g. 100001"
              value={hhNumber}
              onChange={handlehhNumberChange}
            />
            {hhNumberError && <p className="text-red-400 text-xs mt-1">{hhNumberError}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="email">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              required
              className={`mt-2 p-3 w-full text-white bg-gray-800 border ${
                emailError ? "border-red-500" : "border-gray-700"
              } rounded-xl focus:ring-2 focus:ring-teal-400 transition`}
              placeholder="e.g. patient@example.com"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
          </div>

          {/* Home Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-300" htmlFor="homeAddress">
              Home Address *
            </label>
            <textarea
              id="homeAddress"
              rows={2}
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="Enter residential address"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
            />
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
              {isLoading ? "Submitting Transaction..." : "Register Patient"}
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

export default PatientRegistration;
