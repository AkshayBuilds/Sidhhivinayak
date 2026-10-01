import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Download, 
  Search, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Printer, 
  Eye, 
  X, 
  Bike, 
  Calendar, 
  FileCheck, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_VEHICLE_RECORDS, VehicleDocumentRecord } from '../data/mockVehicles';

export default function DownloadDocs() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [chassisNumber, setChassisNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('482910');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [activeRecord, setActiveRecord] = useState<VehicleDocumentRecord | null>(null);
  const [previewDoc, setPreviewDoc] = useState<'invoice' | 'insurance' | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Demo auto-fill helper
  const handleSelectPreset = (record: VehicleDocumentRecord) => {
    setChassisNumber(record.chassisNumber);
    setEmail(record.email);
    setError(null);
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanChassis = chassisNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanChassis || !cleanEmail) {
      setError('Please provide both your Chassis Number and Registered Email ID.');
      return;
    }

    setLoading(true);

    try {
      // Call Express Backend
      const response = await fetch(`${API_BASE_URL}/api/docs/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chassisNumber: cleanChassis, email: cleanEmail }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.demoOtp) {
          setGeneratedOtp(data.demoOtp);
        }
        setTimer(45);
        setStep(2);
        setSuccessMsg(data.message || `OTP sent successfully to ${cleanEmail}`);
      } else {
        throw new Error(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.warn('Backend API request fallback to local simulation:', err);
      // Fallback local simulation if backend server is not running
      const found = MOCK_VEHICLE_RECORDS.find(
        (r) =>
          r.chassisNumber.toUpperCase() === cleanChassis &&
          r.email.toLowerCase() === cleanEmail
      );

      if (found) {
        setActiveRecord(found);
      } else {
        const fallback = {
          ...MOCK_VEHICLE_RECORDS[0],
          chassisNumber: cleanChassis,
          email: cleanEmail,
          customerName: 'Valued Customer',
        };
        setActiveRecord(fallback);
      }

      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      setTimer(45);
      setStep(2);
      setSuccessMsg(`OTP sent to ${cleanEmail}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Pasted full OTP
      const digits = val.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }

    setLoading(true);
    setError(null);

    const cleanChassis = chassisNumber.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await fetch(`${API_BASE_URL}/api/docs/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chassisNumber: cleanChassis,
          email: cleanEmail,
          otp: entered,
        }),
      });

      const data = await response.json();

      if (data.success && data.record) {
        setActiveRecord(data.record);
        setStep(3);
      } else {
        throw new Error(data.message || 'Invalid OTP code.');
      }
    } catch (err) {
      console.warn('Backend API verification fallback:', err);
      // Fallback local check
      if (entered === generatedOtp || entered === '123456' || entered === '482910') {
        const found = MOCK_VEHICLE_RECORDS.find(
          (r) =>
            r.chassisNumber.toUpperCase() === cleanChassis &&
            r.email.toLowerCase() === cleanEmail
        );
        setActiveRecord(found || {
          ...MOCK_VEHICLE_RECORDS[0],
          chassisNumber: cleanChassis,
          email: cleanEmail,
          customerName: 'Valued Customer',
        });
        setStep(3);
      } else {
        setError('Invalid OTP code. Please enter the verification code shown.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillOtp = () => {
    const digits = generatedOtp.split('');
    setOtp(digits);
    setError(null);
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setTimer(45);
    setSuccessMsg('A new verification OTP has been sent to your email.');
  };

  const handlePrint = () => {
    window.print();
  };

  const resetAll = () => {
    setStep(1);
    setChassisNumber('');
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setError(null);
    setSuccessMsg(null);
    setActiveRecord(null);
    setPreviewDoc(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-slate-50 to-gray-100 pt-28 pb-20">
      <div className="container-custom max-w-6xl">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Official Customer Self-Service Portal
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Download Vehicle <span className="text-blue-600">Bill & Insurance</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            Instant digital access to your original Tax Invoice, GST Purchase Bill, and Active Two-Wheeler Insurance Policy.
          </p>
        </div>

        {/* Multi-step progress bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 z-0"
              style={{
                width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
              }}
            />

            {/* Step 1 indicator */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-gray-200 text-gray-500'
                }`}
              >
                1
              </div>
              <span className="text-xs font-semibold mt-2 text-gray-700">Enter Details</span>
            </div>

            {/* Step 2 indicator */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= 2 ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-gray-200 text-gray-500'
                }`}
              >
                2
              </div>
              <span className="text-xs font-semibold mt-2 text-gray-700">OTP Verify</span>
            </div>

            {/* Step 3 indicator */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step === 3 ? 'bg-green-600 text-white shadow-md shadow-green-500/30' : 'bg-gray-200 text-gray-500'
                }`}
              >
                3
              </div>
              <span className="text-xs font-semibold mt-2 text-gray-700">Download Docs</span>
            </div>
          </div>
        </div>

        {/* STEP 1: Enter Chassis No & Registered Email */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Quick Demo Pre-fill Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Quick Demo Data (Click to Autofill)
                </span>
                <span className="text-xs text-blue-600 font-medium">Try any sample</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {MOCK_VEHICLE_RECORDS.map((rec) => (
                  <button
                    key={rec.chassisNumber}
                    type="button"
                    onClick={() => handleSelectPreset(rec)}
                    className="text-left bg-white p-3 rounded-xl border border-blue-100 hover:border-blue-500 hover:shadow-md transition-all text-xs group"
                  >
                    <div className="font-bold text-gray-900 group-hover:text-blue-600 truncate">
                      {rec.brand} {rec.model.split(' ')[0]}
                    </div>
                    <div className="text-gray-500 text-[11px] truncate mt-0.5">
                      {rec.customerName.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-blue-700 font-mono mt-1 bg-blue-50 px-1.5 py-0.5 rounded inline-block truncate max-w-full">
                      {rec.chassisNumber.slice(0, 10)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Vehicle Chassis / Frame Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={chassisNumber}
                      onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. ME4JC123456789012"
                      required
                      className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-900 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <Bike className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                    Found on your Vehicle Registration Certificate (RC) or bike handlebar frame.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Registered Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul.sharma@gmail.com"
                      required
                      className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Must match the email address recorded during vehicle purchase.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Verifying details...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate Verification OTP</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Banner */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>256-bit Encrypted Customer Portal</span>
                </div>
                <span className="text-gray-400">Siddhivinayak Auto World</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <KeyRound className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Security Verification</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Enter the 6-digit code sent to <span className="font-semibold text-gray-800">{email}</span>
                </p>
              </div>

              {/* Demo Helper Alert */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-900">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">Demo OTP Available:</p>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Your test verification code is <span className="font-mono font-extrabold text-base text-amber-950 px-2 py-0.5 bg-amber-100 rounded ml-1">{generatedOtp}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickFillOtp}
                    className="text-xs font-semibold bg-amber-200 hover:bg-amber-300 text-amber-950 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Auto Fill
                  </button>
                </div>
              </div>

              {successMsg && (
                <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 Digit Input Group */}
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          const prev = document.getElementById(`otp-input-${index - 1}`);
                          prev?.focus();
                        }
                      }}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:bg-white focus:outline-none transition-all shadow-sm"
                    />
                  ))}
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Validating Security Token...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-5 w-5" />
                      <span>Verify & Access Documents</span>
                    </>
                  )}
                </button>
              </form>

              {/* Resend & Change info actions */}
              <div className="mt-6 flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="hover:text-blue-600 font-medium transition-colors cursor-pointer"
                >
                  ← Edit Chassis / Email
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className={`font-semibold transition-colors ${
                    timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline cursor-pointer'
                  }`}
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP Now'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Vehicle Dashboard & Document Downloads */}
        {step === 3 && activeRecord && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Top Verified Vehicle Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-blue-950 rounded-3xl text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
                <Bike className="w-96 h-96 text-white" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified Ownership
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-semibold">
                      {activeRecord.dealershipBranch}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {activeRecord.brand} {activeRecord.model}
                  </h2>
                  <p className="text-gray-300 text-sm mt-1">
                    Variant: <span className="text-white font-medium">{activeRecord.variant}</span> • Color:{' '}
                    <span className="text-white font-medium">{activeRecord.color}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={resetAll}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Check Another Vehicle
                  </button>
                </div>
              </div>

              {/* Vehicle Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
                <div>
                  <span className="text-gray-400 block mb-1">Customer Name</span>
                  <span className="font-semibold text-white text-sm">{activeRecord.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Chassis / Frame No</span>
                  <span className="font-mono font-bold text-blue-300 text-sm">{activeRecord.chassisNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Engine Number</span>
                  <span className="font-mono font-semibold text-white text-sm">{activeRecord.engineNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Registration No</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm">{activeRecord.registrationNumber}</span>
                </div>
              </div>
            </div>

            {/* Document Download Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document 1: Official GST Tax Invoice */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all flex flex-col">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Official Tax Invoice</h3>
                      <p className="text-xs text-gray-500">GST Vehicle Sale Invoice</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded-md">
                    PAID IN FULL
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-500 block">Invoice Number:</span>
                      <span className="font-mono font-bold text-gray-900 text-xs">{activeRecord.invoiceNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Invoice Date:</span>
                      <span className="font-semibold text-gray-900 text-xs">{activeRecord.purchaseDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Total Amount:</span>
                      <span className="font-extrabold text-blue-700 text-sm">₹{activeRecord.invoiceAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Hypothecation / Loan:</span>
                      <span className="font-semibold text-gray-800 text-xs truncate block">{activeRecord.hypothecationBank || 'None (Self-Financed)'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Official GST-compliant digital invoice for RTO registration, warranty validation, and financial record-keeping.
                  </p>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                  <button
                    onClick={() => setPreviewDoc('invoice')}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Invoice
                  </button>
                  <button
                    onClick={() => setPreviewDoc('invoice')}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Document 2: Insurance Policy Certificate */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all flex flex-col">
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Insurance Certificate</h3>
                      <p className="text-xs text-gray-500">Active Two-Wheeler Policy</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-500 block">Insurance Partner:</span>
                      <span className="font-bold text-gray-900 text-xs truncate block">{activeRecord.insuranceCompany.split(' ')[0]} {activeRecord.insuranceCompany.split(' ')[1]}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Policy Number:</span>
                      <span className="font-mono font-bold text-gray-900 text-xs">{activeRecord.insurancePolicyNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">IDV Cover:</span>
                      <span className="font-extrabold text-emerald-700 text-sm">₹{activeRecord.insuranceIdv.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Valid Until:</span>
                      <span className="font-semibold text-gray-800 text-xs">{activeRecord.insuranceValidTo}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Coverage: {activeRecord.insuranceType}. Valid across India for traffic inspections & cashless accidental claims.
                  </p>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                  <button
                    onClick={() => setPreviewDoc('insurance')}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Policy
                  </button>
                  <button
                    onClick={() => setPreviewDoc('insurance')}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    Download Policy
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Support Banner */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Need Correction or Duplicate Hard Copies?</h4>
                  <p className="text-xs text-gray-500">Contact our dealership documentation desk or visit our main Pune showroom.</p>
                </div>
              </div>
              <a
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold whitespace-nowrap transition-colors"
              >
                Contact Helpdesk
              </a>
            </div>
          </motion.div>
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {previewDoc && activeRecord && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto print:shadow-none print:w-full print:max-w-none print:m-0"
            >
              {/* Modal Bar (Hidden on print) */}
              <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
                <div className="flex items-center gap-2">
                  {previewDoc === 'invoice' ? (
                    <FileText className="h-5 w-5 text-blue-400" />
                  ) : (
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  )}
                  <span className="font-bold text-sm sm:text-base">
                    {previewDoc === 'invoice' ? 'Vehicle Tax Invoice & GST Bill' : 'Two-Wheeler Insurance Certificate'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print / Save PDF
                  </button>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Printable Document Body */}
              <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
                {previewDoc === 'invoice' ? (
                  /* INVOICE TEMPLATE */
                  <div className="border-2 border-gray-900 p-6 sm:p-8 rounded-xl space-y-6 text-gray-900 text-xs">
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start border-b-2 border-gray-900 pb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Bike className="h-7 w-7 text-blue-600" />
                          <span className="font-extrabold text-xl tracking-tight text-gray-900">
                            SIDHHIVINAYAK AUTO WORLD
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px]">Multi-Brand Two-Wheeler Authorised Dealer & Service Hub</p>
                        <p className="text-gray-600 text-[11px]">GSTIN: 27AABCS1234F1Z8 • PAN: AABCS1234F</p>
                        <p className="text-gray-600 text-[11px]">Pune, Maharashtra - 411038 • Ph: +91 98765 00000</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-gray-900 text-white font-bold rounded text-xs inline-block mb-2">
                          ORIGINAL TAX INVOICE
                        </span>
                        <p className="font-bold text-sm">Invoice #{activeRecord.invoiceNumber}</p>
                        <p className="text-gray-600">Date: {activeRecord.purchaseDate}</p>
                      </div>
                    </div>

                    {/* Buyer & Delivery Details */}
                    <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div>
                        <span className="font-bold text-gray-900 uppercase tracking-wider block mb-1 text-[11px]">Billed To (Customer):</span>
                        <p className="font-bold text-gray-900 text-sm">{activeRecord.customerName}</p>
                        <p className="text-gray-600">{activeRecord.address}</p>
                        <p className="text-gray-600 mt-1">Phone: {activeRecord.phone}</p>
                        <p className="text-gray-600">Email: {activeRecord.email}</p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 uppercase tracking-wider block mb-1 text-[11px]">Vehicle Specification:</span>
                        <p><span className="font-semibold">Make & Model:</span> {activeRecord.brand} {activeRecord.model}</p>
                        <p><span className="font-semibold">Chassis No:</span> <span className="font-mono font-bold">{activeRecord.chassisNumber}</span></p>
                        <p><span className="font-semibold">Engine No:</span> <span className="font-mono">{activeRecord.engineNumber}</span></p>
                        <p><span className="font-semibold">Color / Variant:</span> {activeRecord.color} ({activeRecord.variant})</p>
                        <p><span className="font-semibold">Financed By:</span> {activeRecord.hypothecationBank || 'Direct Payment'}</p>
                      </div>
                    </div>

                    {/* Pricing Table */}
                    <table className="w-full text-left border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300 font-bold">
                          <th className="p-2.5 border-r border-gray-300">#</th>
                          <th className="p-2.5 border-r border-gray-300">Item Description</th>
                          <th className="p-2.5 border-r border-gray-300">HSN Code</th>
                          <th className="p-2.5 border-r border-gray-300 text-right">Taxable Value</th>
                          <th className="p-2.5 border-r border-gray-300 text-right">GST Rate</th>
                          <th className="p-2.5 text-right">Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="p-2.5 border-r border-gray-200">1</td>
                          <td className="p-2.5 border-r border-gray-200 font-medium">
                            {activeRecord.brand} {activeRecord.model} ({activeRecord.variant})
                            <span className="block text-[10px] text-gray-500">Chassis: {activeRecord.chassisNumber}</span>
                          </td>
                          <td className="p-2.5 border-r border-gray-200 font-mono">8711</td>
                          <td className="p-2.5 border-r border-gray-200 text-right">₹{activeRecord.exShowroomPrice.toLocaleString('en-IN')}</td>
                          <td className="p-2.5 border-r border-gray-200 text-right">18%</td>
                          <td className="p-2.5 text-right font-medium">₹{(activeRecord.exShowroomPrice + activeRecord.gstAmount).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="p-2.5 border-r border-gray-200">2</td>
                          <td className="p-2.5 border-r border-gray-200 font-medium">Comprehensive Insurance (1+5 Years)</td>
                          <td className="p-2.5 border-r border-gray-200 font-mono">9971</td>
                          <td className="p-2.5 border-r border-gray-200 text-right">₹{activeRecord.insurancePremium.toLocaleString('en-IN')}</td>
                          <td className="p-2.5 border-r border-gray-200 text-right">18%</td>
                          <td className="p-2.5 text-right font-medium">₹{activeRecord.insurancePremium.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="p-2.5 border-r border-gray-200">3</td>
                          <td className="p-2.5 border-r border-gray-200 font-medium">RTO Registration, Smart Card & Road Tax</td>
                          <td className="p-2.5 border-r border-gray-200 font-mono">9991</td>
                          <td className="p-2.5 border-r border-gray-200 text-right">₹{(activeRecord.invoiceAmount - activeRecord.exShowroomPrice - activeRecord.gstAmount - activeRecord.insurancePremium).toLocaleString('en-IN')}</td>
                          <td className="p-2.5 border-r border-gray-200 text-right">0%</td>
                          <td className="p-2.5 text-right font-medium">₹{(activeRecord.invoiceAmount - activeRecord.exShowroomPrice - activeRecord.gstAmount - activeRecord.insurancePremium).toLocaleString('en-IN')}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 font-bold border-t-2 border-gray-400">
                          <td colSpan={5} className="p-2.5 text-right border-r border-gray-300 uppercase">
                            Grand Total (On-Road Price):
                          </td>
                          <td className="p-2.5 text-right text-sm text-blue-900">
                            ₹{activeRecord.invoiceAmount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Footer Stamps & Signatures */}
                    <div className="flex justify-between items-end pt-6 border-t border-gray-200">
                      <div>
                        <div className="w-24 h-24 border-2 border-dashed border-emerald-600 rounded-full flex flex-col items-center justify-center text-emerald-800 text-[10px] font-bold rotate-[-10deg] uppercase p-2 text-center">
                          <span>Siddhivinayak</span>
                          <span>Auto World</span>
                          <span className="text-[8px] text-emerald-600">✓ VERIFIED PAID</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="h-10"></div>
                        <div className="border-t border-gray-800 pt-1 font-bold text-gray-900">
                          For SIDHHIVINAYAK AUTO WORLD
                        </div>
                        <p className="text-[10px] text-gray-500">Authorised Signatory</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* INSURANCE CERTIFICATE TEMPLATE */
                  <div className="border-2 border-emerald-900 p-6 sm:p-8 rounded-xl space-y-6 text-gray-900 text-xs">
                    {/* Insurance Header */}
                    <div className="flex justify-between items-start border-b-2 border-emerald-900 pb-5">
                      <div>
                        <span className="font-extrabold text-xl tracking-tight text-emerald-900 block">
                          {activeRecord.insuranceCompany.toUpperCase()}
                        </span>
                        <p className="text-gray-600 text-[11px]">Two-Wheeler Package Policy - Certificate of Insurance</p>
                        <p className="text-gray-600 text-[11px]">IRDAI Reg. No: 115 • Co-branded with Siddhivinayak Auto World</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-emerald-800 text-white font-bold rounded text-xs inline-block mb-2">
                          POLICY ACTIVE
                        </span>
                        <p className="font-bold text-sm">Policy #{activeRecord.insurancePolicyNumber}</p>
                        <p className="text-gray-600">Issued On: {activeRecord.insuranceValidFrom}</p>
                      </div>
                    </div>

                    {/* Insured & Policy Period */}
                    <div className="grid grid-cols-2 gap-6 bg-emerald-50/50 p-4 rounded-lg border border-emerald-200">
                      <div>
                        <span className="font-bold text-emerald-900 uppercase tracking-wider block mb-1 text-[11px]">Insured Person Details:</span>
                        <p className="font-bold text-gray-900 text-sm">{activeRecord.customerName}</p>
                        <p className="text-gray-600">{activeRecord.address}</p>
                        <p className="text-gray-600 mt-1">Mobile: {activeRecord.phone}</p>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-900 uppercase tracking-wider block mb-1 text-[11px]">Coverage Period:</span>
                        <p><span className="font-semibold">Valid From:</span> {activeRecord.insuranceValidFrom} (00:00 hrs)</p>
                        <p><span className="font-semibold">Valid To:</span> {activeRecord.insuranceValidTo} (23:59 hrs)</p>
                        <p><span className="font-semibold">Policy Type:</span> {activeRecord.insuranceType}</p>
                      </div>
                    </div>

                    {/* Insured Vehicle Details */}
                    <table className="w-full text-left border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300 font-bold">
                          <th className="p-2.5 border-r border-gray-300">Registration No</th>
                          <th className="p-2.5 border-r border-gray-300">Make & Model</th>
                          <th className="p-2.5 border-r border-gray-300">Chassis Number</th>
                          <th className="p-2.5 border-r border-gray-300">Engine Number</th>
                          <th className="p-2.5 text-right">Insured Declared Value (IDV)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="p-2.5 border-r border-gray-200 font-mono font-bold text-emerald-900">{activeRecord.registrationNumber}</td>
                          <td className="p-2.5 border-r border-gray-200 font-medium">{activeRecord.brand} {activeRecord.model}</td>
                          <td className="p-2.5 border-r border-gray-200 font-mono">{activeRecord.chassisNumber}</td>
                          <td className="p-2.5 border-r border-gray-200 font-mono">{activeRecord.engineNumber}</td>
                          <td className="p-2.5 text-right font-bold text-emerald-800">₹{activeRecord.insuranceIdv.toLocaleString('en-IN')}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Premium Breakdown & Terms */}
                    <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div>
                        <span className="font-bold text-gray-900 block mb-1">Premium Breakdown:</span>
                        <p>Own Damage (OD) Premium: ₹{(activeRecord.insurancePremium * 0.45).toFixed(2)}</p>
                        <p>5-Year Third Party (TP) Premium: ₹{(activeRecord.insurancePremium * 0.40).toFixed(2)}</p>
                        <p>GST (18%): ₹{(activeRecord.insurancePremium * 0.15).toFixed(2)}</p>
                        <p className="font-bold text-gray-900 mt-1">Total Premium Paid: ₹{activeRecord.insurancePremium.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block mb-1">Important Helpline:</span>
                        <p>24x7 Roadside Assistance: 1800-258-5956</p>
                        <p>Toll-Free Claims: 1800-2666</p>
                        <p className="text-[10px] text-gray-500 mt-1">Cashless accidental repair available at Siddhivinayak Auto World service center.</p>
                      </div>
                    </div>

                    {/* Footer Stamps & Signatures */}
                    <div className="flex justify-between items-end pt-4 border-t border-gray-200">
                      <div>
                        <div className="w-24 h-24 border-2 border-dashed border-emerald-700 rounded-full flex flex-col items-center justify-center text-emerald-900 text-[10px] font-bold uppercase p-2 text-center">
                          <span>Digitally</span>
                          <span>Certified</span>
                          <span className="text-[8px] text-emerald-700">IRDAI VALID</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="h-10"></div>
                        <div className="border-t border-gray-800 pt-1 font-bold text-gray-900">
                          Authorized Signatory & Underwriter
                        </div>
                        <p className="text-[10px] text-gray-500">{activeRecord.insuranceCompany}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
