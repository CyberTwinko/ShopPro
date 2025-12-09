import asyncHandler from '../middleware/asyncHandler.js';
import path from 'path';

// @desc    Upload user profile picture
// @route   POST /api/upload/profile
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // Return file path for frontend
  const filePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ filePath });
});

export { uploadProfilePicture };