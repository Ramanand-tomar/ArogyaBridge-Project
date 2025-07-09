import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import toast, { Toaster } from "react-hot-toast";

const DiagnosisRegistration = () => {
  const { web3, account, contract } = useContext(Web3Context);
  const navigate = useNavigate();

  const [diagnosticAddress, setDiagnosticAddress] = useState("");
  const [diagnosticName, setDiagnosticName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [diagnosticLocation, setDiagnosticLocation] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [hhNumberError, sethhNumberError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [diagnosisContract, setDiagnosisContract] = useState(null);

  useEffect(() => {
    if (account) setDiagnosticAddress(account);
    if (contract?.diagnosis) setDiagnosisContract(contract.diagnosis);
  }, [account, contract]);

  const handleRegister = async () => {
    if (
      !diagnosticName ||
      !hospitalName ||
      !diagnosticLocation ||
      !email ||
      !hhNumber ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setPassword("");
      setConfirmPassword("");
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPassword("");
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    try {
      const isRegDoc = await diagnosisContract.methods
        .isRegisteredDiagnostic(hhNumber)
        .call();

      if (isRegDoc) {
        toast.error("Diagnostic already exists");
        return;
      }

      await diagnosisContract.methods
        .registerDiagnostic(
          diagnosticName,
          hospitalName,
          diagnosticLocation,
          email,
          hhNumber,
          password
        )
        .send({ from: diagnosticAddress, gas: 4000000 });

      toast.success("Diagnostic registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Error during registration.");
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handlehhNumberChange = (e) => {
    const inputhhNumber = e.target.value;
    const phoneRegex = /^\d{6}$/;
    if (phoneRegex.test(inputhhNumber)) {
      sethhNumber(inputhhNumber);
      sethhNumberError("");
    } else {
      sethhNumber(inputhhNumber);
      sethhNumberError("Please enter a 6-digit HH Number.");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

  const cancelOperation = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-gray-900 to-teal-900 p-4 font-mono">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-2xl bg-white/10 rounded-3xl shadow-2xl p-8 animate-fade-in-up border border-teal-400/30">
        <h2 className="text-4xl text-teal-400 mb-8 font-extrabold text-center drop-shadow animate-bounce">
          Diagnostic Registration
        </h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="diagnosticName">
              Diagnostic Center Name
            </label>
            <input
              id="diagnosticName"
              name="diagnosticName"
              type="text"
              required
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
              placeholder="Enter Diagnostic's Center Full Name"
              value={diagnosticName}
              onChange={(e) => setDiagnosticName(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="hospitalName">
              Hospital Name
            </label>
            <input
              id="hospitalName"
              name="hospitalName"
              type="text"
              required
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
              placeholder="Enter Hospital Name"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="diagnosticLocation">
              Location
            </label>
            <input
              type="text"
              id="diagnosticLocation"
              name="diagnosticLocation"
              placeholder="Enter the location of Diagnostic center"
              value={diagnosticLocation}
              onChange={(e) => setDiagnosticLocation(e.target.value)}
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
            />
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200 ${
                emailError && "border-red-500"
              }`}
              placeholder="Enter your Email-id"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="hhNumber">
              HH Number
            </label>
            <input
              id="hhNumber"
              name="hhNumber"
              type="text"
              required
              className={`mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200 ${
                hhNumberError && "border-red-500"
              }`}
              placeholder="HH Number"
              value={hhNumber}
              onChange={handlehhNumberChange}
            />
            {hhNumberError && (
              <p className="text-red-500 text-sm mt-1">{hhNumberError}</p>
            )}
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200 ${
                passwordError && "border-red-500"
              }`}
              placeholder="Enter your Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className={`mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200 ${
                confirmPasswordError && "border-red-500"
              }`}
              placeholder="Confirm your Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>
        </form>
        <div className="flex flex-col sm:flex-row gap-4 text-center mt-8 justify-center">
          <button
            type="button"
            onClick={handleRegister}
            className="py-3 px-8 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-teal-600 hover:to-blue-600 transition-all duration-300 animate-pulse"
          >
            Register
          </button>
          <button
            onClick={cancelOperation}
            className="py-3 px-8 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:from-pink-600 hover:to-yellow-500 transition-all duration-300 animate-pulse"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisRegistration;