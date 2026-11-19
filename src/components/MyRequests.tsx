import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  MessageCircle,
  RotateCcw,
  Send,
} from 'lucide-react';
import { RequestStatus, ServiceRequest } from '../types';
import { buildWhatsAppLink } from '../utils/storage';
import { CategoryIcon } from './CategoryIcon';

interface MyRequestsProps {
  requests: ServiceRequest[];
  onRequestAgain: (request: ServiceRequest) => void;
  onUpdateStatus: (requestId: string, status: RequestStatus) => void;
  onExploreServices: () => void;
}

type RequestFilter = 'all' | 'active' | 'completed';

function formatRequestTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatusDisplay({ status }: { status: RequestStatus }) {
  if (status === 'Completed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
        <span>Completed</span>
      </span>
    );
  }
  if (status === 'Confirmed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 whitespace-nowrap">
        <Send className="w-3.5 h-3.5 text-blue-600 shrink-0" aria-hidden="true" />
        <span>Confirmed</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 whitespace-nowrap">
      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
      <span>Requested</span>
    </span>
  );
}

export function MyRequests({
  requests,
  onRequestAgain,
  onUpdateStatus,
  onExploreServices,
}: MyRequestsProps) {
  const [filter, setFilter] = useState<RequestFilter>('all');

  const counts = useMemo(() => {
    const active = requests.filter((r) => r.status !== 'Completed').length;
    const completed = requests.filter((r) => r.status === 'Completed').length;
    return { all: requests.length, active, completed };
  }, [requests]);

  const visibleRequests = useMemo(() => {
    if (filter === 'active') return requests.filter((r) => r.status !== 'Completed');
    if (filter === 'completed') return requests.filter((r) => r.status === 'Completed');
    return requests;
  }, [requests, filter]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Segmented Bar */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            My Requests
          </h1>
          <p className="text-sm text-slate-600">
            Track active pickups, update status manually, or reorder a past campus service.
          </p>
        </div>

        <div
          className="inline-flex items-center p-1 bg-slate-200/70 rounded-xl self-start sm:self-auto"
          role="tablist"
          aria-label="Filter service requests"
        >
          {(
            [
              { id: 'all', label: `All (${counts.all})` },
              { id: 'active', label: `Active (${counts.active})` },
              { id: 'completed', label: `Completed (${counts.completed})` },
            ] as { id: RequestFilter; label: string }[]
          ).map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(tab.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Request List or Empty State */}
      {visibleRequests.length === 0 ? (
        <section className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center space-y-3">
          <p className="font-display font-semibold text-lg text-slate-900">
            {requests.length === 0
              ? 'No service requests yet'
              : `No ${filter} requests right now`}
          </p>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {requests.length === 0
              ? 'Need laundry pickup, assignment printouts, or a hot tiffin near DGU Campus? Browse verified local providers to place your first request.'
              : 'Switch tabs to view your other campus service requests or submit a new one.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onExploreServices}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Explore Local Services</span>
            </button>
          </div>
        </section>
      ) : (
        <section aria-label="Submitted service requests" className="space-y-4">
          {visibleRequests.map((req) => (
            <article
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4"
            >
              {/* Top Row: Provider + Status */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CategoryIcon category={req.providerCategory} className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-700 tabular-nums">
                        {req.referenceCode}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{req.providerCategory}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatRequestTime(req.createdAt)}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      {req.providerName}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start">
                  <StatusDisplay status={req.status} />
                </div>
              </div>

              {/* Request Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t border-slate-100 text-sm">
                <div className="md:col-span-6 space-y-1">
                  <p className="text-xs font-medium text-slate-500">Service Details</p>
                  <p className="text-slate-900 leading-relaxed">{req.serviceNotes}</p>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <p className="text-xs font-medium text-slate-500">Slot &amp; Location</p>
                  <p className="text-slate-800 text-xs sm:text-sm flex items-start gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{req.timeSlot}</span>
                  </p>
                  <p className="text-slate-600 text-xs flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{req.hostelAndRoom}</span>
                  </p>
                </div>

                <div className="md:col-span-3 md:text-right space-y-1">
                  <p className="text-xs font-medium text-slate-500">Estimated Total</p>
                  <p className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                    ₹{req.totalEstimatedCost}
                  </p>
                  <p className="text-xs text-slate-500 font-mono tabular-nums">
                    Service ₹{req.estimatedServiceCost} + Fee ₹{req.convenienceFee}
                  </p>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                {/* Manual Pilot Status Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {req.status === 'Requested' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(req.id, 'Confirmed')}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-50 text-blue-700 text-xs font-semibold transition-colors whitespace-nowrap"
                    >
                      Mark Confirmed
                    </button>
                  )}
                  {req.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(req.id, 'Completed')}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold transition-colors whitespace-nowrap"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>

                {/* WhatsApp + Request Again */}
                <div className="flex flex-wrap items-center gap-2 ml-auto">
                  <a
                    href={buildWhatsAppLink(req)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onRequestAgain(req)}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Request Again</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
