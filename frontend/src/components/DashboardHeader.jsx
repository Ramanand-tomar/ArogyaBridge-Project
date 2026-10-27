import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Web3Context } from '../context/Web3Context';
import toast from 'react-hot-toast';

const DashboardHeader = ({ portalTitle = 'Portal', roleBadge = 'User' }) => {
  const { account } = useContext(Web3Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('arogya_auth_token');
    localStorage.removeItem('arogya_user');
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-gray-950/85 border-b border-gray-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">🩺</span>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-lg sm:text-xl">
            ArogyaBridge
          </span>
        </Link>
        <span className="h-4 w-px bg-gray-800 hidden sm:block" />
        <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/25">
          {roleBadge}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {account && (
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs font-mono text-gray-300 shadow-inner"
            title={`Connected: ${account}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
          </div>
        )}

        <Link
          to="/"
          className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 transition"
        >
          Home
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 text-xs font-semibold transition"
          title="Sign out of this session"
        >
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
