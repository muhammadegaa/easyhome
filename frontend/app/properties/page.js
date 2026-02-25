'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { propertyAPI } from '@/lib/api/client';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/lib/utils/env';

function PropertiesPageContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    propertyType: searchParams.get('propertyType') || '',
    listingType: searchParams.get('listingType') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    page: 1,
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) params[key] = filters[key];
      });

      const response = await propertyAPI.getProperties(params);
      setProperties(response.data.properties);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      propertyType: '',
      listingType: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      page: 1,
    });
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => key !== 'page' && filters[key]
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"></div>

        <div className="relative section-container py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
              Temukan Properti Impian Anda
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up">
              {pagination.total || 0} properti tersedia di seluruh Indonesia
            </p>
          </div>
        </div>
      </section>

      <div className="section-container">
        {/* Filters Bar */}
        <div className="glass-strong rounded-2xl p-6 mb-8 -mt-16 relative z-10 animate-slide-up">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showFilters ? 'Sembunyikan' : 'Tampilkan'} Filter
              {hasActiveFilters && (
                <span className="badge badge-primary ml-2">Aktif</span>
              )}
            </button>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari lokasi atau nama properti..."
                    className="input-field pl-12"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>

              {/* Property Type */}
              <select
                className="input-field"
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              >
                <option value="">Semua Tipe</option>
                <option value="HOUSE">Rumah</option>
                <option value="APARTMENT">Apartemen</option>
                <option value="VILLA">Villa</option>
                <option value="LAND">Tanah</option>
                <option value="COMMERCIAL">Komersial</option>
              </select>

              {/* Listing Type */}
              <select
                className="input-field"
                value={filters.listingType}
                onChange={(e) => handleFilterChange('listingType', e.target.value)}
              >
                <option value="">Jual atau Sewa</option>
                <option value="SALE">Dijual</option>
                <option value="RENT">Disewakan</option>
              </select>

              {/* City */}
              <input
                type="text"
                placeholder="Kota"
                className="input-field"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />

              {/* Min Price */}
              <input
                type="number"
                placeholder="Harga Minimum (Rp)"
                className="input-field"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />

              {/* Max Price */}
              <input
                type="number"
                placeholder="Harga Maksimum (Rp)"
                className="input-field"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />

              {/* Bedrooms */}
              <select
                className="input-field"
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              >
                <option value="">Jumlah Kamar</option>
                <option value="1">1+ Kamar</option>
                <option value="2">2+ Kamar</option>
                <option value="3">3+ Kamar</option>
                <option value="4">4+ Kamar</option>
                <option value="5">5+ Kamar</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-neutral-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Hapus Semua Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              {loading ? 'Memuat...' : `${pagination.total || 0} Properti Ditemukan`}
            </h2>
            {hasActiveFilters && !loading && (
              <p className="text-neutral-600">
                Hasil pencarian dengan filter aktif
              </p>
            )}
          </div>

          {/* Sort Options */}
          <select className="input-field w-full sm:w-auto">
            <option>Terbaru</option>
            <option>Harga Terendah</option>
            <option>Harga Tertinggi</option>
            <option>Paling Populer</option>
          </select>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="property-card animate-pulse">
                <div className="property-card-image skeleton"></div>
                <div className="p-6 space-y-4">
                  <div className="skeleton h-6 w-3/4"></div>
                  <div className="skeleton h-4 w-1/2"></div>
                  <div className="skeleton h-8 w-1/3"></div>
                  <div className="flex gap-4">
                    <div className="skeleton h-4 w-16"></div>
                    <div className="skeleton h-4 w-16"></div>
                    <div className="skeleton h-4 w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-neutral-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">
              Tidak Ada Properti Ditemukan
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Coba sesuaikan filter pencarian Anda atau hapus beberapa filter untuk melihat lebih banyak properti
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-primary">
                Hapus Semua Filter
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {properties.map((property, index) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="property-card group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="property-card-image">
                    {property.images?.[0] ? (
                      <>
                        <img
                          src={getImageUrl(property.images[0].url)}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="image-overlay"></div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-neutral-100">
                        <svg className="w-16 h-16 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <span className="badge bg-white/95 backdrop-blur-sm text-neutral-800 font-semibold shadow-lg">
                        {property.listingType === 'SALE' ? 'Dijual' : 'Disewakan'}
                      </span>
                      <span className="badge badge-primary font-semibold shadow-lg">
                        {property.propertyType === 'HOUSE' ? 'Rumah' :
                         property.propertyType === 'APARTMENT' ? 'Apartemen' :
                         property.propertyType === 'VILLA' ? 'Villa' :
                         property.propertyType === 'LAND' ? 'Tanah' : 'Komersial'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {property.title}
                    </h3>

                    <p className="text-neutral-600 text-sm mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-1">{property.city}, {property.province}</span>
                    </p>

                    <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-neutral-100">
                      <div>
                        <span className="text-3xl font-bold text-primary-600">
                          Rp {(Number(property.price) / 1000000).toFixed(1)}
                        </span>
                        <span className="text-neutral-600 text-sm ml-1">Juta</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm text-neutral-600">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span className="font-medium">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="font-medium">{property.bathrooms}</span>
                        </div>
                      )}
                      {property.landArea && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span className="font-medium">{property.landArea}m²</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-xl border-2 border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 disabled:hover:border-neutral-200 disabled:hover:bg-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex gap-2">
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrentPage = pagination.page === pageNum;
                    const isNearCurrent = Math.abs(pagination.page - pageNum) <= 1;
                    const isFirstOrLast = pageNum === 1 || pageNum === pagination.totalPages;

                    if (!isNearCurrent && !isFirstOrLast) {
                      if (pageNum === 2 || pageNum === pagination.totalPages - 1) {
                        return <span key={pageNum} className="px-2">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                          isCurrentPage
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                            : 'border-2 border-neutral-200 hover:border-primary-500 hover:bg-primary-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 rounded-xl border-2 border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 disabled:hover:border-neutral-200 disabled:hover:bg-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        {!loading && properties.length > 0 && (
          <div className="mt-20 mb-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 p-12 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Tidak Menemukan Yang Anda Cari?
                </h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Daftarkan properti Anda secara GRATIS dan jangkau ribuan pembeli potensial
                </p>
                <Link href="/auth/register" className="btn-accent text-lg px-8 py-4 inline-flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Pasang Iklan Gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <div className="section-container py-20">
          <div className="flex items-center justify-center">
            <div className="spinner border-primary-600"></div>
          </div>
        </div>
      </div>
    }>
      <PropertiesPageContent />
    </Suspense>
  );
}
