require('dotenv').config();

const app = require('./app');
const { connectDatabase, disconnectDatabase } = require('./config/db');

const PORT = process.env.PORT || 5000;
const connectionMode = process.env.MONGODB_URI ? 'MongoDB Atlas' : 'local no-database mode';

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (${connectionMode})`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

startServer();