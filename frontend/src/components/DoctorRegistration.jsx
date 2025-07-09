import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import toast, { Toaster } from "react-hot-toast";

const DoctorRegistration = () => {
  const { web3, account, contract } = useContext(Web3Context);
  const navigate = useNavigate();

  const [DoctorContract, setDoctorContract] = useState(null);
  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalLocation, setHospitalLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [hhNumberError, sethhNumberError] = useState("");
  const [specializationError, setSpecializationError] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (account) setDoctorAddress(account);
    if (contract?.doctor) setDoctorContract(contract.doctor);
  }, [account, contract]);

  const handleRegister = async () => {
    if (
      !doctorName ||
      !hospitalName ||
      !hospitalLocation ||
      !dateOfBirth ||
      !gender ||
      !email ||
      !hhNumber ||
      !specialization ||
      !department ||
      !designation ||
      !workExperience ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    if (hhNumber.length !== 6) {
      toast.error("Please enter a 6-digit HH Number.");
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
      const isRegDoc = await DoctorContract.methods
        .isRegisteredDoctor(hhNumber)
        .call();

      if (isRegDoc) {
        toast.error("Doctor already exists");
        navigate("/login");
        return;
      }

      await DoctorContract.methods
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
          workExperience,
          password
        )
        .send({ from: doctorAddress, gas: 4000000 });

      toast.success("Doctor registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while registering the doctor.");
    }
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
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

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    setSpecialization(value);
    if (value === "Other") {
      setSpecializationError("");
    }
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    setDepartment(value);
    if (value === "Other") {
      setDepartmentError("");
    }
  };

  const handleDesignationChange = (e) => {
    const value = e.target.value;
    setDesignation(value);
    if (value === "Other") {
      setDesignationError("");
    }
  };

  const cancelOperation = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-gray-900 to-teal-900 p-4 font-mono">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-3xl bg-white/10 rounded-3xl shadow-2xl p-8 animate-fade-in-up border border-teal-400/30">
        <h2 className="text-4xl text-teal-400 mb-8 font-extrabold text-center drop-shadow animate-bounce">
          Doctor Registration
        </h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="doctorName">
              Full Name
            </label>
            <input
              id="doctorName"
              name="doctorName"
              type="text"
              required
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
              placeholder="Enter Full Name"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
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
            <label className="block font-bold text-teal-200 mb-1" htmlFor="hospitalLocation">
              Hospital Location
            </label>
            <input
              id="hospitalLocation"
              name="hospitalLocation"
              type="text"
              required
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
              placeholder="Enter Hospital Location"
              value={hospitalLocation}
              onChange={(e) => setHospitalLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="dateOfBirth">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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
              placeholder="Enter your HH Number"
              value={hhNumber}
              onChange={handlehhNumberChange}
            />
            {hhNumberError && (
              <p className="text-red-500 text-sm mt-1">{hhNumberError}</p>
            )}
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="specialization">
              Specialization
            </label>
            <select
              id="specialization"
              name="specialization"
              required
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
              value={specialization}
              onChange={handleSpecializationChange}
            >
              <option value="">Select Specialization</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Oncology">Oncology</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Radiology">Radiology</option>
              <option value="Other">Other</option>
            </select>
            {specialization === "Other" && (
              <input
                type="text"
                placeholder="Enter Other Specialization"
                className="mt-2 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
                value={specializationError}
                onChange={(e) => setSpecializationError(e.target.value)}
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="department">
              Department
            </label>
            <select
              id="department"
              name="department"
              required
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
              value={department}
              onChange={handleDepartmentChange}
            >
              <option value="">Select Department</option>
              <option value="Casualty">Casualty</option>
              <option value="Surgery">Surgery</option>
              <option value="Laboratory Services">Consultancy</option>
              <option value="Other">Other</option>
            </select>
            {department === "Other" && (
              <input
                type="text"
                placeholder="Enter Other Department"
                className="mt-2 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
                value={departmentError}
                onChange={(e) => setDepartmentError(e.target.value)}
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="designation">
              Designation
            </label>
            <select
              id="designation"
              name="designation"
              required
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
              value={designation}
              onChange={handleDesignationChange}
            >
              <option value="">Select Designation</option>
              <option value="Doctor">Doctor</option>
              <option value="Surgeon">Surgeon</option>
              <option value="Nurse">Nurse</option>
              <option value="Other">Other</option>
            </select>
            {designation === "Other" && (
              <input
                type="text"
                placeholder="Enter Other Designation"
                className="mt-2 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
                value={designationError}
                onChange={(e) => setDesignationError(e.target.value)}
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-teal-200 mb-1" htmlFor="workExperience">
              Work Experience
            </label>
            <input
              id="workExperience"
              name="workExperience"
              type="number"
              required
              className="mt-1 p-2 w-full text-white bg-gray-800 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-400 transition duration-200"
              placeholder="Years"
              min="0"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
            />
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

export default DoctorRegistration;