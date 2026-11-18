import { env } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({ success: false, data: null, message: `Route not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';
  let details = err.details;

  if (err.name === 'ValidationError') {
    status = 400;
    details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    message = details[0]?.message || 'Invalid data';
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}`;
  } else if (err.code === 11000) {
    status = 409;
    message = `${Object.keys(err.keyValue || {})[0] || 'Value'} already exists`;
  } else if (err.name === 'MulterError') {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Each image must be 5MB or smaller' : err.message;
  }

  if (status >= 500) console.error(err);
  res.status(status).json({
    success: false,
    data: null,
    message: status >= 500 && env.isProd ? 'Internal server error' : message,
    ...(details ? { errors: details } : {}),
  });
}
