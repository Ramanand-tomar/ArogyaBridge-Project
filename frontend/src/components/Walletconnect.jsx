import React, { useContext, useEffect, useState } from 'react';
import { Web3Context } from '../context/Web3Context.jsx';
import { useNavigate } from 'react-router-dom';

const Walletconnect = () => {
  const navigate = useNavigate();
  const { web3, account, contract, network } = useContext(Web3Context);
  console.log("Web3 Context:", { web3, account, contract, network });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!web3) {
      setStatus('Loading Web3...');
      return;
    }
    if (!account) {
      setStatus('Please connect your wallet.');
      return;
    }
    if (!contract) {
      setStatus('Loading contracts...');
      return;
    }
    if (!network) {
      setStatus('Loading network...');
      return;
    }
    setStatus('Wallet connected');
    

    if (window.location.pathname !== '/home') {
      navigate('/home');
    }
  }, [web3, account, contract, network, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black to-gray-800 p-4 font-mono">
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in max-w-md w-full">
        <span className="bg-gradient-to-tr from-teal-500 to-blue-500 rounded-full p-4 mb-4 shadow-lg">
          <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" /></svg>
        </span>
        <h1 className="text-3xl font-extrabold mb-4 text-teal-300 drop-shadow">Wallet Connection</h1>
        <div className="w-full flex flex-col items-center">
          <p className={`text-lg font-semibold mb-2 ${status === 'Wallet connected' ? 'text-green-400' : 'text-yellow-300 animate-pulse'}`}>{status}</p>
          {account && (
            <div className="text-sm text-gray-300 mb-2 break-all"><span className="font-bold text-teal-400">Account:</span> {account}</div>
          )}
          {network && (
            <div className="text-sm text-gray-300 mb-2"><span className="font-bold text-teal-400">Network:</span> {network}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Walletconnect;