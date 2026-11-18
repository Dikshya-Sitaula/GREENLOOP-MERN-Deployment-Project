import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { ApiError, ok } from '../utils/http.js';

const session = (user) => ({ token: signToken(user), user });

export async function register(req, res) {
  const { name, email, password, city } = req.body;
  if (await User.exists({ email })) throw new ApiError(409, 'An account with this email already exists');
  const user = await User.create({ name, email, password, city });
  ok(res, session(user), 'Welcome to GreenLoop', 201);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Email or password is incorrect');
  ok(res, session(user), 'Welcome back');
}

export function me(req, res) {
  ok(res, req.user);
}

export async function updateMe(req, res) {
  const allowed = ['name', 'city', 'bio'];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  });
  await req.user.save();
  ok(res, req.user, 'Profile updated');
}

// JWTs are stateless; the client discards its token. Endpoint exists for a consistent API.
export function logout(req, res) {
  ok(res, null, 'Logged out');
}
