import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';

import Patient_ABI from '../../ABI/patient_ABI.json';
import Doctor_ABI from '../../ABI/doctor_ABI.json';
import Diagnosis_ABI from '../../ABI/diagnosis_ABI.json';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [network, setNetwork] = useState('');

  const PatientContractAddress = import.meta.env.VITE_PATIENT_CONTRACT_ADDRESS || "0xEb7a8580734F6476998c5c86E3B43a6b045B3E91" ;
  const DoctorContractAddress = import.meta.env.VITE_DOCTOR_CONTRACT_ADDRESS || "0xF00aAd1026e47fe1B94735549116FE9b8Df6bd8F";
  const DiagnosisContractAddress = import.meta.env.VITE_DIAGNOSIS_CONTRACT_ADDRESS || "0x40c63AA7b57bCb74FD4429E3D71025d3054A598E";
  const Ganache_Address = import.meta.env.VITE_GANACHE_URL;

  useEffect(() => {
    const loadWeb3 = async () => {
      try {
        const provider = new Web3.providers.HttpProvider(Ganache_Address);
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);

        // Get network ID
        const networkId = await web3Instance.eth.net.getId();
        setNetwork(networkId);

        // Set account manually if you're using Ganache's pre-funded accounts
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          console.warn('No accounts found.');
        }

        // Initialize contracts
        const patientContract = new web3Instance.eth.Contract(Patient_ABI, PatientContractAddress);
        const doctorContract = new web3Instance.eth.Contract(Doctor_ABI, DoctorContractAddress);
        const diagnosisContract = new web3Instance.eth.Contract(Diagnosis_ABI, DiagnosisContractAddress);

        setContract({ patient: patientContract, doctor: doctorContract, diagnosis: diagnosisContract });

      } catch (error) {
        console.error('Error loading Web3:', error);
      }
    };

    loadWeb3();
  }, [PatientContractAddress, DoctorContractAddress, DiagnosisContractAddress, Ganache_Address]);

  return (
    <Web3Context.Provider value={{ web3, account, contract, network }}>
      {children}
    </Web3Context.Provider>
  );
};
