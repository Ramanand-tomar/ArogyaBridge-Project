import React from 'react';
import Nav_bar from './Nav_bar';

const About = () => {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
      <Nav_bar />

      {/* Ambient background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl w-full bg-slate-900/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col items-center border border-slate-800">
        <span className="text-4xl mb-3">🩺</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 mb-4 text-center">
          About ArogyaBridge
        </h1>
        <p className="text-base sm:text-lg text-slate-300 mb-10 text-center max-w-2xl leading-relaxed">
          ArogyaBridge is an enterprise-grade decentralized electronic health record (EHR) management system.
          We empower patients, licensed practitioners, and diagnostic laboratories to securely share, access,
          and verify health records using Ethereum smart contracts and distributed IPFS storage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
          <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition-all duration-300">
            <span className="p-3 rounded-xl bg-teal-500/10 text-2xl mb-3 border border-teal-500/20">🔒</span>
            <h3 className="font-bold text-slate-100 text-lg">Patient-Governed Privacy</h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Zero plaintext health credentials on-chain. Patients hold cryptographic sovereignty and can grant or revoke doctor viewing access at any moment.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition-all duration-300">
            <span className="p-3 rounded-xl bg-cyan-500/10 text-2xl mb-3 border border-cyan-500/20">⚡</span>
            <h3 className="font-bold text-slate-100 text-lg">Instant Record Exchange</h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Eliminate paper friction. Access lab diagnostics, clinical prescriptions, and past medical histories instantly through encrypted peer-to-peer pipelines.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition-all duration-300">
            <span className="p-3 rounded-xl bg-blue-500/10 text-2xl mb-3 border border-blue-500/20">🌐</span>
            <h3 className="font-bold text-slate-100 text-lg">Tamper-Proof Audit Trails</h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Smart contracts maintain an immutable record of practitioner credentials and diagnostic attestations, ensuring trust and HIPAA/GDPR alignment.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition-all duration-300">
            <span className="p-3 rounded-xl bg-purple-500/10 text-2xl mb-3 border border-purple-500/20">🤝</span>
            <h3 className="font-bold text-slate-100 text-lg">Unified Collaboration</h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Connect hospitals, private specialists, and diagnostic centers into a shared interoperable network with zero single point of failure.
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center pt-6 border-t border-slate-800">
          <h2 className="text-xl font-bold text-slate-200 mb-2">Connect With The Team</h2>
          <p className="text-slate-400 text-sm mb-5 text-center">
            Have questions, feedback, or need clinical integration assistance?
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:ramanandtomar1234@gmail.com"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold text-sm shadow-lg hover:scale-105 transition-all duration-200"
            >
              ✉️ Email Us
            </a>
            <a
              href="https://www.linkedin.com/in/ramanand-tomar-478528342/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 hover:scale-105 transition-all duration-200"
            >
              LinkedIn Profile ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;