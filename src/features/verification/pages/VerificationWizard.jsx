import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepPersonal from '../components/StepPersonal';
import StepContact from '../components/StepContact';
import StepAddress from '../components/StepAddress';
import StepIdentity from '../components/StepIdentity';
import StepOTP from '../components/StepOTP';
import StepReview from '../components/StepReview';
import { verificationApi } from '../api/verificationApi';
import { useAuth } from '../../auth/hooks/useAuth';

const steps = [
  { title: 'Personal Info', desc: 'Basic details' },
  { title: 'Contact Info', desc: 'How to reach you' },
  { title: 'Address Info', desc: 'Where we serve you' },
  { title: 'Identity Document', desc: 'Verification upload' },
  { title: 'OTP Verification', desc: 'Verify email & phone' },
  { title: 'Review & Submit', desc: 'Submit details' },
];

export default function VerificationWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await verificationApi.getProgress();
        if (res.success && res.data) {
          setCurrentStep(Math.max(0, (res.data.current_step || 1) - 1));
          setFormData(res.data.verification_data || {});
        }
      } catch (err) {
        console.error('Error fetching verification progress:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  const handleDataChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      const nextStepIndex = currentStep + 1;
      const res = await verificationApi.saveProgress(currentStep + 1, formData);

      if (nextStepIndex >= steps.length) {
        localStorage.setItem('trakjobs_verification_status', 'verified');
        navigate('/verification-success');
      } else {
        setCurrentStep(nextStepIndex);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save progress.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCancel = () => {
    navigate('/verification-required');
  };

  const renderActiveStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepPersonal
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onCancel={handleCancel}
          />
        );
      case 1:
        return (
          <StepContact
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <StepAddress
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepIdentity
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <StepOTP
            data={formData}
            onChange={handleDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <StepReview
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const percentComplete = Math.round(((currentStep) / steps.length) * 100);

  const getDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
    return 'New User';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d1b2a]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full mx-auto overflow-hidden min-h-screen bg-[#f7f9fb] font-sans">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col h-screen w-[300px] bg-[#0d1b2a] sticky top-0 overflow-hidden shrink-0">
        {/* Brand Section */}
        <div className="p-8 pb-10 flex items-center gap-2">
          <span className="w-8 h-8 rounded-md bg-[#ffb800] text-[#0d1b2a] flex items-center justify-center text-lg font-extrabold">T</span>
          <span className="text-xl font-black text-white tracking-tight">Trak<span className="text-[#ffb800]">Jobs</span></span>
        </div>

        {/* Profile / Welcome */}
        <div className="px-8 mb-10">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="w-10 h-10 rounded-full bg-[#ffb800] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#0d1b2a] font-bold">person</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm truncate max-w-[150px]">{getDisplayName()}</p>
              <p className="text-white/60 text-xs">Verification Profile</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <nav className="flex-1 px-8 overflow-y-auto space-y-6">
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;

            return (
              <div key={index} className="flex items-start gap-4 relative">
                {/* Step Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] ${isCompleted ? 'bg-[#ffb800]' : 'bg-white/10'}`} />
                )}
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                  isCompleted 
                    ? 'bg-[#ffb800] text-[#0d1b2a] font-bold' 
                    : isActive 
                    ? 'bg-white/10 border-2 border-[#ffb800] text-white font-bold' 
                    : 'bg-white/5 border border-white/20 text-white/40 font-bold'
                } text-sm`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : index + 1}
                </div>

                <div>
                  <p className={`font-bold text-sm ${isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-white/40'}`}>
                    {step.title}
                  </p>
                  <p className={`text-[11px] ${isActive ? 'text-white/60' : 'text-white/20'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom Support */}
        <div className="p-8 bg-black/20 mt-auto">
          <div className="flex items-center gap-3 text-white/60 mb-2">
            <span className="material-symbols-outlined text-[#ffb800] text-base">help</span>
            <span className="text-xs font-bold uppercase tracking-wider">Support</span>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed mb-4">Need help completing this form? Contact our support team.</p>
          <div className="space-y-1">
            <a className="text-white hover:text-[#ffb800] text-xs transition-colors block" href="mailto:support@trakjobs.com">support@trakjobs.com</a>
            <p className="text-white/80 text-xs">(972) 555-0199</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main class="flex-1 bg-[#f7f9fb] overflow-y-auto">
        {/* Top Header (Desktop View) */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center px-12 sticky top-0 z-40">
          <div className="flex justify-between items-center w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#22c55e] text-3xl">verified</span>
              <div>
                <h1 className="text-lg font-bold text-[#0d1b2a] uppercase tracking-tight">Verified Account Wizard</h1>
                <p className="text-xs text-gray-500">Step {currentStep + 1} of 6: {steps[currentStep].title}</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#f7f9fb] rounded-full">
              <span className="material-symbols-outlined text-[18px] text-[#64748b]">lock</span>
              <span className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider">End-to-end encrypted</span>
            </div>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-5xl mx-auto">
          {/* Progress Header */}
          <div className="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-700">Form Completion</span>
              <span className="text-xs font-bold text-[#ffb800]">{percentComplete}% Complete</span>
            </div>
            <div className="h-3 w-full bg-[#f0f2f5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#ffb800] transition-all duration-500 rounded-full" 
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Form Title Section */}
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#0d1b2a] text-[#ffb800] flex items-center justify-center shrink-0 shadow-lg">
                <span className="material-symbols-outlined text-4xl">person_pin</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0d1b2a]">{steps[currentStep].title}</h3>
                <p className="text-sm text-gray-500 mt-1">Please provide the details required for this verification step.</p>
              </div>
            </div>

            {/* Active Step Content Card */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-200">
              {renderActiveStep()}
            </div>
          </div>

          {/* Content Footer */}
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center px-4 gap-6">
            <p className="text-xs text-slate-400 font-medium">© 2026 TrakJobs Professional Services. All rights reserved.</p>
            <div className="flex gap-8">
              <a className="text-xs text-slate-400 hover:text-[#0d1b2a] transition-colors font-bold uppercase tracking-widest" href="#">Help Center</a>
              <a className="text-xs text-slate-400 hover:text-[#0d1b2a] transition-colors font-bold uppercase tracking-widest" href="#">Privacy</a>
              <a className="text-xs text-slate-400 hover:text-[#0d1b2a] transition-colors font-bold uppercase tracking-widest" href="#">Contact</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
