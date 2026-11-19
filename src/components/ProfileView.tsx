import React, { useState } from 'react';
import { Check, LogOut, Mail, Phone, Building2 } from 'lucide-react';
import { HOSTEL_OPTIONS } from '../data/providers';
import { StudentUser } from '../types';
import { updateCurrentUser } from '../utils/storage';

interface ProfileViewProps {
  user: StudentUser;
  totalRequests: number;
  activeRequests: number;
  onUserUpdated: (user: StudentUser) => void;
  onLogout: () => void;
}

export function ProfileView({
  user,
  totalRequests,
  activeRequests,
  onUserUpdated,
  onLogout,
}: ProfileViewProps) {
  const isPresetHostel = HOSTEL_OPTIONS.includes(user.hostel);
  const [fullName, setFullName] = useState(user.fullName);
  const [hostelSelect, setHostelSelect] = useState(isPresetHostel ? user.hostel : 'Other');
  const [customHostel, setCustomHostel] = useState(isPresetHostel ? '' : user.hostel);
  const [roomNumber, setRoomNumber] = useState(user.roomNumber);
  const [phone, setPhone] = useState(user.phone);
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = user.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavedNotice(false);

    const resolvedHostel = hostelSelect === 'Other' ? customHostel.trim() : hostelSelect;
    const cleanPhone = phone.replace(/\D/g, '');

    if (fullName.trim().length < 2) {
      setError('Full name cannot be empty.');
      return;
    }
    if (!resolvedHostel) {
      setError('Please enter your hostel or accommodation name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setError('Enter a valid 10-digit WhatsApp / mobile number.');
      return;
    }

    const updated = updateCurrentUser({
      fullName: fullName.trim(),
      hostel: resolvedHostel,
      roomNumber: roomNumber.trim() || 'Gate Pickup',
      phone: cleanPhone.slice(-10),
    });

    if (updated) {
      onUserUpdated(updated);
      setSavedNotice(true);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Student Profile
        </h1>
        <p className="text-sm text-slate-600">
          Keep your hostel, room number, and WhatsApp details up to date for faster service requests.
        </p>
      </section>

      {/* Summary Card */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-display font-bold text-xl flex items-center justify-center shrink-0">
            {initials || 'ST'}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">{user.fullName}</h2>
            <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-0.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{user.email}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                {user.hostel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                <Phone className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                +91 {user.phone}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
          <div>
            <p className="font-mono text-xl font-bold text-slate-900 tabular-nums">
              {activeRequests}
            </p>
            <p className="text-xs text-slate-500">Active</p>
          </div>
          <div className="h-8 w-px bg-slate-200" aria-hidden="true" />
          <div>
            <p className="font-mono text-xl font-bold text-slate-900 tabular-nums">
              {totalRequests}
            </p>
            <p className="text-xs text-slate-500">Total Requests</p>
          </div>
        </div>
      </section>

      {/* Editable Hostel & Contact Form */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Pickup &amp; Contact Preferences
        </h2>

        <form onSubmit={handleSave} className="space-y-4" noValidate>
          {error && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
              {error}
            </p>
          )}

          {savedNotice && (
            <p
              role="status"
              className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>Profile updated. Future service requests will pre-fill these details.</span>
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="prof-name"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="prof-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setSavedNotice(false);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="prof-phone"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Phone / WhatsApp Number
              </label>
              <input
                id="prof-phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setSavedNotice(false);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7">
              <label
                htmlFor="prof-hostel"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Hostel / Accommodation
              </label>
              <select
                id="prof-hostel"
                value={hostelSelect}
                onChange={(e) => {
                  setHostelSelect(e.target.value);
                  setSavedNotice(false);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              >
                {HOSTEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
                <option value="Other">Other Nearby PG / Flat</option>
              </select>
            </div>

            <div className="sm:col-span-5">
              <label
                htmlFor="prof-room"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Room / Flat Number
              </label>
              <input
                id="prof-room"
                type="text"
                value={roomNumber}
                onChange={(e) => {
                  setRoomNumber(e.target.value);
                  setSavedNotice(false);
                }}
                placeholder="e.g., Room 214"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          {hostelSelect === 'Other' && (
            <div>
              <label
                htmlFor="prof-custom-hostel"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                PG or Accommodation Name
              </label>
              <input
                id="prof-custom-hostel"
                type="text"
                value={customHostel}
                onChange={(e) => {
                  setCustomHostel(e.target.value);
                  setSavedNotice(false);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors inline-flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span>Log Out</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
