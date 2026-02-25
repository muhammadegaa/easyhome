import prisma from '../config/database.js';

// Create property listing
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      listingType,
      price,
      pricePerMonth,
      address,
      city,
      province,
      zipCode,
      latitude,
      longitude,
      landArea,
      buildingArea,
      bedrooms,
      bathrooms,
      floors,
      carports,
      furnished,
      certificate,
      yearBuilt,
    } = req.body;

    // Validation
    if (!title || !description || !propertyType || !listingType || !price || !address || !city || !province) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        propertyType,
        listingType,
        price: parseFloat(price),
        pricePerMonth: pricePerMonth ? parseFloat(pricePerMonth) : null,
        address,
        city,
        province,
        zipCode,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        landArea: landArea ? parseFloat(landArea) : null,
        buildingArea: buildingArea ? parseFloat(buildingArea) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        floors: floors ? parseInt(floors) : null,
        carports: carports ? parseInt(carports) : null,
        furnished: furnished === 'true' || furnished === true,
        certificate,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
        ownerId: req.user.id,
        publishedAt: new Date(),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            companyName: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Property created successfully',
      property,
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

// Get all properties with search and filters
export const getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      propertyType,
      listingType,
      city,
      province,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      status: 'AVAILABLE',
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (listingType) {
      where.listingType = listingType;
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (province) {
      where.province = { contains: province, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (bedrooms) {
      where.bedrooms = { gte: parseInt(bedrooms) };
    }

    if (bathrooms) {
      where.bathrooms = { gte: parseInt(bathrooms) };
    }

    // Get total count
    const total = await prisma.property.count({ where });

    // Get properties
    const properties = await prisma.property.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { [sortBy]: sortOrder },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            companyName: true,
            membershipTier: true,
          },
        },
        images: {
          take: 1,
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
    });

    res.json({
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

// Get single property by ID
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            companyName: true,
            membershipTier: true,
            avatar: true,
          },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count
    await prisma.property.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({ property });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (existingProperty.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to update this property' });
    }

    const {
      title,
      description,
      propertyType,
      listingType,
      price,
      pricePerMonth,
      address,
      city,
      province,
      zipCode,
      latitude,
      longitude,
      landArea,
      buildingArea,
      bedrooms,
      bathrooms,
      floors,
      carports,
      furnished,
      certificate,
      yearBuilt,
      status,
    } = req.body;

    const property = await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        propertyType,
        listingType,
        price: price ? parseFloat(price) : undefined,
        pricePerMonth: pricePerMonth ? parseFloat(pricePerMonth) : undefined,
        address,
        city,
        province,
        zipCode,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        landArea: landArea ? parseFloat(landArea) : undefined,
        buildingArea: buildingArea ? parseFloat(buildingArea) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
        floors: floors ? parseInt(floors) : undefined,
        carports: carports ? parseInt(carports) : undefined,
        furnished: furnished !== undefined ? (furnished === 'true' || furnished === true) : undefined,
        certificate,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
        status,
      },
    });

    res.json({
      message: 'Property updated successfully',
      property,
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this property' });
    }

    await prisma.property.delete({
      where: { id },
    });

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

// Get user's properties
export const getMyProperties = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ownerId: req.user.id,
    };

    if (status) {
      where.status = status;
    }

    const total = await prisma.property.count({ where });

    const properties = await prisma.property.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          take: 1,
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
    });

    res.json({
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get my properties error:', error);
    res.status(500).json({ error: 'Failed to fetch your properties' });
  }
};

// Toggle favorite
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if already favorited
    const existingFavorite = await prisma.propertyFavorite.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId: id,
        },
      },
    });

    if (existingFavorite) {
      // Remove favorite
      await prisma.propertyFavorite.delete({
        where: { id: existingFavorite.id },
      });

      // Decrement count
      await prisma.property.update({
        where: { id },
        data: { favoriteCount: { decrement: 1 } },
      });

      res.json({ message: 'Removed from favorites', isFavorited: false });
    } else {
      // Add favorite
      await prisma.propertyFavorite.create({
        data: {
          userId: req.user.id,
          propertyId: id,
        },
      });

      // Increment count
      await prisma.property.update({
        where: { id },
        data: { favoriteCount: { increment: 1 } },
      });

      res.json({ message: 'Added to favorites', isFavorited: true });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

// Get user's favorites
export const getFavorites = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await prisma.propertyFavorite.count({
      where: { userId: req.user.id },
    });

    const favorites = await prisma.propertyFavorite.findMany({
      where: { userId: req.user.id },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                companyName: true,
              },
            },
            images: {
              take: 1,
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    res.json({
      favorites: favorites.map((f) => f.property),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};
