import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CheckCircle, HelpCircle, FileText, UploadCloud, Shield, Check, Mail, Phone, ArrowRight, X } from 'lucide-react';
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

  const getCompletionPercentage = () => {
    let pct = 0;
    if (firstName && lastName && dob && gender) pct += 25;
    if (idFileName) pct += 25;
    if (emailVerified) pct += 25;
    if (phoneVerified) pct += 25;
    return pct;
  };

  const percentComplete = getCompletionPercentage();

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

  // Sidebar Steps
  const sidebarSteps = [
    { num: 1, title: 'Personal Info', desc: 'Legal name & details', done: !!(firstName && lastName && dob && gender) },
    { num: 2, title: 'Identity Verification', desc: 'Government-issued ID', done: !!idFileName },
    { num: 3, title: 'Contact Verification', desc: 'Email & WhatsApp checks', done: !!(emailVerified && phoneVerified) },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans text-slate-800 antialiased">
      {/* Brand Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#0d1b2a] text-[#ffb800] flex items-center justify-center text-xl font-black shadow-md">T</span>
            <div>
              <span className="text-xl font-extrabold text-[#0d1b2a] tracking-tight">Trak<span className="text-[#ffb800]">Jobs</span></span>
              <span className="hidden sm:inline-block ml-3 px-2.5 py-1 bg-slate-100 text-[#0d1b2a] text-[10px] font-bold rounded-md uppercase tracking-wider">Verification Center</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-150">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider">End-to-end encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Grid Wrapper */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sticky Left Sidebar */}
          <aside className="lg:col-span-1 bg-[#0d1b2a] text-white rounded-3xl p-6 h-fit lg:sticky lg:top-28 shadow-xl flex flex-col justify-between">
            <div>
              {/* Profile Card */}
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#ffb800] text-[#0d1b2a] flex items-center justify-center shrink-0 font-bold shadow-inner">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-extrabold text-sm truncate">{getDisplayName()}</p>
                  <p className="text-white/50 text-[10px] uppercase font-bold tracking-wider">Verification profile</p>
                </div>
              </div>

              {/* Steps Progress */}
              <nav className="space-y-6">
                {sidebarSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 relative">
                    {/* Line Connector */}
                    {idx < sidebarSteps.length - 1 && (
                      <div className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] ${step.done ? 'bg-[#ffb800]' : 'bg-white/15'}`} />
                    )}

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      step.done 
                        ? 'bg-[#ffb800] text-[#0d1b2a] font-black' 
                        : 'bg-white/5 border border-white/20 text-white/50 font-bold'
                    } text-sm`}>
                      {step.done ? <Check className="w-4 h-4 animate-pulse" strokeWidth={3} /> : step.num}
                    </div>

                    <div>
                      <p className={`font-bold text-sm ${step.done ? 'text-white/90' : 'text-white/40'}`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-white/30">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Support Box */}
            <div className="mt-12 pt-6 border-t border-white/10 bg-black/10 -mx-6 -mb-6 p-6 rounded-b-3xl">
              <div className="flex items-center gap-2 text-[#ffb800] mb-2">
                <HelpCircle className="w-4 h-4" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Support assistance</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed mb-3">Need help completing verification? Get in touch.</p>
              <a href="mailto:support@trakjobs.com" className="text-white text-xs font-bold block hover:underline hover:text-[#ffb800] transition-all">support@trakjobs.com</a>
              <p className="text-white/70 text-xs mt-1 font-semibold">(972) 555-0199</p>
            </div>
          </aside>

          {/* Right Content Form Column */}
          <main className="lg:col-span-3 space-y-8">
            
            {/* Completion Percentage Progress Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-[#0d1b2a] uppercase tracking-wider">Verification Completion</span>
                <span className="text-xs font-black text-[#ffb800]">{percentComplete}% Complete</span>
              </div>
              <div className="h-3 w-full bg-[#f0f2f5] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ffb800] transition-all duration-700 ease-out rounded-full" 
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>

            {/* Main Form Box */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Header Title Banner */}
              <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0d1b2a] text-[#ffb800] flex items-center justify-center shadow-md">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0d1b2a]">Personal Information</h2>
                  <p className="text-xs text-slate-500">Provide legal information exactly as printed on your government-issued ID.</p>
                </div>
              </div>

              {/* Form Content padding */}
              <div className="p-8 space-y-8">
                
                {/* 2-Column Grid for Personal Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0d1b2a] tracking-wide uppercase">First Name <span className="text-red-500">*</span></label>
                    <input 
                      required 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. John" 
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent text-sm transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0d1b2a] tracking-wide uppercase">Last Name <span className="text-red-500">*</span></label>
                    <input 
                      required 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Doe" 
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent text-sm transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0d1b2a] tracking-wide uppercase">Date of Birth <span className="text-red-500">*</span></label>
                    <input 
                      required 
                      type="date" 
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent text-sm transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0d1b2a] tracking-wide uppercase">Gender <span className="text-red-500">*</span></label>
                    <select 
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent text-sm transition-all shadow-sm bg-white"
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Email & Phone fields with Verified state indicator */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0d1b2a] tracking-wide uppercase">Registered Email Address</label>
                    <div className="relative">
                      <input 
                        disabled
                        type="email" 
                        value={emailInput}
                        className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm shadow-inner"
                      />
                      {emailVerified && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 flex items-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0d1b2a] tracking-wide uppercase">Registered WhatsApp Mobile</label>
                    <div className="relative">
                      <input 
                        disabled
                        type="tel" 
                        value={phoneInput}
                        className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm shadow-inner"
                      />
                      {phoneVerified && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 flex items-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Identification Verification File Upload Section */}
                <div className="pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-black text-[#0d1b2a] uppercase tracking-wider mb-1">Government ID Verification</h4>
                  <p className="text-xs text-slate-500 mb-6">Select your primary identification type and upload a clear scan of the document front side.</p>
                  
                  {/* Select ID Type Button Choice Row */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {['driver_license', 'passport', 'national_id'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setIdType(type)}
                        className={`h-12 rounded-xl border text-xs font-black transition-all ${
                          idType === type 
                            ? 'border-[#0d1b2a] bg-[#0d1b2a]/5 text-[#0d1b2a] shadow-sm' 
                            : 'border-slate-300 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {type === 'driver_license' && "Driver's License"}
                        {type === 'passport' && 'Passport'}
                        {type === 'national_id' && 'National ID Card'}
                      </button>
                    ))}
                  </div>

                  {/* Spacious Upload Frame */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 border-2 border-dashed border-slate-300 rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-[#f8fafc] hover:bg-white hover:border-[#ffb800] transition-all cursor-pointer relative group min-h-[220px]">
                      <input 
                        type="file" 
                        accept="image/*,application/pdf" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload} 
                      />
                      
                      {!idFileName && !uploading && (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4 text-slate-400 group-hover:text-[#ffb800] transition-transform group-hover:scale-105 duration-200">
                            <UploadCloud className="w-8 h-8" />
                          </div>
                          <p className="text-sm font-bold text-[#0d1b2a]">Choose File or Drag & Drop</p>
                          <p className="text-[11px] text-slate-400 mt-1.5 font-medium">PNG, JPG or PDF formats (Maximum file limit 5MB)</p>
                        </div>
                      )}

                      {uploading && (
                        <div className="w-full max-w-xs">
                          <p className="text-xs font-bold text-[#0d1b2a] mb-2 flex items-center justify-between">
                            <span>Uploading document...</span>
                            <span>{uploadProgress}%</span>
                          </p>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#ffb800] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        </div>
                      )}

                      {idFileName && !uploading && (
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4 text-emerald-500">
                            <CheckCircle className="w-8 h-8" strokeWidth={2.5} />
                          </div>
                          <p className="text-sm font-extrabold text-[#0d1b2a]">{idFileName}</p>
                          <p className="text-xs text-emerald-600 font-semibold mt-1">Upload verified successfully. Click or drag to replace.</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-[#f2f4f6] border border-slate-200 rounded-3xl p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Accepted IDs</span>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-2.5 text-xs font-extrabold text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> State Driver's License
                          </li>
                          <li className="flex items-center gap-2.5 text-xs font-extrabold text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Government Passport
                          </li>
                          <li className="flex items-center gap-2.5 text-xs font-extrabold text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> National Identity Card
                          </li>
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-slate-300 flex items-start gap-2.5 mt-6">
                        <Shield className="w-5 h-5 text-slate-400 shrink-0" />
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Your identity files are fully protected and stored using private AES-256 standard encryption.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Verification Section */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h4 className="text-sm font-black text-[#0d1b2a] uppercase tracking-wider">Email Verification</h4>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md uppercase tracking-wider">Required</span>
                  </div>
                  
                  {emailVerified ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 w-fit animate-fadeIn">
                      <CheckCircle className="w-4 h-4" /> 
                      <span>Email Verified Successfully</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500">We will send a 6-digit confirmation code to your email <span className="font-bold text-[#0d1b2a]">{emailInput}</span></p>
                      <div className="flex flex-wrap items-center gap-3">
                        {!emailSent ? (
                          <button
                            type="button"
                            onClick={handleSendEmailOtp}
                            className="h-11 px-6 bg-[#0d1b2a] hover:bg-[#1a2c3f] text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                          >
                            <Mail className="w-4 h-4" />
                            Send Email OTP
                          </button>
                        ) : (
                          <div className="flex flex-wrap items-center gap-3">
                            <input 
                              type="text" 
                              maxLength={6}
                              placeholder="6-Digit Code"
                              value={emailOtp}
                              onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                              className="w-40 h-11 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent text-center text-sm font-extrabold tracking-widest"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyEmailOtp}
                              className="h-11 px-6 bg-[#22c55e] hover:bg-[#1bb853] text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
                            >
                              Verify Code
                            </button>
                            <button
                              type="button"
                              disabled={emailTimer > 0}
                              onClick={handleSendEmailOtp}
                              className="h-11 px-5 border border-slate-300 text-slate-600 text-xs font-black rounded-xl hover:bg-slate-50 transition-all disabled:opacity-55 cursor-pointer"
                            >
                              {emailTimer > 0 ? `Resend (${emailTimer}s)` : 'Resend Code'}
                            </button>
                          </div>
                        )}
                      </div>
                      {emailError && <p className="text-xs text-red-500 font-semibold">{emailError}</p>}
                    </div>
                  )}
                </div>

                {/* WhatsApp Verification Section */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h4 className="text-sm font-black text-[#0d1b2a] uppercase tracking-wider">WhatsApp Verification</h4>
                    <span className="px-2.5 py-0.5 bg-[#25d366]/10 text-[#25d366] text-[10px] font-bold rounded-md uppercase tracking-wider">Secure</span>
                  </div>
                  
                  {phoneVerified ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 w-fit animate-fadeIn">
                      <CheckCircle className="w-4 h-4" /> 
                      <span>WhatsApp Number Verified Successfully</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500">We will send a 6-digit confirmation code to your WhatsApp <span className="font-bold text-[#0d1b2a]">{phoneInput}</span></p>
                      <div className="flex flex-wrap items-center gap-3">
                        {!phoneSent ? (
                          <button
                            type="button"
                            onClick={handleSendPhoneOtp}
                            className="h-11 px-6 bg-[#0d1b2a] hover:bg-[#1a2c3f] text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                          >
                            <Phone className="w-4 h-4" />
                            Send WhatsApp OTP
                          </button>
                        ) : (
                          <div className="flex flex-wrap items-center gap-3">
                            <input 
                              type="text" 
                              maxLength={6}
                              placeholder="6-Digit Code"
                              value={phoneOtp}
                              onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                              className="w-40 h-11 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ffb800] focus:border-transparent text-center text-sm font-extrabold tracking-widest"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyPhoneOtp}
                              className="h-11 px-6 bg-[#22c55e] hover:bg-[#1bb853] text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
                            >
                              Verify Code
                            </button>
                            <button
                              type="button"
                              disabled={phoneTimer > 0}
                              onClick={handleSendPhoneOtp}
                              className="h-11 px-5 border border-slate-300 text-slate-600 text-xs font-black rounded-xl hover:bg-slate-50 transition-all disabled:opacity-55 cursor-pointer"
                            >
                              {phoneTimer > 0 ? `Resend (${phoneTimer}s)` : 'Resend Code'}
                            </button>
                          </div>
                        )}
                      </div>
                      {phoneError && <p className="text-xs text-red-500 font-semibold">{phoneError}</p>}
                    </div>
                  )}
                </div>

                {/* Agreement Checkbox Card */}
                <div className="flex items-start gap-4 p-5 bg-[#f8fafc] rounded-2xl border border-slate-200">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-[#0d1b2a] focus:ring-[#ffb800] mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer select-none">
                    I confirm that all provided information is accurate and matches my legal documentation. I agree to the <a className="text-[#0d1b2a] font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-[#0d1b2a] font-bold hover:underline" href="#">Privacy Policy</a>.
                  </label>
                </div>

                {/* Action Row buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-slate-200">
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-10 h-14 rounded-2xl border border-slate-300 text-slate-600 font-extrabold hover:bg-slate-50 transition-all text-sm shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:flex-1 h-14 bg-[#ffb800] hover:bg-[#e0a300] text-[#0d1b2a] rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-md text-sm cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Details...' : 'Save & Continue'}
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </form>
          </main>

        </div>

        {/* Outer footer */}
        <footer className="mt-16 flex flex-col md:flex-row justify-between items-center px-4 gap-6 border-t border-slate-200 pt-8">
          <p className="text-xs text-slate-400 font-medium">© 2026 TrakJobs Professional Services. All rights reserved.</p>
          <div className="flex gap-8">
            <a className="text-xs text-slate-400 hover:text-[#0d1b2a] transition-colors font-bold uppercase tracking-widest" href="#">Help Center</a>
            <a className="text-xs text-slate-400 hover:text-[#0d1b2a] transition-colors font-bold uppercase tracking-widest" href="#">Privacy Policy</a>
            <a className="text-xs text-slate-400 hover:text-[#0d1b2a] transition-colors font-bold uppercase tracking-widest" href="#">Contact Us</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
