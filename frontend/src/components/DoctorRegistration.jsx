import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import toast, { Toaster } from "react-hot-toast";

const DoctorRegistration = () => {
  const { account, contract, connectWallet } = useContext(Web3Context);
  const navigate = useNavigate();

  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [hhNumberError, sethhNumberError] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [workExperience, setWorkExperience] = useState("");
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

    if (
      !doctorName ||
      !hospitalName ||
      !dateOfBirth ||
      !gender ||
      !email ||
      !hhNumber ||
      !specialization ||
      !department ||
      !designation ||
      !workExperience
    ) {
      toast.error("Please fill in all required doctor profile fields.");
      return;
    }

    if (hhNumber.length !== 6) {
      toast.error("Doctor HH Number must be exactly 6 digits.");
      return;
    }

    if (!contract || !contract.doctor) {
      toast.error("Doctor smart contract not initialized. Please verify your Web3 connection.");
      return;
    }

    let activeWallet = account;
    if (!activeWallet) {
      try {
        activeWallet = await connectWallet();
      } catch (err) {
        toast.error("Please connect your Web3 wallet to complete doctor registration.");
        return;
      }
    }

    setIsLoading(true);
    const toastId = toast.loading("Verifying doctor registry on blockchain...");

    try {
      const isRegDoc = await contract.doctor.methods.isRegisteredDoctor(hhNumber).call();

      if (isRegDoc) {
        toast.dismiss(toastId);
        toast.error("A doctor with this HH Number is already registered.");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      toast.loading("Please confirm the transaction in your wallet...", { id: toastId });

      await contract.doctor.methods
        .registerDoctor(
          doctorName,
          hospitalName,
          dateOfBirth,
          gender,
          email,
          hhNumber,
          specialization,
          department,
          designation,
          workExperience
        )
        .send({ from: activeWallet });

      toast.dismiss(toastId);
      toast.success("Doctor registered successfully on the blockchain! 🩺");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Doctor Registration Error:", error);
      toast.dismiss(toastId);
      toast.error(error.message || "An error occurred while registering the doctor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white min-h-screen flex flex-col justify-center items-center">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-4xl bg-gray-900/90 backdrop-blur-xl p-8 sm:p-12 rounded-3xl shadow-2xl border border-teal-500/30">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Doctor Registration
        </h1>
        <p className="text-center text-xs text-gray-400 mb-8">
          Decentralized Practitioner Credentials (Zero On-Chain Passwords • Wallet-Verified Authority)
        </p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          {/* Doctor Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="doctorName">
              Doctor Full Name *
            </label>
            <input
              id="doctorName"
              type="text"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="e.g. Dr. Sarah Jenkins"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>

          {/* Hospital / Clinic */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="hospitalName">
              Hospital / Clinic Name *
            </label>
            <input
              id="hospitalName"
              type="text"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="e.g. Apollo Medical Center"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
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

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="email">
              Professional Email *
            </label>
            <input
              id="email"
              type="email"
              required
              className={`mt-2 p-3 w-full text-white bg-gray-800 border ${
                emailError ? "border-red-500" : "border-gray-700"
              } rounded-xl focus:ring-2 focus:ring-teal-400 transition`}
              placeholder="e.g. doctor@hospital.org"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
          </div>

          {/* HH Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="hhNumber">
              Doctor Registration ID (6 Digits) *
            </label>
            <input
              id="hhNumber"
              type="text"
              maxLength={6}
              required
              className={`mt-2 p-3 w-full text-white bg-gray-800 border ${
                hhNumberError ? "border-red-500" : "border-gray-700"
              } rounded-xl focus:ring-2 focus:ring-teal-400 transition`}
              placeholder="e.g. 200001"
              value={hhNumber}
              onChange={handlehhNumberChange}
            />
            {hhNumberError && <p className="text-red-400 text-xs mt-1">{hhNumberError}</p>}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="specialization">
              Specialization *
            </label>
            <input
              id="specialization"
              type="text"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="e.g. Cardiologist, Neurologist"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="department">
              Department *
            </label>
            <input
              id="department"
              type="text"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="e.g. Cardiology"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="designation">
              Designation *
            </label>
            <input
              id="designation"
              type="text"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="e.g. Senior Consultant"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          {/* Work Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-300" htmlFor="workExperience">
              Work Experience (Years) *
            </label>
            <input
              id="workExperience"
              type="text"
              required
              className="mt-2 p-3 w-full text-white bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-400 transition"
              placeholder="e.g. 10 Years"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
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
              {isLoading ? "Submitting Transaction..." : "Register Doctor"}
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

export default DoctorRegistration;