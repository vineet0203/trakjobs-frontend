import React from 'react';
import { APP_NAME } from '../../../../utils/constants';
import registerBgImg from '../../../../assets/Register_page_background.webp';

const AuthLayout = ({ children, title, isRegister = false }) => {
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (window.location.port === '5174' || window.location.port === '5175') {
      window.location.href = `http://${window.location.hostname}:5173`;
    } else {
      window.location.href = '/';
    }
  };

  if (isRegister) {
    return (
      <div
        className="min-h-screen lg:h-screen lg:overflow-hidden font-poppins relative flex flex-col lg:flex-row"
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

        {/* Decorative ambient elements */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FFB24A] opacity-20 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 right-6 h-80 w-80 rounded-full bg-[#35C6C6] opacity-20 blur-2xl pointer-events-none"></div>
        <div className="absolute top-24 right-12 h-40 w-40 rounded-full bg-white opacity-5 blur-xl pointer-events-none" style={{ animation: 'floatSlow 8s ease-in-out infinite' }}></div>

        {/* Left Side Column: Fixed viewport height on desktop, no scrolling */}
        <div className="w-full lg:w-[42%] lg:h-full flex flex-col justify-between p-8 lg:p-12 text-white border-b lg:border-b-0 lg:border-r border-white/10 bg-white/5 backdrop-blur-md relative z-20 lg:overflow-hidden">
          <div className="flex flex-col gap-8 h-full justify-between">
            {/* Logo */}
            <div style={{ animation: 'riseIn 0.6s ease' }}>
              <a 
                href="/" 
                onClick={handleLogoClick} 
                className="flex items-center gap-3 w-fit"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#0F2744]">
                  <div className="relative">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 12V22H22V12L12 2Z" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22V12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="leading-none pt-1 text-left">
                  <span className="text-[22px] font-bold tracking-tight text-white">
                    Trak<span className="text-[#ffb800]">Jobs</span>
                  </span>
                  <div className="mt-0.5 text-[10px] font-semibold text-slate-300 tracking-wide uppercase">
                    Fix it. Right. On time.
                  </div>
                </div>
              </a>
            </div>

            {/* Service Visuals Grid */}
            <div className="my-auto py-4 flex flex-col">
              <div className="w-full overflow-hidden rounded-2xl border border-white/20 shadow-xl" style={{ animation: 'riseIn 0.8s ease' }}>
                <img 
                  src={registerBgImg} 
                  alt="TrakJobs Services" 
                  className="w-full h-auto object-cover block" 
                />
              </div>

              {/* Why Partner with Us checklist */}
              <div className="mt-8 flex flex-col gap-4" style={{ animation: 'riseIn 1s ease' }}>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#ffb800]">WHY PARTNER WITH US?</h4>
                <div className="flex flex-col gap-3.5 text-xs lg:text-sm text-white/90">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-white font-semibold">Grow Your Business:</strong> Access thousands of customer booking requests in your service areas daily.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-white font-semibold">Direct Communication:</strong> Real-time built-in chat system to converse directly with customers.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-white font-semibold">Guaranteed Secure Payments:</strong> Experience safe and quick invoicing directly linked to your bank.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom info/footer */}
            <div className="text-xs text-white/40 border-t border-white/10 pt-4 mt-auto">
              © {new Date().getFullYear()} TrakJobs Inc. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side Column: Scrollable Form container */}
        <div className="w-full lg:w-[58%] lg:h-full flex items-start justify-center p-4 sm:p-8 lg:p-12 z-10 lg:overflow-y-auto">
          <div
            className="w-full max-w-2xl bg-white/95 rounded-3xl border border-white/60 shadow-[0_30px_80px_rgba(8,22,44,0.25)] p-6 sm:p-10 my-4"
            style={{ animation: 'riseIn 0.6s ease' }}
          >
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#3B556D]">Secure Portal</p>
              <h2 className="font-semibold text-[#0F2744] text-2xl sm:text-3xl uppercase mt-1">
                {title}
              </h2>
              <p className="text-sm text-[#5D7389] mt-2">
                Complete your vendor profile to start receiving requests.
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    );
  }

  // Original layout for non-register (login, forgot password, etc.)
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-poppins relative overflow-hidden"
      style={{
        background: 'radial-gradient(1200px 500px at 80% -10%, #FFECC7 0%, rgba(255, 236, 199, 0) 60%), linear-gradient(135deg, #0B1F3B 0%, #1F4A7A 55%, #2E6D9D 100%)'
      }}
    >
      <style>{`
        @keyframes floatSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FFB24A] opacity-20 blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-24 right-6 h-80 w-80 rounded-full bg-[#35C6C6] opacity-20 blur-2xl pointer-events-none"></div>
      <div className="absolute top-24 right-12 h-40 w-40 rounded-full bg-white opacity-10 blur-xl pointer-events-none" style={{ animation: 'floatSlow 8s ease-in-out infinite' }}></div>

      <div className="relative z-10 w-full max-w-md">
        <div
          className="relative bg-white/95 rounded-3xl border border-white/60 shadow-[0_30px_80px_rgba(8,22,44,0.35)] p-6 sm:p-8"
          style={{ animation: 'riseIn 0.6s ease' }}
        >
          {/* TrakJobs Logo Branding */}
          <div className="flex justify-center mb-6">
            <a 
              href="/" 
              onClick={handleLogoClick} 
              className="flex items-center gap-3"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#0F2744]">
                <div className="relative">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 12V22H22V12L12 2Z" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22V12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="leading-none pt-1 text-left">
                <span className="text-[22px] font-bold tracking-tight text-[#0F2744]">
                  Trak<span className="text-[#ffb800]">Jobs</span>
                </span>
                <div className="mt-0.5 text-[10px] font-semibold text-slate-500 tracking-wide uppercase">
                  Fix it. Right. On time.
                </div>
              </div>
            </a>
          </div>

          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#3B556D]">Secure Portal</p>
            <h2 className="font-semibold text-[#0F2744] text-3xl uppercase">
              {title}
            </h2>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;