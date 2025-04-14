const User = require('../models/User');

exports.registerUser = async (userData) => {
  return await User.create(userData);
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

exports.getUserById = async (userId) => {
  return await User.findById(userId);
};

exports.getAllUsers = async () => {
  return await User.find().select('-password');
};