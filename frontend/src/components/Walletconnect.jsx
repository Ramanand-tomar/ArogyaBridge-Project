import React, { useContext, useEffect, useState } from 'react';
import { Web3Context } from '../context/Web3Context.jsx';
import { useNavigate } from 'react-router-dom';

const Walletconnect = () => {
  const navigate = useNavigate();
  const { web3, account, contract, network, connectWallet } = useContext(Web3Context);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.ethereum && !web3) {
      setStatus('MetaMask not detected (Open Guest Access)');
      return;
    }
    if (!account) {
      setStatus('Please connect your Web3 wallet');
      return;
    }
    if (!contract) {
      setStatus('Loading smart contracts...');
      return;
    }
    if (!network) {
      setStatus('Loading network...');
      return;
    }
    setStatus('Wallet connected');

    if (window.location.pathname !== '/home' && window.location.pathname !== '/') {
      navigate('/home');
    }
  }, [web3, account, contract, network, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in max-w-md w-full text-center">
        <span className="bg-gradient-to-tr from-teal-500 to-blue-500 rounded-full p-4 mb-4 shadow-lg text-3xl">
          🩺
        </span>
        <h1 className="text-2xl font-extrabold mb-2 text-white">Wallet Connection</h1>
        <p className="text-xs text-gray-400 mb-6 max-w-xs">
          ArogyaBridge is completely open for everyone to explore. MetaMask is only required when signing blockchain transactions.
        </p>

        <div className="w-full flex flex-col items-center mb-6">
          <p className={`text-sm font-semibold mb-3 ${status === 'Wallet connected' ? 'text-green-400' : 'text-teal-300'}`}>
            {status}
          </p>
          {account && (
            <div className="text-xs text-gray-300 mb-2 font-mono bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="text-teal-400 font-bold">Account:</span> {account.slice(0, 8)}...{account.slice(-6)}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full">
          {!account && (
            <button
              onClick={connectWallet}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold text-sm shadow transition"
            >
              Connect MetaMask Wallet
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-sm border border-gray-700 transition"
          >
            Explore Platform as Guest (No Wallet) →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Walletconnect;