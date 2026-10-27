import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';

const Nav_bar = () => {
  const location = useLocation();
  const { account, connectWallet } = useContext(Web3Context);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">🩺</span>
          <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 tracking-tight">
            ArogyaBridge
          </span>
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            to="/"
            className={`font-semibold text-sm transition-colors relative py-1 ${
              isActive('/') ? 'text-teal-700 font-bold' : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            Home
            {isActive('/') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </Link>

          <Link
            to="/home"
            className={`font-semibold text-sm transition-colors relative py-1 ${
              isActive('/home') ? 'text-teal-700 font-bold' : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            Portals
            {isActive('/home') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </Link>

          <Link
            to="/about"
            className={`font-semibold text-sm transition-colors relative py-1 ${
              isActive('/about') ? 'text-teal-700 font-bold' : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            About
            {isActive('/about') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </Link>

          <Link
            to="/login"
            className={`font-semibold text-sm transition-colors relative py-1 ${
              isActive('/login') ? 'text-teal-700 font-bold' : 'text-slate-600 hover:text-teal-700'
            }`}
          >
            Login
            {isActive('/login') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-full"></span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {account ? (
            <div
              className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full shadow-sm"
              title="MetaMask Wallet Connected"
            >
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-mono font-semibold text-teal-800">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-full text-xs font-bold shadow-sm transition hover:shadow"
              title="Connect MetaMask (Required only for blockchain transactions)"
            >
              <span className="text-sm">🦊</span>
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav_bar;