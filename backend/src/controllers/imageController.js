import prisma from '../config/database.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload images to property
export const uploadPropertyImages = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { category } = req.body; // optional: exterior, interior, kitchen, bedroom, etc.

    // Check if property exists and user owns it
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      // Delete uploaded files if property not found
      if (req.files) {
        await Promise.all(
          req.files.map(file => fs.unlink(file.path).catch(() => {}))
        );
      }
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      // Delete uploaded files if unauthorized
      if (req.files) {
        await Promise.all(
          req.files.map(file => fs.unlink(file.path).catch(() => {}))
        );
      }
      return res.status(403).json({ error: 'You do not have permission to upload images to this property' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    // Get current max order for this property
    const maxOrderResult = await prisma.propertyImage.findFirst({
      where: { propertyId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const startOrder = (maxOrderResult?.order || 0) + 1;

    // Create image records
    const imageRecords = req.files.map((file, index) => ({
      propertyId,
      url: `/uploads/${file.filename}`,
      caption: req.body[`caption_${index}`] || null,
      category: category || null,
      order: startOrder + index,
    }));

    const images = await prisma.propertyImage.createMany({
      data: imageRecords,
    });

    // Fetch created images
    const createdImages = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { order: 'asc' },
    });

    res.status(201).json({
      message: `${req.files.length} image(s) uploaded successfully`,
      images: createdImages,
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      await Promise.all(
        req.files.map(file => fs.unlink(file.path).catch(() => {}))
      );
    }
    console.error('Upload images error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
};

// Get property images
export const getPropertyImages = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const images = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { order: 'asc' },
    });

    res.json({ images });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

// Delete property image
export const deletePropertyImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
      include: { property: true },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Check permission
    if (image.property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this image' });
    }

    // Delete physical file
    const filePath = path.join(__dirname, '..', image.url);
    await fs.unlink(filePath).catch(() => {
      console.warn('Failed to delete physical file:', filePath);
    });

    // Delete database record
    await prisma.propertyImage.delete({
      where: { id: imageId },
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

// Reorder property images
export const reorderPropertyImages = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { imageOrders } = req.body; // Array of { imageId, order }

    // Check property ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to reorder images for this property' });
    }

    // Update orders
    await Promise.all(
      imageOrders.map(({ imageId, order }) =>
        prisma.propertyImage.update({
          where: { id: imageId },
          data: { order },
        })
      )
    );

    const updatedImages = await prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { order: 'asc' },
    });

    res.json({
      message: 'Images reordered successfully',
      images: updatedImages,
    });
  } catch (error) {
    console.error('Reorder images error:', error);
    res.status(500).json({ error: 'Failed to reorder images' });
  }
};

// Update image details (caption, category)
export const updatePropertyImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { caption, category } = req.body;

    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
      include: { property: true },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Check permission
    if (image.property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to update this image' });
    }

    const updatedImage = await prisma.propertyImage.update({
      where: { id: imageId },
      data: {
        caption,
        category,
      },
    });

    res.json({
      message: 'Image updated successfully',
      image: updatedImage,
    });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
};
