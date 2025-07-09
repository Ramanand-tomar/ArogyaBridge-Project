import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import toast, { Toaster } from "react-hot-toast"; // Import toast for notifications

const PatientRegistration = () => {
  const { web3, account, contract, network } = useContext(Web3Context);
  const Navigate = useNavigate();
  console.log("contract is :", contract.patient);

  const [PatientContract, setPatientContract] = useState(null);
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (account) setWalletAddress(account);
    if (contract?.patient) setPatientContract(contract.patient);
  }, [account, contract]);

  const handleRegister = async () => {
    if (isLoading) return;
    setIsLoading(true);
    // Validate input fields
    if (
      !name ||
      !dateOfBirth ||
      !homeAddress ||
      !hhNumber ||
      !gender ||
      !bg ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error(
        "You have missing input fields. Please fill in all the required fields."
      );
      setIsLoading(false);
      return;
    }

    if (!PatientContract) {
      alert("Smart contract not loaded yet. Please wait a moment.");
      return;
    }

    if (hhNumber.length !== 6) {
      alert(
        "You have entered a wrong HH Number. Please enter a 6-digit HH Number."
      );
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setPassword("");
      setConfirmPassword("");
      setPasswordError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPassword("");
      setConfirmPasswordError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    } else {
      setEmailError("");
    }

    try {
      console.log("Registering patient with details:", PatientContract);
      const isRegPatient = await PatientContract.methods
        .isRegisteredPatient(hhNumber)
        .call();
      console.log("isRegPatient: ", isRegPatient);

      if (isRegPatient) {
        toast.success("Patient already exists");
        setIsLoading(false);
        Navigate("/login");
        return;
      }

      await PatientContract.methods
        .registerPatient(
          walletAddress,
          name,
          dateOfBirth,
          gender,
          bg,
          homeAddress,
          email,
          hhNumber,
          password
        )
        .send({ from: walletAddress, gas: 4000000 });

      toast.success("Patient registered successfully!");

      // Redirect to login page after successful registration
      Navigate("/login");
    } catch (error) {
      console.log("Error    : ", error);
      let errorMsg = "An error occurred while registering the patient.";
      if (error && error.message) {
        errorMsg += "\n" + error.message;
      }
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

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

  const cancelOperation = () => {
    Navigate("/home");
  };

  return (
    <div>
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-950 via-gray-900 to-teal-900 animate-gradient-x blur-2xl opacity-100"></div>
      <Toaster position="top-right" reverseOrder={false} />
      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-16 w-16 text-teal-400 mb-4"
              xmlns="http://www.w3.org/2000/svg"
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
            <span className="text-white text-lg font-semibold animate-pulse">
              Registering Patient...
            </span>
          </div>
        </div>
      )}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 font-mono">
        <div className="w-full max-w-4xl">
          <h2 className="text-4xl text-white mb-8 font-extrabold text-center tracking-tight drop-shadow-lg animate-fade-in-up">
            <span className="inline-block animate-bounce">🩺</span> Patient
            Registration <span className="inline-block animate-bounce">🩺</span>
          </h2>
          <form className="bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 border border-white/30 animate-fade-in-up">
            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-teal-400 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-teal-400 transition duration-200"
              />
            </div>
            <div className="mb-4">
              <label
                className="block font-bold text-white"
                htmlFor="dateOfBirth"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-teal-400 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-teal-400 transition duration-200"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-teal-400 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-teal-400 transition duration-200"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="bg">
                Blood Group
              </label>
              <select
                id="bg"
                name="bg"
                required
                value={bg}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-teal-400 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-teal-400 transition duration-200"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block font-bold text-white"
                htmlFor="homeAddress"
              >
                Home Address
              </label>
              <input
                type="text"
                id="homeAddress"
                name="homeAddress"
                placeholder="Enter your Permanent Address"
                value={homeAddress}
                onChange={(e) => setHomeAddress(e.target.value)}
                className="mt-2 p-2 w-full text-white bg-gray-700 border border-teal-400 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-teal-400 transition duration-200"
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="hhNumber">
                HH Number
              </label>
              <input
                id="hhNumber"
                name="hhNumber"
                type="text"
                required
                className={`mt-2 p-2 w-full text-white bg-gray-700 border border-teal-400 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-teal-400 transition duration-200 ${
                  hhNumberError && "border-red-500"
                }`}
                placeholder="Enter your HH Number"
                value={hhNumber}
                onChange={handlehhNumberChange}
              />
              {hhNumberError && (
                <p className="text-red-500 text-sm mt-1">{hhNumberError}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`mt-2 p-2 w-full text-white bg-gray-700 border border-teal-400 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-teal-400 transition duration-200 ${
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
            <div className="mb-4">
              <label className="block font-bold text-white" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`mt-2 p-2 w-full text-white bg-gray-700 border border-teal-400 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-teal-400 transition duration-200 ${
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
            <div className="mb-4">
              <label
                className="block font-bold text-white"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`mt-2 p-2 w-full text-white bg-gray-700 border border-teal-400 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-teal-400 transition duration-200 ${
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
            <div className="space-x-4 md:col-span-2 flex justify-center mt-8">
              <button
                type="button"
                onClick={handleRegister}
                disabled={!contract || isLoading}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold text-lg rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-500 hover:to-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed w-full md:w-auto animate-pulse"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
              <button
                onClick={cancelOperation}
                type="button"
                className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold text-lg rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:from-gray-900 hover:to-black w-full md:w-auto animate-pulse"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
