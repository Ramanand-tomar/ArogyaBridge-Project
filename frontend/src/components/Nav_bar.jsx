import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';

const Nav_bar = () => {
  const location = useLocation();
  const { account, connectWallet } = useContext(Web3Context);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-3xl font-extrabold group-hover:scale-110 transition-transform">🩺</span>
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            ArogyaBridge
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`font-semibold text-sm transition-colors relative py-1 ${
              isActive('/') ? 'text-teal-400' : 'text-gray-300 hover:text-teal-300'
            }`}
          >
            Home
            {isActive('/') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full"></span>
            )}
          </Link>

          <Link
            to="/home"
            className={`font-semibold text-sm transition-colors relative py-1 ${
              isActive('/home') ? 'text-teal-400' : 'text-gray-300 hover:text-teal-300'
            }`}
          >
            Portals
            {isActive('/home') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full"></span>
            )}
          </Link>

          <Link
            to="/about"
            className={`font-semibold text-sm transition-colors relative py-1 ${
              isActive('/about') ? 'text-teal-400' : 'text-gray-300 hover:text-teal-300'
            }`}
          >
            About
            {isActive('/about') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full"></span>
            )}
          </Link>

          <Link
            to="/login"
            className={`font-semibold text-sm transition-colors relative py-1 ${
              isActive('/login') ? 'text-teal-400' : 'text-gray-300 hover:text-teal-300'
            }`}
          >
            Login
            {isActive('/login') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full"></span>
            )}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {account ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-950/60 border border-teal-500/40 rounded-full">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-mono text-teal-300">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white rounded-full text-xs font-bold shadow transition"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav_bar;