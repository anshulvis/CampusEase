import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { HOSTEL_OPTIONS } from '../data/providers';
import { StudentUser } from '../types';
import { DEMO_STUDENT, loginDemoStudent, loginUser, registerUser } from '../utils/storage';

interface AuthPageProps {
  onAuthenticated: (user: StudentUser) => void;
}

const CAMPUS_IMAGE_URL = '/src/assets/images/dehradun_campus_morning_1795112930118.jpg';

export function AuthPage({ onAuthenticated }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [hostel, setHostel] = useState(HOSTEL_OPTIONS[0]);
  const [customHostel, setCustomHostel] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const switchMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode);
    setError(null);
  };

  const handleDemoLogin = () => {
    setError(null);
    const demoUser = loginDemoStudent();
    onAuthenticated(demoUser);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = loginEmail.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Enter a valid DGU student email address.');
      return;
    }
    if (loginPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const result = loginUser(trimmedEmail, loginPassword);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onAuthenticated(result.user);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = signupEmail.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '');
    const selectedHostel = hostel === 'Other' ? customHostel.trim() : hostel;

    if (trimmedName.length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid student email (e.g., name@dgu.ac.in).');
      return;
    }
    if (!selectedHostel) {
      setError('Please specify your hostel or nearby PG name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setError('Enter a valid 10-digit WhatsApp / mobile number.');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Choose a password with at least 6 characters.');
      return;
    }

    const result = registerUser({
      fullName: trimmedName,
      email: trimmedEmail,
      hostel: selectedHostel,
      roomNumber: roomNumber.trim() || 'Gate Pickup',
      phone: cleanPhone.slice(-10),
      password: signupPassword,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onAuthenticated(result.user);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Editorial Column (Desktop) */}
          <section className="hidden lg:flex lg:col-span-6 flex-col justify-between rounded-3xl overflow-hidden relative bg-slate-900 text-white min-h-[620px]">
            {!imageFailed ? (
              <img
                src={CAMPUS_IMAGE_URL}
                alt="DBS Global University Dehradun campus pathway surrounded by green Shivalik hills"
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 flex items-center justify-center">
                <Building2 className="w-20 h-20 text-blue-400/20" aria-hidden="true" />
              </div>
            )}
            <div
              className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/25"
              aria-hidden="true"
            />

            <div className="relative z-10 p-8 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-display font-bold text-base flex items-center justify-center shadow-sm">
                  CE
                </span>
                <span className="font-display font-bold text-xl tracking-tight text-white">
                  CampusEase
                </span>
              </div>
              <span className="text-xs font-medium text-slate-200">
                DBS Global University · Dehradun
              </span>
            </div>

            <div className="relative z-10 p-8 space-y-6">
              <div className="space-y-3 max-w-md">
                <p className="text-sm font-medium text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Verified local providers within 1 km of DGU Gate
                </p>
                <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight text-white [text-wrap:balance]">
                  Everyday hostel errands, sorted in two taps.
                </h1>
                <p className="text-sm leading-relaxed text-slate-200">
                  Book trusted laundry, assignment printouts, home-style tiffins, stationery,
                  minor repairs, and room essentials right from your DGU hostel or Selaqui PG.
                </p>
              </div>

              <div className="pt-5 border-t border-white/15 grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="font-mono text-lg font-semibold text-white tabular-nums">12</p>
                  <p className="text-xs text-slate-300 mt-0.5">Verified shops</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold text-white tabular-nums">₹20–₹40</p>
                  <p className="text-xs text-slate-300 mt-0.5">Flat campus fee</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold text-white tabular-nums">Direct</p>
                  <p className="text-xs text-slate-300 mt-0.5">Pay on delivery</p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Auth Form Column */}
          <section className="lg:col-span-6 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto lg:max-w-none bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              {/* Mobile Brand Header */}
              <div className="lg:hidden mb-6 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-display font-bold text-base flex items-center justify-center">
                    CE
                  </span>
                  <div>
                    <p className="font-display font-bold text-lg leading-none text-slate-900">
                      CampusEase
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      DGU Campus &amp; Selaqui, Dehradun
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {mode === 'login' ? 'Welcome back' : 'Create student account'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {mode === 'login'
                    ? 'Sign in with your DGU student email to request local services.'
                    : 'Pre-fill your hostel details once for faster pickup and delivery.'}
                </p>
              </div>

              {/* Clean Segmented Toggle */}
              <div
                className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6"
                role="tablist"
                aria-label="Authentication mode"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  onClick={() => switchMode('login')}
                  className={`min-h-[44px] rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    mode === 'login'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'signup'}
                  onClick={() => switchMode('signup')}
                  className={`min-h-[44px] rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    mode === 'signup'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      DGU Student Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@dgu.ac.in"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full min-h-[44px] pl-3.5 pr-11 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-lg"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-600/15"
                  >
                    <span>Log In to CampusEase</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-slate-500">Quick prototype access</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-blue-600" aria-hidden="true" />
                    <span>Demo Student Login</span>
                  </button>
                  <p className="text-xs text-slate-500 text-center">
                    Signs in as {DEMO_STUDENT.fullName} ({DEMO_STUDENT.email}) · Boys Hostel A
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5" noValidate>
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g., Priya Negi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-email"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      DGU Student Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      placeholder="priya.negi@dgu.ac.in"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-7">
                      <label
                        htmlFor="signup-hostel"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Hostel / Accommodation
                      </label>
                      <select
                        id="signup-hostel"
                        value={hostel}
                        onChange={(e) => setHostel(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                      >
                        {HOSTEL_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                        <option value="Other">Other Nearby PG / Flat</option>
                      </select>
                    </div>
                    <div className="sm:col-span-5">
                      <label
                        htmlFor="signup-room"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Room / Flat No.
                      </label>
                      <input
                        id="signup-room"
                        type="text"
                        placeholder="e.g., Room 305"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  {hostel === 'Other' && (
                    <div>
                      <label
                        htmlFor="signup-custom-hostel"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Specify PG or Accommodation Name
                      </label>
                      <input
                        id="signup-custom-hostel"
                        type="text"
                        placeholder="e.g., Shivalik Residency PG, Selaqui"
                        value={customHostel}
                        onChange={(e) => setCustomHostel(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                        required
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="signup-phone"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Phone / WhatsApp
                      </label>
                      <input
                        id="signup-phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="signup-password"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Min. 6 characters"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="w-full min-h-[44px] pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[38px] flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-lg"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[48px] mt-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-600/15"
                  >
                    <span>Create Account &amp; Explore</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
