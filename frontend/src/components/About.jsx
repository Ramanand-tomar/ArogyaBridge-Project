import React from 'react'
import Nav_bar from './Nav_bar'

const About = () => {
  return (
    
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700 flex flex-col items-center justify-center px-4 py-16 animate-fade-in">
      <Nav_bar/>
      <div className="absolute inset-0 z-0 opacity-60 blur-2xl pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1200" cy="200" r="300" fill="#38bdf8" fillOpacity="0.2" />
          <circle cx="300" cy="600" r="250" fill="#a78bfa" fillOpacity="0.2" />
        </svg>
      </div>
      <div className="relative z-10 max-w-3xl w-full bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-white/30 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg animate-bounce">About HealthRecords dApp</h1>
        <p className="text-lg text-white/90 mb-8 text-center animate-fade-in">
          HealthRecords is a next-generation decentralized healthcare record management system. We empower patients, doctors, and diagnostic centers to securely access, share, and manage medical records using blockchain and IPFS technology.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
          <div className="flex flex-col items-center bg-white/30 rounded-xl p-6 shadow-md animate-fade-in-up">
            <span className="text-3xl mb-2 animate-spin">🔒</span>
            <span className="font-bold text-white">Privacy & Security</span>
            <span className="text-sm text-white/80 text-center mt-2">Your health data is encrypted, decentralized, and only accessible by you and those you trust.</span>
          </div>
          <div className="flex flex-col items-center bg-white/30 rounded-xl p-6 shadow-md animate-fade-in-up">
            <span className="text-3xl mb-2 animate-spin">⚡</span>
            <span className="font-bold text-white">Instant Access</span>
            <span className="text-sm text-white/80 text-center mt-2">Access and share your records instantly with healthcare professionals and labs.</span>
          </div>
          <div className="flex flex-col items-center bg-white/30 rounded-xl p-6 shadow-md animate-fade-in-up">
            <span className="text-3xl mb-2 animate-spin">🌐</span>
            <span className="font-bold text-white">Decentralized</span>
            <span className="text-sm text-white/80 text-center mt-2">Built on blockchain & IPFS for transparency, reliability, and no single point of failure.</span>
          </div>
          <div className="flex flex-col items-center bg-white/30 rounded-xl p-6 shadow-md animate-fade-in-up">
            <span className="text-3xl mb-2 animate-spin">🤝</span>
            <span className="font-bold text-white">Seamless Collaboration</span>
            <span className="text-sm text-white/80 text-center mt-2">Doctors, patients, and diagnostic centers collaborate securely and efficiently.</span>
          </div>
        </div>
        <div className="w-full flex flex-col items-center mt-4 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white mb-2">Connect With Us</h2>
          <p className="text-white/80 mb-4 text-center">Have questions or want to join our mission? Reach out to our team!</p>
          <div className="flex gap-6">
            <a href="ramanandtomar1234@gmail.com" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300 animate-pulse">Email Us</a>
            <a href="https://www.linkedin.com/in/ramanand-tomar-478528342/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300 animate-pulse">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About