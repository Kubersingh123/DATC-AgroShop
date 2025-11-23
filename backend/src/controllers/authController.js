const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/token');
const User = require('../models/User');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json({
    user,
    token
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user._id, role: user.role });
  res.json({ user, token });
});

const profile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const seedAdmin = asyncHandler(async (req, res) => {
  const adminExists = await User.findOne({ role: 'admin' });
  if (adminExists) {
    return res.json({ message: 'Admin already exists' });
  }

  const user = await User.create({
    name: 'Deepak Raj Singh',
    email: 'admin@agroshop.com',
    password: 'Agro@123',
    role: 'admin'
  });

  res.json({ message: 'Admin created', user });
});

module.exports = { register, login, profile, seedAdmin };

