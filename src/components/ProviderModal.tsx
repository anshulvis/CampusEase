import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import { ServiceProvider, ServiceRequest, StudentUser } from '../types';
import { buildWhatsAppLink } from '../utils/storage';
import { CategoryIcon } from './CategoryIcon';
import { RequestForm } from './RequestForm';

interface ProviderModalProps {
  provider: ServiceProvider | null;
  user: StudentUser;
  initialNotes?: string;
  onClose: () => void;
  onRequestCreated: (request: ServiceRequest) => void;
  onGoToRequests: () => void;
}

export function ProviderModal({
  provider,
  user,
  initialNotes,
  onClose,
  onRequestCreated,
  onGoToRequests,
}: ProviderModalProps) {
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    setSubmittedRequest(null);
  }, [provider?.id]);

  useEffect(() => {
    if (!provider) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [provider, onClose]);

  if (!provider) return null;

  const handleSuccess = (req: ServiceRequest) => {
    setSubmittedRequest(req);
    onRequestCreated(req);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="provider-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Mobile Bottom Sheet Container */}
      <div className="relative z-10 w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-xl border border-slate-200/80 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Mobile Sheet Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" aria-hidden="true" />
        </div>

        {/* Modal Header */}
        <div className="px-5 sm:px-6 pt-3 sm:pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <CategoryIcon category={provider.category} className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2
                id="provider-modal-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 truncate"
              >
                {provider.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  Verified
                </span>
                <span aria-hidden="true">·</span>
                <span>{provider.category}</span>
                <span aria-hidden="true">·</span>
                <span>{provider.distanceFromGate}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close request modal"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-1 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-5 sm:px-6 py-5 pb-safe">
          {submittedRequest ? (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-2.5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-xs font-semibold text-emerald-700 tabular-nums">
                    Request {submittedRequest.referenceCode} Saved
                  </p>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    Service Request Submitted
                  </h3>
                  <p className="text-sm text-slate-600 max-w-sm mx-auto">
                    Your request has been added to My Requests. Send the pre-filled message on
                    WhatsApp for faster provider confirmation.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-2.5 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Service</span>
                  <span className="text-slate-900 font-medium text-right">
                    {submittedRequest.serviceNotes}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Slot</span>
                  <span className="text-slate-900 font-medium text-right">
                    {submittedRequest.timeSlot}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Location</span>
                  <span className="text-slate-900 font-medium text-right">
                    {submittedRequest.hostelAndRoom}
                  </span>
                </div>
                <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700 font-semibold">Estimated Total</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    ₹{submittedRequest.totalEstimatedCost}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <a
                  href={buildWhatsAppLink(submittedRequest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Send Details on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-85" aria-hidden="true" />
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onGoToRequests();
                    }}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <ClipboardList className="w-4 h-4" aria-hidden="true" />
                    <span>My Requests</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors whitespace-nowrap"
                  >
                    Back to Explore
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <RequestForm
              provider={provider}
              user={user}
              initialNotes={initialNotes}
              onSuccess={handleSuccess}
              onCancel={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
