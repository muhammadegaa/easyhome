'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import useAuthStore from '@/lib/store/authStore';
import { propertyAPI } from '@/lib/api/client';
import { getApiUrl } from '@/lib/utils/env';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function NewPropertyPage() {
  const router = useRouter();
  const { user, initialize } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    description: '',
    propertyType: 'HOUSE',
    listingType: 'SALE',

    // Step 2: Property Details
    price: '',
    pricePerMonth: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    landArea: '',
    buildingArea: '',
    bedrooms: '',
    bathrooms: '',
    floors: '',
    carports: '',
    furnished: false,
    certificate: '',
    yearBuilt: '',
  });

  useEffect(() => {
    initialize();
    if (!user) {
      toast.error('Please login to list a property');
      router.push('/auth/login');
    }
  }, [user, initialize, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length > 20) {
      toast.error('Maximum 20 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    // Create previews
    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setImageFiles([...imageFiles, ...validFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    // Revoke object URL to free memory
    URL.revokeObjectURL(newPreviews[index].preview);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.title || !formData.description) {
        toast.error('Please fill in title and description');
        return false;
      }
      if (formData.title.length < 10) {
        toast.error('Title must be at least 10 characters');
        return false;
      }
      if (formData.description.length < 50) {
        toast.error('Description must be at least 50 characters');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.price || !formData.address || !formData.city || !formData.province) {
        toast.error('Please fill in all required fields');
        return false;
      }
      if (parseFloat(formData.price) <= 0) {
        toast.error('Price must be greater than 0');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(step)) return;

    setLoading(true);

    try {
      // Step 1: Create property
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        pricePerMonth: formData.pricePerMonth ? parseFloat(formData.pricePerMonth) : undefined,
        landArea: formData.landArea ? parseFloat(formData.landArea) : undefined,
        buildingArea: formData.buildingArea ? parseFloat(formData.buildingArea) : undefined,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        floors: formData.floors ? parseInt(formData.floors) : undefined,
        carports: formData.carports ? parseInt(formData.carports) : undefined,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
      };

      const propertyResponse = await propertyAPI.createProperty(propertyData);
      const propertyId = propertyResponse.data.property.id;

      // Step 2: Upload images if any
      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach(file => {
          formDataImages.append('images', file);
        });

        const apiUrl = getApiUrl();
        await axios.post(
          `${apiUrl}/api/properties/${propertyId}/images`,
          formDataImages,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      toast.success('Property listed successfully!');
      router.push(`/properties/${propertyId}`);
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error(error.response?.data?.error || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">List Your Property</h1>
            <p className="text-gray-600 mt-2">Fill in the details to create your property listing</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step >= num
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {num}
                  </div>
                  {num < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > num ? 'bg-primary-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-600">Basic Info</span>
              <span className="text-sm text-gray-600">Details</span>
              <span className="text-sm text-gray-600">Photos</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="input-field"
                    placeholder="e.g., Modern 3 Bedroom House in Central Jakarta"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows="6"
                    className="input-field"
                    placeholder="Describe your property in detail. Include unique features, recent renovations, neighborhood highlights, etc."
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 50 characters ({formData.description.length}/50)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type *
                    </label>
                    <select
                      name="propertyType"
                      required
                      className="input-field"
                      value={formData.propertyType}
                      onChange={handleChange}
                    >
                      <option value="HOUSE">House</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="LAND">Land</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="VILLA">Villa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Listing Type *
                    </label>
                    <select
                      name="listingType"
                      required
                      className="input-field"
                      value={formData.listingType}
                      onChange={handleChange}
                    >
                      <option value="SALE">For Sale</option>
                      <option value="RENT">For Rent</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Property Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Property Details</h2>

                {/* Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.listingType === 'SALE' ? 'Price (Rp)' : 'Price per Month (Rp)'} *
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      className="input-field"
                      placeholder="2500000000"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>

                  {formData.listingType === 'RENT' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Deposit (Rp)
                      </label>
                      <input
                        type="number"
                        name="pricePerMonth"
                        className="input-field"
                        placeholder="5000000"
                        value={formData.pricePerMonth}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="input-field"
                    placeholder="Jl. Sudirman No. 123"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      className="input-field"
                      placeholder="Jakarta"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province *
                    </label>
                    <input
                      type="text"
                      name="province"
                      required
                      className="input-field"
                      placeholder="DKI Jakarta"
                      value={formData.province}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      className="input-field"
                      placeholder="12345"
                      value={formData.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Land Area (m²)
                    </label>
                    <input
                      type="number"
                      name="landArea"
                      className="input-field"
                      placeholder="200"
                      value={formData.landArea}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Building Area (m²)
                    </label>
                    <input
                      type="number"
                      name="buildingArea"
                      className="input-field"
                      placeholder="150"
                      value={formData.buildingArea}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      className="input-field"
                      placeholder="3"
                      value={formData.bedrooms}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      className="input-field"
                      placeholder="2"
                      value={formData.bathrooms}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floors
                    </label>
                    <input
                      type="number"
                      name="floors"
                      className="input-field"
                      placeholder="2"
                      value={formData.floors}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carports
                    </label>
                    <input
                      type="number"
                      name="carports"
                      className="input-field"
                      placeholder="2"
                      value={formData.carports}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Built
                    </label>
                    <input
                      type="number"
                      name="yearBuilt"
                      className="input-field"
                      placeholder="2020"
                      value={formData.yearBuilt}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate
                    </label>
                    <input
                      type="text"
                      name="certificate"
                      className="input-field"
                      placeholder="SHM"
                      value={formData.certificate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Furnished */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="furnished"
                    id="furnished"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.furnished}
                    onChange={handleChange}
                  />
                  <label htmlFor="furnished" className="ml-2 block text-sm text-gray-900">
                    Property is furnished
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Property Photos</h2>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Click to upload photos
                    </p>
                    <p className="text-sm text-gray-500">
                      Upload up to 20 images (max 5MB each)
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported: JPG, PNG, GIF, WEBP
                    </p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      {imagePreviews.length} image(s) selected
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                              Cover
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> The first image will be used as the cover photo.
                    Drag images to reorder after upload.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Listing...' : 'Publish Listing'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
