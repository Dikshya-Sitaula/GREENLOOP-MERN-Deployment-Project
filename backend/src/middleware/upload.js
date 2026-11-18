import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { UPLOAD_DIR } from '../config/env.js';
import { ApiError } from '../utils/http.js';

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${EXT[file.mimetype]}`),
});

export const uploadImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) =>
    EXT[file.mimetype] ? cb(null, true) : cb(new ApiError(400, 'Only JPG, PNG or WebP images are allowed')),
}).array('images', 5);

export const publicPath = (file) => `/uploads/${path.basename(file.filename)}`;
