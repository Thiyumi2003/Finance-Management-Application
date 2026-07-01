const mongoose = require('mongoose');

async function connectDatabase() {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    console.warn('MONGODB_URI is not set. Backend is starting without a database connection.');
    return;
  }

  await mongoose.connect(connectionString);
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = { connectDatabase, disconnectDatabase };