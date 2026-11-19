import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { SERVICE_CATEGORIES, SERVICE_PROVIDERS } from '../data/providers';
import { ServiceCategory, ServiceProvider, StudentUser } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface ServiceCatalogProps {
  user: StudentUser;
  onSelectProvider: (provider: ServiceProvider) => void;
}

export function ServiceCatalog({ user, onSelectProvider }: ServiceCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'All'>('All');

  const firstName = user.fullName.trim().split(' ')[0] || 'Student';

  const filteredProviders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SERVICE_PROVIDERS.filter((provider) => {
      const matchesCategory =
        selectedCategory === 'All' || provider.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      const haystack = [
        provider.name,
        provider.category,
        provider.primaryPricing,
        provider.secondaryPricing,
        provider.description,
        provider.landmark,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [searchQuery, selectedCategory]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Personalized Welcome Header & Search */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" aria-hidden="true" />
              <span>
                {user.hostel}
                {user.roomNumber ? ` · ${user.roomNumber}` : ''} · DGU Dehradun
              </span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
              Hi {firstName}, what do you need today?
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {filteredProviders.length}
            </span>{' '}
            verified local {filteredProviders.length === 1 ? 'provider' : 'providers'} near DGU Gate
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl">
          <Search
            className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search laundry, B&W print, tiffin, kettle repair, water jars..."
            aria-label="Search local student services"
            className="w-full min-h-[48px] pl-11 pr-11 py-3 rounded-2xl bg-white border border-slate-200/90 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-xl"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Interactive Category Filter Buttons */}
        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
          role="group"
          aria-label="Filter services by category"
        >
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            aria-pressed={selectedCategory === 'All'}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all border ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            All Services
          </button>

          {SERVICE_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isActive}
                className={`min-h-[42px] px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all border flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <CategoryIcon
                  category={category}
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}
                />
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Provider Grid */}
      {filteredProviders.length === 0 ? (
        <section className="bg-white rounded-2xl border border-slate-200/90 p-10 text-center space-y-3">
          <p className="font-display font-semibold text-lg text-slate-900">
            No matching providers found
          </p>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Try searching for another keyword like &ldquo;laundry&rdquo;, &ldquo;print&rdquo;, or
            &ldquo;tiffin&rdquo;, or view all verified campus providers.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
            >
              Show All Services
            </button>
          </div>
        </section>
      ) : (
        <section
          aria-label="Verified local service providers"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
        >
          {filteredProviders.map((provider) => (
            <article
              key={provider.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <div className="space-y-3.5">
                {/* Quiet Unboxed Category & Distance Metadata */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <CategoryIcon category={provider.category} className="w-4 h-4" />
                    </span>
                    <span className="font-medium text-slate-700 truncate">
                      {provider.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{provider.distanceFromGate}</span>
                  </div>
                </div>

                {/* Provider Title + Verified Indicator */}
                <div className="space-y-1">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 leading-snug">
                    {provider.name}
                  </h2>
                  <p className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                    <span>Verified by CampusEase</span>
                    <span className="text-slate-300 mx-0.5" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-slate-500 font-normal truncate">{provider.landmark}</span>
                  </p>
                </div>

                {/* Short Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {provider.description}
                </p>

                {/* Availability Status */}
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Clock
                    className={`w-3.5 h-3.5 shrink-0 ${
                      provider.isOpenNow ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                    aria-hidden="true"
                  />
                  <span className={provider.isOpenNow ? 'text-emerald-700' : 'text-amber-700'}>
                    {provider.availabilityLabel}
                  </span>
                  <span className="text-slate-400" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-slate-600 font-normal">{provider.hours}</span>
                </div>
              </div>

              {/* Pricing + Primary CTA */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3.5">
                <div>
                  <p className="text-base font-bold text-slate-900 font-mono tabular-nums">
                    {provider.primaryPricing}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {provider.secondaryPricing}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectProvider(provider)}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Request Service</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
