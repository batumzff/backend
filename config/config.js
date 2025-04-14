require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d'
};