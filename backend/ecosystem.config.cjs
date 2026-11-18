// PM2 process definition. Runtime secrets (MONGO_URI, JWT_SECRET, CLIENT_URL...) live in
// backend/.env on the server, which backend/src/config/env.js loads via dotenv.
module.exports = {
  apps: [
    {
      name: 'greenloop-api',
      script: 'src/index.js',
      cwd: '/var/www/greenloop/backend',
      exec_mode: 'fork', // single-core t2.micro: no cluster mode
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
