'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { propertyAPI } from '@/lib/api/client';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    city: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await propertyAPI.getProperties({ limit: 6 });
      setProperties(response.data.properties);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.city) params.append('city', filters.city);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    window.location.href = `/properties?${params.toString()}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Hero Section - World-Class Design */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 gradient-mesh"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <div className="section-container relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-3 mb-8 animate-slide-down">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="text-white font-semibold text-sm">Integrated Electronic Housing Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in leading-tight">
              Eliminate <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-100">Broker Fees</span>
              <br />
              <span className="text-5xl md:text-6xl lg:text-7xl">Buy & Sell Direct</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-slide-up leading-relaxed">
              Save <strong className="font-bold text-white">2-5%</strong> on every transaction. Connect directly with property owners.
              <br className="hidden md:block" />
              No middlemen. Just transparent, efficient deals.
            </p>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass rounded-2xl px-6 py-4">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">1000+</div>
                <div className="text-white/80 text-sm font-medium">Properties Listed</div>
              </div>
              <div className="glass rounded-2xl px-6 py-4">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">Rp 500M+</div>
                <div className="text-white/80 text-sm font-medium">Transactions</div>
              </div>
              <div className="glass rounded-2xl px-6 py-4">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">0.05%</div>
                <div className="text-white/80 text-sm font-medium">Platform Fee</div>
              </div>
              <div className="glass rounded-2xl px-6 py-4">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">5000+</div>
                <div className="text-white/80 text-sm font-medium">Happy Users</div>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="glass rounded-3xl p-6 md:p-8 mb-8 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Search Input - Takes more space */}
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    placeholder="Search location or property..."
                    className="input-field"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Property Type */}
                <div className="lg:col-span-3">
                  <select
                    className="input-field"
                    value={filters.propertyType}
                    onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  >
                    <option value="">All Property Types</option>
                    <option value="HOUSE">House</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="VILLA">Villa</option>
                    <option value="LAND">Land</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>

                {/* City */}
                <div className="lg:col-span-2">
                  <input
                    type="text"
                    placeholder="City"
                    className="input-field"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Search Button */}
                <div className="lg:col-span-3">
                  <button
                    onClick={handleSearch}
                    className="btn-primary w-full h-full text-lg group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Properties
                  </button>
                </div>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <details className="group">
                  <summary className="cursor-pointer text-white/90 font-medium hover:text-white transition-colors flex items-center justify-center gap-2">
                    <span>Advanced Filters</span>
                    <svg className="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <input
                      type="number"
                      placeholder="Min Price (Rp)"
                      className="input-field"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Max Price (Rp)"
                      className="input-field"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                  </div>
                </details>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link href="/properties" className="btn-secondary text-lg px-8 py-4 bg-white hover:bg-white/90 hover:scale-105">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Browse Properties
              </Link>
              <Link href="/auth/register" className="btn-accent text-lg px-8 py-4 hover:scale-105">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                List Your Property Free
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fafafa"/>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-container bg-neutral-50">
        <div className="text-center mb-16">
          <span className="badge badge-primary text-base px-6 py-2 mb-4 inline-block">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Buy or Sell in <span className="text-primary-600">3 Simple Steps</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Our streamlined process makes property transactions faster, cheaper, and more transparent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="card-hover p-8 text-center group">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                1
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Search & Discover</h3>
            <p className="text-neutral-600 leading-relaxed">
              Browse verified properties with detailed information, photos, and direct owner contact
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-hover p-8 text-center group">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                2
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Connect Directly</h3>
            <p className="text-neutral-600 leading-relaxed">
              Chat with owners, schedule visits, and negotiate deals without any middlemen
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-hover p-8 text-center group">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                3
              </div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Close the Deal</h3>
            <p className="text-neutral-600 leading-relaxed">
              Complete digital paperwork, notary services, and tax payments all in one platform
            </p>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="section-container bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <span className="badge badge-primary text-base px-6 py-2 mb-4 inline-block">Featured Listings</span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-2">
              Explore Premium Properties
            </h2>
            <p className="text-xl text-neutral-600">
              Handpicked properties from verified owners across Indonesia
            </p>
          </div>
          <Link
            href="/properties"
            className="btn-secondary group whitespace-nowrap"
          >
            View All Properties
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="property-card">
                <div className="property-card-image skeleton"></div>
                <div className="p-6 space-y-3">
                  <div className="skeleton h-6 w-3/4"></div>
                  <div className="skeleton h-4 w-1/2"></div>
                  <div className="skeleton h-8 w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="property-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="property-card-image">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-neutral-100">
                      <svg className="w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="badge bg-white/95 backdrop-blur-sm text-neutral-800 font-semibold">
                      {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                    </span>
                    <span className="badge badge-primary font-semibold">
                      {property.propertyType}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 flex items-center gap-1">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.city}, {property.province}
                  </p>
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-primary-600">
                        Rp {(Number(property.price) / 1000000).toFixed(1)}
                      </span>
                      <span className="text-neutral-600 text-sm ml-1">Jt</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-neutral-600 pt-4 border-t border-neutral-100">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.bedrooms} BR
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {property.bathrooms} BA
                      </div>
                    )}
                    {property.landArea && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {property.landArea}m²
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Value Propositions Section */}
      <section className="section-container bg-neutral-50">
        <div className="text-center mb-16">
          <span className="badge badge-primary text-base px-6 py-2 mb-4 inline-block">Why Choose EasyHome</span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            The Smarter Way to <span className="text-primary-600">Buy & Sell</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            We're revolutionizing real estate transactions in Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Value 1 */}
          <div className="card p-8 hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Save Up to 50x</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Traditional brokers charge 2-5% commission. We charge only 0.05-0.09%. On a Rp 1 Billion property, that's savings of Rp 19-49 Million.
            </p>
            <div className="inline-flex items-center text-primary-600 font-semibold group cursor-pointer">
              Learn more
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Value 2 */}
          <div className="card p-8 hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Lightning Fast</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              No waiting for broker schedules. Connect with owners instantly, schedule viewings same-day, and close deals in days, not months.
            </p>
            <div className="inline-flex items-center text-primary-600 font-semibold group cursor-pointer">
              See how
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Value 3 */}
          <div className="card p-8 hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">100% Verified</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Every property and owner is verified. All legal documents checked. Integrated notary and tax services for complete peace of mind.
            </p>
            <div className="inline-flex items-center text-primary-600 font-semibold group cursor-pointer">
              Our process
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Value 4 */}
          <div className="card p-8 hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Smart Matching</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              AI-powered recommendations match you with properties that fit your exact needs, budget, and preferences.
            </p>
            <div className="inline-flex items-center text-primary-600 font-semibold group cursor-pointer">
              Try it now
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Value 5 */}
          <div className="card p-8 hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">Digital Paperwork</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Say goodbye to stacks of paper. Complete all documentation digitally with integrated e-signatures and digital notary services.
            </p>
            <div className="inline-flex items-center text-primary-600 font-semibold group cursor-pointer">
              Go paperless
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Value 6 */}
          <div className="card p-8 hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">24/7 Support</h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Our dedicated support team is always here to help. Get instant answers to your questions anytime, anywhere.
            </p>
            <div className="inline-flex items-center text-primary-600 font-semibold group cursor-pointer">
              Contact us
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="section-container bg-white">
        <div className="text-center mb-16">
          <span className="badge badge-primary text-base px-6 py-2 mb-4 inline-block">Traditional vs EasyHome</span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            See the <span className="text-primary-600">Difference</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Method */}
            <div className="card p-8 border-2 border-neutral-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-neutral-200 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">Traditional Brokers</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-neutral-600">2-5% commission fees (Rp 20-50 Million per Billion)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-neutral-600">Weeks or months to close deals</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-neutral-600">Limited property access</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-neutral-600">Manual paperwork and documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-neutral-600">Hidden costs and surprises</span>
                </li>
              </ul>
            </div>

            {/* EasyHome Method */}
            <div className="relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-accent-500 text-white px-4 py-2 text-sm whitespace-nowrap shadow-lg z-10">
                Recommended
              </div>
              <div className="card p-8 border-2 border-primary-500 shadow-glow pt-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900">EasyHome</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-900 font-medium">0.05-0.09% fee (Rp 500K-900K per Billion)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-900 font-medium">Close deals in days</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-900 font-medium">Access to all listed properties</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-900 font-medium">Fully digital with e-signatures</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-neutral-900 font-medium">Transparent pricing, no hidden fees</span>
                </li>
              </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"></div>

        <div className="section-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to Save Millions on Your Next Property?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
              Join thousands of smart buyers and sellers who are eliminating broker fees and closing deals faster
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/auth/register" className="btn-accent text-lg px-10 py-5 text-white hover:scale-105 shadow-2xl group">
                <svg className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Listing for Free
              </Link>
              <Link href="/properties" className="btn-secondary bg-white/95 backdrop-blur-sm text-lg px-10 py-5 hover:bg-white hover:scale-105 shadow-xl">
                Explore Properties
              </Link>
            </div>

            <div className="glass rounded-2xl p-8 inline-block">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="text-left">
                    <div className="font-bold text-2xl">4.9/5</div>
                    <div className="text-white/80 text-sm">User Rating</div>
                  </div>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/20"></div>
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div className="text-left">
                    <div className="font-bold text-2xl">5,000+</div>
                    <div className="text-white/80 text-sm">Active Users</div>
                  </div>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/20"></div>
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-left">
                    <div className="font-bold text-2xl">Rp 500M+</div>
                    <div className="text-white/80 text-sm">Transactions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-4 text-primary-400">EasyHome</h3>
              <p className="text-neutral-400 mb-6 max-w-md leading-relaxed">
                Indonesia's leading integrated electronic housing marketplace. Connecting buyers and sellers directly for transparent, efficient property transactions.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3 text-neutral-400">
                <li><Link href="/properties" className="hover:text-primary-400 transition-colors">Browse Properties</Link></li>
                <li><Link href="/auth/register" className="hover:text-primary-400 transition-colors">List Property</Link></li>
                <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-3 text-neutral-400">
                <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/faq" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
                <li><Link href="/support" className="hover:text-primary-400 transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              &copy; 2026 EasyHome. All rights reserved. Integrated Electronic Housing Marketplace
            </p>
            <div className="flex gap-6 text-sm text-neutral-400">
              <span>Made with ❤️ in Indonesia</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
