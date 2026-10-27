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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/95 border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all shadow-sm">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">🩺</span>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-lg sm:text-xl">
            ArogyaBridge
          </span>
        </Link>
        <span className="h-4 w-px bg-slate-300 hidden sm:block" />
        <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
          {roleBadge}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {account && (
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 shadow-inner"
            title={`Connected: ${account}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
          </div>
        )}

        <Link
          to="/"
          className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
        >
          Home
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 text-xs font-semibold transition"
          title="Sign out of this session"
        >
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
