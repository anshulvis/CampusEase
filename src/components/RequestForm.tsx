import React, { useState } from 'react';
import { AlertCircle, Check, Clock, IndianRupee } from 'lucide-react';
import { TIME_SLOTS } from '../data/providers';
import { ServiceProvider, ServiceRequest, StudentUser } from '../types';
import { createServiceRequest } from '../utils/storage';

interface RequestFormProps {
  provider: ServiceProvider;
  user: StudentUser;
  initialNotes?: string;
  onSuccess: (request: ServiceRequest) => void;
  onCancel: () => void;
}

export function RequestForm({
  provider,
  user,
  initialNotes = '',
  onSuccess,
  onCancel,
}: RequestFormProps) {
  const defaultOption = provider.rateOptions[0];
  const defaultLocation = user.roomNumber
    ? `${user.hostel}, ${user.roomNumber}`
    : user.hostel;

  const [studentName, setStudentName] = useState(user.fullName);
  const [hostelAndRoom, setHostelAndRoom] = useState(defaultLocation);
  const [studentPhone, setStudentPhone] = useState(user.phone);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0);
  const [estimatedServiceCost, setEstimatedServiceCost] = useState(
    defaultOption ? defaultOption.estimatedInr : 100
  );
  const [serviceNotes, setServiceNotes] = useState(
    initialNotes || (defaultOption ? defaultOption.label : '')
  );
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [error, setError] = useState<string | null>(null);

  const selectedOption = provider.rateOptions[selectedOptionIdx] ?? defaultOption;
  const totalEstimate = estimatedServiceCost + provider.convenienceFee;

  const handleSelectRateOption = (index: number) => {
    const opt = provider.rateOptions[index];
    if (!opt) return;
    setSelectedOptionIdx(index);
    setEstimatedServiceCost(opt.estimatedInr);
    setServiceNotes(opt.label);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!hostelAndRoom.trim()) {
      setError('Please enter your hostel/PG name and room number.');
      return;
    }
    const digits = studentPhone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid 10-digit phone / WhatsApp number.');
      return;
    }
    if (serviceNotes.trim().length < 4) {
      setError('Please specify the service item or short instructions.');
      return;
    }

    const created = createServiceRequest({
      userId: user.id,
      providerId: provider.id,
      providerName: provider.name,
      providerCategory: provider.category,
      providerWhatsapp: provider.whatsappPhone,
      studentName: studentName.trim(),
      hostelAndRoom: hostelAndRoom.trim(),
      studentPhone: digits.slice(-10),
      serviceNotes: serviceNotes.trim(),
      selectedOptionLabel: selectedOption?.label ?? 'Custom Service',
      timeSlot,
      estimatedServiceCost,
      convenienceFee: provider.convenienceFee,
      totalEstimatedCost: totalEstimate,
    });

    onSuccess(created);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Select Service Package */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-900">
          Select Common Service
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {provider.rateOptions.map((option, idx) => {
            const isSelected = idx === selectedOptionIdx;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => handleSelectRateOption(idx)}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 text-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-xs sm:text-sm font-medium leading-snug">
                  {option.label}
                </span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-slate-900 tabular-nums shrink-0 flex items-center gap-1">
                  {option.priceText}
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Specific Service Item / Notes */}
      <div>
        <label
          htmlFor="req-notes"
          className="block text-sm font-semibold text-slate-900 mb-1.5"
        >
          Specific Service Item / Notes
        </label>
        <textarea
          id="req-notes"
          rows={3}
          value={serviceNotes}
          onChange={(e) => setServiceNotes(e.target.value)}
          placeholder="Add quantity, print instructions, food preference, or issue details..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors resize-none"
          required
        />
      </div>

      {/* Preferred Pickup / Delivery Time Slot */}
      <div>
        <label
          htmlFor="req-slot"
          className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5"
        >
          <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <span>Preferred Pickup / Delivery Slot</span>
        </label>
        <select
          id="req-slot"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
        >
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      {/* Pre-filled Student Details */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <p className="text-xs font-semibold text-slate-500">
          Student Pickup &amp; Contact Details (Pre-filled from your account)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="req-name"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Student Name
            </label>
            <input
              id="req-name"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="req-phone"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Phone / WhatsApp
            </label>
            <input
              id="req-phone"
              type="tel"
              inputMode="numeric"
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="req-hostel"
            className="block text-xs font-medium text-slate-700 mb-1"
          >
            Hostel / Accommodation &amp; Room Number
          </label>
          <input
            id="req-hostel"
            type="text"
            value={hostelAndRoom}
            onChange={(e) => setHostelAndRoom(e.target.value)}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
            required
          />
        </div>
      </div>

      {/* Transparent Cost Summary */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2.5">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Estimated Service Cost</span>
          <span className="font-mono font-medium text-slate-900 tabular-nums">
            ₹{estimatedServiceCost}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>CampusEase Convenience Fee</span>
          <span className="font-mono font-medium text-slate-900 tabular-nums">
            ₹{provider.convenienceFee}
          </span>
        </div>
        <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">Estimated Total</span>
          <span className="font-mono text-lg font-bold text-slate-900 tabular-nums flex items-center">
            <IndianRupee className="w-4 h-4 mr-0.5" aria-hidden="true" />
            {totalEstimate}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Pay directly to the provider upon pickup or delivery. Final amount adjusts to actual
          weight, pages, or items.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[46px] px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors whitespace-nowrap"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="min-h-[46px] sm:flex-1 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-sm shadow-blue-600/15 whitespace-nowrap"
        >
          Submit Service Request
        </button>
      </div>
    </form>
  );
}
