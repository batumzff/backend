const { server } = require('./app');
const connectDB = require('./config/db');
const config = require('./config/config');

// Connect to database
connectDB();

// Start server
let PORT = parseInt(config.PORT, 10);

// Ensure PORT is a valid number between 0-65535
if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
  PORT = 3000; // Default to 3000 if invalid
  console.log(`Invalid port detected, using default port ${PORT}`);
}

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    PORT = PORT + 1;
    
    // Ensure incremented port is still valid
    if (PORT > 65535) {
      PORT = 3000;
    }
    
    console.log(`Port ${PORT - 1} is already in use. Trying port ${PORT}`);
    
    // Give time for the previous connection attempt to close
    setTimeout(() => {
      server.close();
      server.listen(PORT);
    }, 1000);
  } else {
    console.error('Server error:', error);
  }
});

// Initial server startup
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});