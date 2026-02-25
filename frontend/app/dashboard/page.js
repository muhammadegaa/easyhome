'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import useAuthStore from '@/lib/store/authStore';
import { propertyAPI } from '@/lib/api/client';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, initialize } = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    totalViews: 0,
  });

  useEffect(() => {
    initialize();
    if (!user) {
      router.push('/auth/login');
    } else {
      fetchMyProperties();
    }
  }, [user]);

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyAPI.getMyProperties();
      const props = response.data.properties;
      setProperties(props);

      // Calculate stats
      const available = props.filter(p => p.status === 'AVAILABLE').length;
      const sold = props.filter(p => p.status === 'SOLD').length;
      const totalViews = props.reduce((sum, p) => sum + p.viewCount, 0);

      setStats({
        total: props.length,
        available,
        sold,
        totalViews,
      });
    } catch (error) {
      toast.error('Failed to load your properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await propertyAPI.deleteProperty(id);
      toast.success('Property deleted successfully');
      fetchMyProperties();
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your property listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Listings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.available}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sold/Rented</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.sold}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalViews}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
          <Link href="/properties/new" className="btn-primary">
            + New Listing
          </Link>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Create your first property listing to get started</p>
            <Link href="/properties/new" className="btn-primary inline-block">
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Image */}
                <div className="h-48 bg-gray-200 relative">
                  {property.images?.[0] ? (
                    <img
                      src={`http://localhost:5000${property.images[0].url}`}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'AVAILABLE'
                      ? 'bg-green-600 text-white'
                      : property.status === 'SOLD'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-white'
                  }`}>
                    {property.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {property.city}, {property.province}
                  </p>
                  <div className="text-xl font-bold text-primary-600 mb-3">
                    Rp {Number(property.price).toLocaleString('id-ID')}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <span className="mr-1">👁️</span>
                      <span>{property.viewCount} views</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">❤️</span>
                      <span>{property._count?.favorites || 0} favorites</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/properties/${property.id}`}
                      className="flex-1 text-center py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-sm"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/edit/${property.id}`}
                      className="flex-1 text-center py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id, property.title)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
