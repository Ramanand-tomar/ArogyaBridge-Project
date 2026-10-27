import React, { createContext, useEffect, useState, useCallback } from 'react';
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
  const [isConnecting, setIsConnecting] = useState(false);

  const PatientContractAddress =
    import.meta.env.VITE_PATIENT_CONTRACT_ADDRESS || '0xEb7a8580734F6476998c5c86E3B43a6b045B3E91';
  const DoctorContractAddress =
    import.meta.env.VITE_DOCTOR_CONTRACT_ADDRESS || '0xF00aAd1026e47fe1B94735549116FE9b8Df6bd8F';
  const DiagnosisContractAddress =
    import.meta.env.VITE_DIAGNOSIS_CONTRACT_ADDRESS || '0x40c63AA7b57bCb74FD4429E3D71025d3054A598E';
  const Ganache_Address = import.meta.env.VITE_GANACHE_URL;

  // Initialize contracts given a web3 instance
  const initContracts = useCallback(
    (web3Instance) => {
      try {
        const patientContract = new web3Instance.eth.Contract(Patient_ABI, PatientContractAddress);
        const doctorContract = new web3Instance.eth.Contract(Doctor_ABI, DoctorContractAddress);
        const diagnosisContract = new web3Instance.eth.Contract(Diagnosis_ABI, DiagnosisContractAddress);

        // Note: Providing both 'diagnosis' and 'diagnostic' aliases for backward compatibility and to prevent runtime typos
        setContract({
          patient: patientContract,
          doctor: doctorContract,
          diagnosis: diagnosisContract,
          diagnostic: diagnosisContract,
        });
      } catch (err) {
        console.error('Failed to initialize contracts:', err);
      }
    },
    [PatientContractAddress, DoctorContractAddress, DiagnosisContractAddress]
  );

  // Connect wallet explicitly (MetaMask / EIP-1193 standard)
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const networkId = await web3Instance.eth.net.getId();

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setNetwork(networkId.toString());
        initContracts(web3Instance);
        return accounts[0];
      } else if (Ganache_Address) {
        const provider = new Web3.providers.HttpProvider(Ganache_Address);
        const web3Instance = new Web3(provider);
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();

        setWeb3(web3Instance);
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }
        setNetwork(networkId.toString());
        initContracts(web3Instance);
        return accounts[0];
      } else {
        alert('Please install MetaMask or a Web3 compatible wallet to use ArogyaBridge.');
      }
    } catch (error) {
      console.error('User rejected wallet connection or error:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [Ganache_Address, initContracts]);

  // Sign a message using the connected wallet (EIP-191 / SIWE)
  const signMessage = useCallback(
    async (message) => {
      if (!web3 || !account) {
        throw new Error('Wallet not connected');
      }
      return await web3.eth.personal.sign(message, account, '');
    },
    [web3, account]
  );

  // Auto-detect existing wallet connections on mount
  useEffect(() => {
    const autoInit = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const accounts = await web3Instance.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
          }

          const networkId = await web3Instance.eth.net.getId();
          setNetwork(networkId.toString());
          initContracts(web3Instance);

          // Listen for account changes
          window.ethereum.on('accountsChanged', (newAccounts) => {
            if (newAccounts.length > 0) {
              setAccount(newAccounts[0]);
            } else {
              setAccount('');
              localStorage.removeItem('arogya_auth_token');
              localStorage.removeItem('arogya_user');
            }
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } else if (Ganache_Address) {
          const provider = new Web3.providers.HttpProvider(Ganache_Address);
          const web3Instance = new Web3(provider);
          setWeb3(web3Instance);

          const networkId = await web3Instance.eth.net.getId();
          setNetwork(networkId.toString());

          const accounts = await web3Instance.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
          }
          initContracts(web3Instance);
        }
      } catch (err) {
        console.warn('Auto-init web3 notice:', err.message);
      }
    };

    autoInit();
  }, [Ganache_Address, initContracts]);

  return (
    <Web3Context.Provider
      value={{
        web3,
        account,
        contract,
        network,
        connectWallet,
        signMessage,
        isConnecting,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
