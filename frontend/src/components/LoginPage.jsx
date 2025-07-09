import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Web3Context } from "../context/Web3Context";
import Nav_bar from "./Nav_bar";



const Login = () => {

  const backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  console.log("Backend URL:", backend_url);


  const navigate = useNavigate();
  const [hhNumberError, sethhNumberError] = useState("");
  const [hhNumber, sethhNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [UserDetails, setUserDetails] = useState(null);
  const [UserContract, setUserContract] = useState(null);
  const [Type, setType] = useState("");
  const [UserName, setUserName] = useState("");

  const { web3, account, contract, network } = useContext(Web3Context);
  console.log("Account:", account, "Network:", network);

  useEffect(() => {
    if (!contract || !account || !Type) return;

    try {
      if (Type === "Patient") {
        setUserContract(contract.patient);
      } else if (Type === "Doctor") {
        setUserContract(contract.doctor);
      } else if (Type === "diagnosis") {
        setUserContract(contract.diagnosis);
      }
    } catch (error) {
      console.error("Error setting contract:", error);
      alert("An error occurred while setting the contract.");
    }
  }, [account, contract, Type]);

  const handlehhNumberChange = (e) => {
    const input = e.target.value;
    const regex = /^\d{6}$/;

    sethhNumber(input);
    sethhNumberError(
      regex.test(input) ? "" : "Please enter a 6-digit HH Number."
    );
  };

  const handleCheckRegistration = async () => {
  try {
    if (!UserContract) {
      alert("Please select a user type before logging in.");
      return;
    }

    if (!web3 || !contract || !hhNumber || !password) {
      alert("Web3 or contract not loaded or hhNumber is missing.");
      return;
    }

    let isRegisteredResult = false;
    let isValidPassword = false;
    let Details = null;
    let userName = "";

    if (!hhNumber || !password) {
      alert("Please enter both HH Number and password.");
      return;
    }

    if (Type === "Patient") {
      isRegisteredResult = await UserContract.methods.isRegisteredPatient(hhNumber).call();
      if (isRegisteredResult) {
        isValidPassword = await UserContract.methods.validatePassword(hhNumber, password).call();
        if (isValidPassword) {
          Details = await UserContract.methods.getPatientDetails(hhNumber).call();
          userName = Details.name || Details[1] || "";
        }
      }
    } else if (Type === "Doctor") {
      isRegisteredResult = await UserContract.methods.isRegisteredDoctor(hhNumber).call();
      if (isRegisteredResult) {
        isValidPassword = await UserContract.methods.validatePassword(hhNumber, password).call();
        if (isValidPassword) {
          Details = await UserContract.methods.getDoctorDetails(hhNumber).call();
          userName = Details.name || Details[1] || "";
        }
      }
    } else if (Type === "diagnosis") {
      isRegisteredResult = await UserContract.methods.isRegisteredDiagnostic(hhNumber).call();
      if (isRegisteredResult) {
        isValidPassword = await UserContract.methods.validatePassword(hhNumber, password).call();
        if (isValidPassword) {
          Details = await UserContract.methods.getDiagnosticDetails(hhNumber).call();
          userName = Details.name || Details[1] || "";
        }
      }
    }

    setUserDetails(Details);
    setUserName(userName);
    setIsRegistered(isRegisteredResult);

    if (!isRegisteredResult) {
      alert(`${Type} not registered.`);
      return;
    }

    if (!isValidPassword) {
      alert("Incorrect password.");
      return;
    }

    // Log user login history to backend
    try {
      await fetch(`${backend_url}/api/login-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hhNumber,
          name: userName,
          type: Type,
          loginTime: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Failed to log login history:", err);
    }
    navigate(`/${Type}/${hhNumber}`);
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred while logging in.");
  }
};

  const cancelOperation = () => {
    navigate("/home");
  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen flex flex-col justify-center items-center p-4 font-mono text-white">
      <Nav_bar />

      <div className="w-full max-w-4xl bg-gray-900 p-20 rounded-lg shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Login Yourself</h2>

        {/* Select Type */}
        <div className="mb-4">
          <label className="block font-bold text-white" htmlFor="type">
            Select your Type
          </label>
          <select
            id="type"
            value={Type}
            onChange={(e) => setType(e.target.value)}
            className="mt-2 p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md transition duration-200"
            required
          >
            <option value="">
              Select User type (Patient, Doctor, Diagnosis)
            </option>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="diagnosis">Diagnosis</option>
          </select>
        </div>

        {/* HH Number */}
        <div className="mb-4">
          <label className="block font-bold text-white" htmlFor="hhNumber">
            HH Number
          </label>
          <input
            id="hhNumber"
            type="text"
            value={hhNumber}
            onChange={handlehhNumberChange}
            placeholder="HH Number"
            className={`mt-2 p-2 w-full text-white bg-gray-700 border ${
              hhNumberError ? "border-red-500" : "border-gray-600"
            } rounded-md transition duration-200`}
            required
          />
          {hhNumberError && (
            <p className="text-red-500 text-sm mt-1">{hhNumberError}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col w-full mb-4">
          <label className="mb-2 font-bold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="p-2 w-full text-white bg-gray-700 border border-gray-600 rounded-md transition duration-200"
            required
          />
        </div>

        {/* Buttons */}
        <div className="space-x-4 text-center mt-6">
          <button
            onClick={handleCheckRegistration}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-bold text-lg rounded-lg"
          >
            Login
          </button>
          <button
            onClick={cancelOperation}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold text-lg rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
