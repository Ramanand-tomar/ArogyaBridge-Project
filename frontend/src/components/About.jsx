import React from 'react';
import Nav_bar from './Nav_bar';

const About = () => {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center px-4 py-24 overflow-hidden selection:bg-teal-100 selection:text-teal-900">
      <Nav_bar />

      {/* Subtle ambient light background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl w-full bg-white rounded-3xl shadow-sm p-8 sm:p-12 flex flex-col items-center border border-slate-200/90">
        <span className="text-4xl mb-3">🩺</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-700 mb-4 text-center tracking-tight">
          About ArogyaBridge
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-10 text-center max-w-2xl leading-relaxed">
          ArogyaBridge is an enterprise-grade decentralized electronic health record (EHR) management system.
          We empower patients, licensed practitioners, and diagnostic laboratories to securely share, access,
          and verify health records using Ethereum smart contracts and distributed IPFS storage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
          <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-400/50 transition-all duration-200">
            <span className="p-3 rounded-xl bg-teal-100/70 text-2xl mb-3 border border-teal-200">🔒</span>
            <h3 className="font-bold text-slate-900 text-lg">Patient-Governed Privacy</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Zero plaintext health credentials on-chain. Patients hold cryptographic sovereignty and can grant or revoke doctor viewing access at any moment.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-400/50 transition-all duration-200">
            <span className="p-3 rounded-xl bg-cyan-100/70 text-2xl mb-3 border border-cyan-200">⚡</span>
            <h3 className="font-bold text-slate-900 text-lg">Instant Record Exchange</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Eliminate paper friction. Access lab diagnostics, clinical prescriptions, and past medical histories instantly through encrypted peer-to-peer pipelines.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-400/50 transition-all duration-200">
            <span className="p-3 rounded-xl bg-blue-100/70 text-2xl mb-3 border border-blue-200">🌐</span>
            <h3 className="font-bold text-slate-900 text-lg">Tamper-Proof Audit Trails</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Smart contracts maintain an immutable record of practitioner credentials and diagnostic attestations, ensuring trust and HIPAA/GDPR alignment.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-400/50 transition-all duration-200">
            <span className="p-3 rounded-xl bg-purple-100/70 text-2xl mb-3 border border-purple-200">🤝</span>
            <h3 className="font-bold text-slate-900 text-lg">Unified Collaboration</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Connect hospitals, private specialists, and diagnostic centers into a shared interoperable network with zero single point of failure.
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center pt-6 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connect With The Team</h2>
          <p className="text-slate-600 text-sm mb-5 text-center">
            Have questions, feedback, or need clinical integration assistance?
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:ramanandtomar1234@gmail.com"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold text-sm shadow-sm transition-all duration-200"
            >
              ✉️ Email Us
            </a>
            <a
              href="https://www.linkedin.com/in/ramanand-tomar-478528342/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm border border-slate-300 transition-all duration-200"
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