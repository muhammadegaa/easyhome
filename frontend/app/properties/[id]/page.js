'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { propertyAPI } from '@/lib/api/client';
import useAuthStore from '@/lib/store/authStore';
import toast from 'react-hot-toast';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      const response = await propertyAPI.getPropertyById(params.id);
      setProperty(response.data.property);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load property');
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      router.push('/auth/login');
      return;
    }

    try {
      const response = await propertyAPI.toggleFavorite(params.id);
      setIsFavorited(!isFavorited);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      toast.error('Please login to contact seller');
      router.push('/auth/login');
      return;
    }
    // TODO: Open messaging modal or navigate to messages
    toast.success('Messaging feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-300 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Property not found</h1>
          <Link href="/properties" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Browse all properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/properties" className="text-gray-600 hover:text-gray-900">Properties</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {hasImages ? (
                <>
                  {/* Main Image */}
                  <div className="relative h-96 bg-gray-200">
                    <img
                      src={`http://localhost:5000${images[selectedImage]?.url}`}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full">
                      {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-6 gap-2 p-4">
                      {images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImage(index)}
                          className={`relative h-16 rounded-lg overflow-hidden border-2 transition ${
                            selectedImage === index
                              ? 'border-primary-600'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={`http://localhost:5000${image.url}`}
                            alt={`View ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-lg">No images available</span>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>

              <div className="flex items-center text-gray-600 mb-4">
                <span className="mr-4">📍 {property.address}, {property.city}, {property.province}</span>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                {property.bedrooms && (
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="mr-2">🛏️</span>
                    <span className="font-semibold">{property.bedrooms}</span>
                    <span className="text-gray-600 ml-1">Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="mr-2">🚿</span>
                    <span className="font-semibold">{property.bathrooms}</span>
                    <span className="text-gray-600 ml-1">Bathrooms</span>
                  </div>
                )}
                {property.landArea && (
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="mr-2">📏</span>
                    <span className="font-semibold">{property.landArea}m²</span>
                    <span className="text-gray-600 ml-1">Land</span>
                  </div>
                )}
                {property.buildingArea && (
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="mr-2">🏠</span>
                    <span className="font-semibold">{property.buildingArea}m²</span>
                    <span className="text-gray-600 ml-1">Building</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Property Features</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Property Type:</span>
                  <span className="ml-2 font-semibold">{property.propertyType}</span>
                </div>
                {property.certificate && (
                  <div>
                    <span className="text-gray-600">Certificate:</span>
                    <span className="ml-2 font-semibold">{property.certificate}</span>
                  </div>
                )}
                {property.floors && (
                  <div>
                    <span className="text-gray-600">Floors:</span>
                    <span className="ml-2 font-semibold">{property.floors}</span>
                  </div>
                )}
                {property.carports && (
                  <div>
                    <span className="text-gray-600">Carports:</span>
                    <span className="ml-2 font-semibold">{property.carports}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Furnished:</span>
                  <span className="ml-2 font-semibold">{property.furnished ? 'Yes' : 'No'}</span>
                </div>
                {property.yearBuilt && (
                  <div>
                    <span className="text-gray-600">Year Built:</span>
                    <span className="ml-2 font-semibold">{property.yearBuilt}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary-600">
                  Rp {Number(property.price).toLocaleString('id-ID')}
                </div>
                {property.pricePerMonth && (
                  <div className="text-gray-600 mt-1">
                    Rp {Number(property.pricePerMonth).toLocaleString('id-ID')}/month
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleContactSeller}
                  className="w-full btn-primary"
                >
                  Contact Seller
                </button>
                <button
                  onClick={handleFavorite}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <span className="mr-2">{isFavorited ? '❤️' : '🤍'}</span>
                  {isFavorited ? 'Saved' : 'Save Property'}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600 mb-2">Listed by</div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold text-lg">
                      {property.owner?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{property.owner?.name}</div>
                    {property.owner?.companyName && (
                      <div className="text-sm text-gray-600">{property.owner.companyName}</div>
                    )}
                    {property.owner?.membershipTier !== 'NONE' && (
                      <div className="text-xs text-primary-600 font-medium">
                        {property.owner.membershipTier} Member
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4">Property Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-semibold">{property.viewCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorites</span>
                  <span className="font-semibold">{property.favoriteCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-semibold">
                    {new Date(property.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
