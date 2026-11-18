import { validationResult } from 'express-validator';
import { ApiError } from '../utils/http.js';

// Runs an array of express-validator chains, then fails with a 400 listing every field error.
export const validate = (chains) => async (req, res, next) => {
  for (const chain of chains) {
    // eslint-disable-next-line no-await-in-loop
    await chain.run(req);
  }
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  next(new ApiError(400, errors[0].message, errors));
};
