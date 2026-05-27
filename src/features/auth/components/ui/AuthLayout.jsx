import React from 'react';
import { APP_NAME } from '../../../../utils/constants';

const AuthLayout = ({ children, title, isRegister = false }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-poppins relative overflow-hidden"
      style={{
        background: 'radial-gradient(1200px 500px at 80% -10%, #FFECC7 0%, rgba(255, 236, 199, 0) 60%), linear-gradient(135deg, #0B1F3B 0%, #1F4A7A 55%, #2E6D9D 100%)'
      }}
    >
      <style>{`
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FFB24A] opacity-20 blur-2xl"></div>
      <div className="absolute -bottom-24 right-6 h-80 w-80 rounded-full bg-[#35C6C6] opacity-20 blur-2xl"></div>
      <div className="absolute top-24 right-12 h-40 w-40 rounded-full bg-white opacity-10 blur-xl" style={{ animation: 'floatSlow 8s ease-in-out infinite' }}></div>

      <div
        className={`relative z-10 w-full ${isRegister ? 'max-w-6xl grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 items-stretch' : 'max-w-md'}`}
      >
        {isRegister && (
          <div className="hidden lg:flex flex-col justify-between text-white p-8 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div style={{ animation: 'riseIn 0.6s ease' }}>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Vendor Onboarding</p>
              <h1 className="text-4xl font-semibold mt-3">{APP_NAME}</h1>
              <p className="text-lg text-white/80 mt-4">
                Build trust fast. Manage services, schedules, and availability in one professional workspace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ animation: 'riseIn 0.8s ease' }}>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p className="text-sm text-white/70">Setup time</p>
                <p className="text-2xl font-semibold">Under 5 min</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p className="text-sm text-white/70">Support</p>
                <p className="text-2xl font-semibold">24/7 Priority</p>
              </div>
            </div>

            <ul className="space-y-3 text-white/85" style={{ animation: 'riseIn 1s ease' }}>
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[#FFB24A]"></span>
                Fast verification workflow
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[#35C6C6]"></span>
                Service catalog with custom entries
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[#FDE68A]"></span>
                Availability presets + custom hours
              </li>
            </ul>
          </div>
        )}

        <div
          className="relative bg-white/95 rounded-3xl border border-white/60 shadow-[0_30px_80px_rgba(8,22,44,0.35)] p-6 sm:p-8"
          style={{ animation: 'riseIn 0.6s ease' }}
        >
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#3B556D]">Secure Registration</p>
            <h2 className={`font-semibold text-[#0F2744] ${isRegister ? 'text-3xl' : 'text-4xl'} uppercase`}>
              {title}
            </h2>
            {isRegister && (
              <p className="text-sm text-[#5D7389] mt-2">
                Complete your vendor profile to start receiving requests.
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;