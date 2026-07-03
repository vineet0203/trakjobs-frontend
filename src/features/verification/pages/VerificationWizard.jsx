import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationApi } from '../api/verificationApi';
import { useAuth } from '../../auth/hooks/useAuth';

export default function VerificationWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [agreement, setAgreement] = useState(true);

  // ID Upload State
  const [idType, setIdType] = useState('driver_license');
  const [idFile, setIdFile] = useState(null);
  const [idFileName, setIdFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Email OTP State
  const [emailSent, setEmailSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailTimer, setEmailTimer] = useState(0);

  // WhatsApp OTP State
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneTimer, setPhoneTimer] = useState(0);

  // Load profile progress
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await verificationApi.getProgress();
        if (res.success && res.data) {
          const vData = res.data.verification_data || {};
          setFirstName(vData.first_name || user?.first_name || '');
          setLastName(vData.last_name || user?.last_name || '');
          setDob(vData.dob || '');
          setGender(vData.gender || '');
          
          // Pre-fill email and phone from DB User Profile
          setEmailInput(user?.email || vData.email || '');
          setPhoneInput(user?.mobile_number || user?.phone || vData.phone || '');
          
          if (res.data.document_type) {
            setIdType(res.data.document_type);
          }
          if (res.data.has_document) {
            setIdFileName('government_id_document');
          }
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [user]);

  // Handle countdown timers
  useEffect(() => {
    let emailInterval, phoneInterval;
    if (emailTimer > 0) {
      emailInterval = setInterval(() => setEmailTimer((prev) => prev - 1), 1000);
    }
    if (phoneTimer > 0) {
      phoneInterval = setInterval(() => setPhoneTimer((prev) => prev - 1), 1000);
    }
    return () => {
      clearInterval(emailInterval);
      clearInterval(phoneInterval);
    };
  }, [emailTimer, phoneTimer]);

  // Handle file selection and upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!idType) {
      alert('Please select an ID type first.');
      return;
    }

    setIdFile(file);
    setIdFileName(file.name);
    setUploading(true);
    setUploadProgress(30);

    try {
      const res = await verificationApi.uploadDocument(file, idType);
      if (res.success) {
        setUploadProgress(100);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload document.');
      setIdFileName('');
      setIdFile(null);
    } finally {
      setUploading(false);
    }
  };

  // Handle Send Email OTP
  const handleSendEmailOtp = async () => {
    setEmailError('');
    if (!emailInput.trim()) {
      setEmailError('Please enter your email address.');
      return;
    }

    try {
      await verificationApi.sendOtp('email', { email: emailInput.trim() });
      setEmailSent(true);
      setEmailTimer(45);
      alert('Verification code sent to your email.');
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Failed to send email OTP.');
    }
  };

  // Handle Verify Email OTP
  const handleVerifyEmailOtp = async () => {
    if (emailOtp.length !== 6) {
      alert('Please enter a 6-digit code.');
      return;
    }

    try {
      const res = await verificationApi.verifyOtp(emailOtp);
      if (res.success) {
        setEmailVerified(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Email verification failed.');
    }
  };

  // Handle Send WhatsApp OTP
  const handleSendPhoneOtp = async () => {
    setPhoneError('');
    if (!phoneInput.trim()) {
      setPhoneError('Please enter your mobile number.');
      return;
    }

    try {
      await verificationApi.sendOtp('whatsapp', { mobile_number: phoneInput.trim() });
      setPhoneSent(true);
      setPhoneTimer(45);
      alert('Verification code sent to your WhatsApp.');
    } catch (err) {
      setPhoneError(err.response?.data?.message || 'Failed to send WhatsApp OTP.');
    }
  };

  // Handle Verify WhatsApp OTP
  const handleVerifyPhoneOtp = async () => {
    if (phoneOtp.length !== 6) {
      alert('Please enter a 6-digit code.');
      return;
    }

    try {
      const res = await verificationApi.verifyOtp(phoneOtp);
      if (res.success) {
        setPhoneVerified(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'WhatsApp verification failed.');
    }
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !dob || !gender || !emailInput || !phoneInput) {
      alert('Please fill out all required fields.');
      return;
    }
    if (!idFileName) {
      alert('Please upload a copy of your identification document.');
      return;
    }
    if (!emailVerified) {
      alert('Please complete the Email verification step.');
      return;
    }
    if (!phoneVerified) {
      alert('Please complete the WhatsApp verification step.');
      return;
    }
    if (!agreement) {
      alert('You must confirm the legal agreement checkbox.');
      return;
    }

    setSubmitting(true);
    try {
      const finalData = {
        first_name: firstName,
        last_name: lastName,
        dob,
        gender,
        email: emailInput,
        phone: phoneInput,
      };

      // Save complete progress step 6 to trigger verified flag
      const res = await verificationApi.saveProgress(6, finalData);
      if (res.success) {
        localStorage.setItem('trakjobs_verification_status', 'verified');
        navigate('/verification-success');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit verification details.');
    } finally {
      setSubmitting(false);
    }
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
              <p className="text-white font-bold text-sm truncate max-w-[150px]">{firstName || 'New User'}</p>
              <p className="text-white/60 text-xs">Verification Profile</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <nav className="flex-1 px-8 space-y-6">
          <div className="flex items-start gap-4 relative">
            <div className="w-8 h-8 rounded-full bg-[#ffb800] text-[#0d1b2a] font-bold flex items-center justify-center shrink-0 z-10 text-sm">
              1
            </div>
            <div>
              <p className="font-bold text-white text-sm">Personal Info</p>
              <p className="text-white/40 text-[11px]">Basic details &amp; ID</p>
            </div>
          </div>
          <div className="flex items-start gap-4 relative">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/20 text-white/40 font-bold flex items-center justify-center shrink-0 z-10 text-sm">2</div>
            <div>
              <p className="font-bold text-white/40 text-sm">Contact Info</p>
              <p className="text-white/20 text-[11px]">How to reach you</p>
            </div>
          </div>
          <div className="flex items-start gap-4 relative">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/20 text-white/40 font-bold flex items-center justify-center shrink-0 z-10 text-sm">3</div>
            <div>
              <p className="font-bold text-white/40 text-sm">Service Address</p>
              <p className="text-white/20 text-[11px]">Where we serve you</p>
            </div>
          </div>
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
      <main className="flex-1 bg-[#f7f9fb] overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center px-12 sticky top-0 z-40">
          <div className="flex justify-between items-center w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#22c55e] text-3xl">verified</span>
              <div>
                <h1 className="text-lg font-bold text-[#0d1b2a] uppercase tracking-tight">Verified Customer Form</h1>
                <p className="text-xs text-gray-500">Step 1 of 1: Personal Information</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#f7f9fb] rounded-full">
              <span className="material-symbols-outlined text-[18px] text-[#64748b]">lock</span>
              <span className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider">End-to-end encrypted</span>
            </div>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-5xl mx-auto">
          {/* Form Completion Bar */}
          <div className="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-700">Form Completion</span>
              <span className="text-xs font-bold text-[#ffb800]">{agreement && emailVerified && phoneVerified && idFileName ? '100%' : '16%'} Complete</span>
            </div>
            <div className="h-3 w-full bg-[#f0f2f5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#ffb800] transition-all duration-500 rounded-full" 
                style={{ width: agreement && emailVerified && phoneVerified && idFileName ? '100%' : '16%' }}
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
                <h3 className="text-xl font-bold text-[#0d1b2a]">Personal Information</h3>
                <p className="text-sm text-gray-500 mt-1">Please provide your legal information as it appears on your government-issued ID.</p>
              </div>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-200">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0d1b2a] block">First Name <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. John" 
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0d1b2a] text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0d1b2a] block">Last Name <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Doe" 
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0d1b2a] text-sm"
                  />
                </div>
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0d1b2a] block">Date of Birth <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0d1b2a] text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0d1b2a] block">Gender <span class="text-red-500">*</span></label>
                  <select 
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0d1b2a] text-sm bg-white"
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0d1b2a] block">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      disabled
                      type="email" 
                      value={emailInput}
                      className="w-full h-12 pl-4 pr-10 rounded-xl border border-gray-300 bg-gray-50 text-gray-500 text-sm"
                    />
                    {emailVerified && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22c55e]">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0d1b2a] block">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input 
                      disabled
                      type="tel" 
                      value={phoneInput}
                      className="w-full h-12 pl-4 pr-10 rounded-xl border border-gray-300 bg-gray-50 text-gray-500 text-sm"
                    />
                    {phoneVerified && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22c55e]">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      </div>
                    )}
                  </div>
                  {phoneVerified && (
                    <p className="text-[11px] text-[#22c55e] flex items-center gap-1 mt-1 font-semibold">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Verified Phone Number
                    </p>
                  )}
                </div>
              </div>

              {/* Identification Verification */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-base font-bold text-[#0d1b2a] mb-1">Identification Verification</h4>
                <p className="text-xs text-gray-500 mb-6">Your security is our priority. Please select ID type and upload a clear photo of your ID.</p>
                
                {/* ID Type Choice */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {['driver_license', 'passport', 'national_id'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setIdType(type)}
                      className={`h-11 rounded-xl border text-xs font-bold transition-all ${
                        idType === type 
                          ? 'border-[#0d1b2a] bg-[#0d1b2a]/5 text-[#0d1b2a]' 
                          : 'border-gray-300 hover:border-gray-400 text-gray-600'
                      }`}
                    >
                      {type === 'driver_license' && "Driver's License"}
                      {type === 'passport' && 'Passport'}
                      {type === 'national_id' && 'National ID'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* File Upload Box */}
                  <div className="lg:col-span-2 border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#f8fafc] hover:bg-white hover:border-[#ffb800] transition-all cursor-pointer relative group">
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileUpload} 
                    />
                    
                    {!idFileName && !uploading && (
                      <>
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-slate-400 group-hover:text-[#ffb800] transition-colors">
                          <span className="material-symbols-outlined text-3xl">upload_file</span>
                        </div>
                        <p className="text-sm font-bold text-[#0d1b2a]">Upload ID (Front Side)</p>
                        <p className="text-xs text-gray-400 mt-1">Drag & drop your file here or click to browse</p>
                        <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest">JPG, PNG or PDF • Max 5MB</p>
                      </>
                    )}

                    {uploading && (
                      <div className="w-full">
                        <p className="text-xs font-bold text-[#0d1b2a] mb-2">Uploading ID Document... {uploadProgress}%</p>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#ffb800]" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {idFileName && !uploading && (
                      <>
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-[#22c55e]">
                          <span className="material-symbols-outlined text-3xl">check_circle</span>
                        </div>
                        <p className="text-sm font-bold text-[#0d1b2a]">{idFileName}</p>
                        <p className="text-xs text-[#22c55e] font-semibold mt-1">Upload completed! Click or drag to replace.</p>
                      </>
                    )}
                  </div>

                  {/* Requirements card */}
                  <div className="bg-[#f2f4f6] border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <h5 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest">Requirement List</h5>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <span className="material-symbols-outlined text-[18px] text-[#22c55e]">check_circle</span>
                          Driver's License
                        </li>
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <span className="material-symbols-outlined text-[18px] text-[#22c55e]">check_circle</span>
                          Passport
                        </li>
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <span className="material-symbols-outlined text-[18px] text-[#22c55e]">check_circle</span>
                          State ID Card
                        </li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex items-start gap-2 mt-6">
                      <span className="material-symbols-outlined text-slate-400 text-sm">verified_user</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed">Your identification data is stored securely using AES-256 bank-level encryption.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Verification Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-bold text-[#0d1b2a]">Email Verification</h4>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Required</span>
                </div>
                
                {emailVerified ? (
                  <p className="text-xs text-[#22c55e] font-bold flex items-center gap-1 mt-2">
                    <span className="material-symbols-outlined text-sm">verified</span> Verified successfully
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 mb-4">We will send a 6-digit verification code to <span className="font-bold text-[#0d1b2a]">{emailInput}</span></p>
                    <div className="flex flex-wrap items-center gap-4">
                      {!emailSent ? (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          className="px-6 h-11 bg-[#0d1b2a] hover:bg-[#1a2c3f] text-white text-xs font-bold rounded-xl transition-all"
                        >
                          Send Email OTP
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <input 
                            type="text" 
                            maxLength={6}
                            placeholder="Enter 6-Digit Code"
                            value={emailOtp}
                            onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-40 h-11 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0d1b2a] text-center text-sm font-bold tracking-widest"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyEmailOtp}
                            className="px-6 h-11 bg-[#22c55e] hover:bg-[#1bb853] text-white text-xs font-bold rounded-xl transition-all"
                          >
                            Verify Code
                          </button>
                          <button
                            type="button"
                            disabled={emailTimer > 0}
                            onClick={handleSendEmailOtp}
                            className="px-4 h-11 border border-gray-300 text-gray-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
                          >
                            {emailTimer > 0 ? `Resend (${emailTimer}s)` : 'Resend Code'}
                          </button>
                        </div>
                      )}
                    </div>
                    {emailError && <p className="text-xs text-red-500 mt-2">{emailError}</p>}
                  </>
                )}
              </div>

              {/* WhatsApp Verification Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-bold text-[#0d1b2a]">WhatsApp Verification</h4>
                  <span className="px-2 py-0.5 bg-[#25d366]/10 text-[#25d366] text-[10px] font-bold rounded uppercase tracking-wider">Secure</span>
                </div>
                
                {phoneVerified ? (
                  <p className="text-xs text-[#22c55e] font-bold flex items-center gap-1 mt-2">
                    <span className="material-symbols-outlined text-sm">verified</span> Verified successfully
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 mb-4">We will send a 6-digit code to your WhatsApp number <span className="font-bold text-[#0d1b2a]">{phoneInput}</span></p>
                    <div className="flex flex-wrap items-center gap-4">
                      {!phoneSent ? (
                        <button
                          type="button"
                          onClick={handleSendPhoneOtp}
                          className="px-6 h-11 bg-[#0d1b2a] hover:bg-[#1a2c3f] text-white text-xs font-bold rounded-xl transition-all"
                        >
                          Send WhatsApp OTP
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <input 
                            type="text" 
                            maxLength={6}
                            placeholder="Enter 6-Digit Code"
                            value={phoneOtp}
                            onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-40 h-11 px-4 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0d1b2a] text-center text-sm font-bold tracking-widest"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyPhoneOtp}
                            className="px-6 h-11 bg-[#22c55e] hover:bg-[#1bb853] text-white text-xs font-bold rounded-xl transition-all"
                          >
                            Verify Code
                          </button>
                          <button
                            type="button"
                            disabled={phoneTimer > 0}
                            onClick={handleSendPhoneOtp}
                            className="px-4 h-11 border border-gray-300 text-gray-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
                          >
                            {phoneTimer > 0 ? `Resend (${phoneTimer}s)` : 'Resend Code'}
                          </button>
                        </div>
                      )}
                    </div>
                    {phoneError && <p className="text-xs text-red-500 mt-2">{phoneError}</p>}
                  </>
                )}
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-4 p-5 bg-[#f8fafc] rounded-2xl border border-gray-200">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#0d1b2a] focus:ring-[#ffb800] mt-0.5"
                />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
                  I confirm that all provided information is accurate and matches my legal documentation. I agree to the <a className="text-[#0d1b2a] font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-[#0d1b2a] font-bold hover:underline" href="#">Privacy Policy</a>.
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 border-t border-gray-200">
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-10 h-14 rounded-xl border border-gray-300 text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:flex-1 h-14 bg-[#ffb800] hover:bg-[#e0a300] text-[#0d1b2a] rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all shadow-md text-sm"
                >
                  {submitting ? 'Submitting...' : 'Save & Continue'}
                  <span className="material-symbols-outlined font-bold text-sm">arrow_forward</span>
                </button>
              </div>
            </form>
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
