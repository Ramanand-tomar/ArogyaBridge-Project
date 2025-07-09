import React from 'react'

const Nav_bar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-700 shadow-xl animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold text-white tracking-tight animate-bounce">🩺</span>
          <span className="text-2xl font-bold text-white drop-shadow-lg animate-fade-in">ArogyaBridge</span>
        </div>
        <div className="flex gap-6">
          <a href="/" className="text-white font-semibold hover:text-teal-300 transition-colors duration-200 text-lg relative group">
            Home
            <span className="block h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </a>
          <a href="/home" className="text-white font-semibold hover:text-teal-300 transition-colors duration-200 text-lg relative group">
            DashBoard
            <span className="block h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </a>
          
          <a href="/about" className="text-white font-semibold hover:text-teal-300 transition-colors duration-200 text-lg relative group">
            About
            <span className="block h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </a>
          
        </div>
        <div className="hidden md:flex items-center gap-2 animate-fade-in">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-xs text-white opacity-80"><a href="/login" className="text-white font-semibold hover:text-teal-300 transition-colors duration-200 text-lg relative group">
            Login
            <span className="block h-0.5 bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </a>


          </span>
        </div>
      </div>
    </nav>
  )
}

export default Nav_bar