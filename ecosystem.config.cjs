const path = require('node:path')

module.exports = {
  apps: [
    {
      name: 'paginita-frontend',
      script: '.output/server/index.mjs',
      cwd: path.join(__dirname, 'frontend'),
      interpreter: process.execPath,
      max_memory_restart: '512M',

      // Logging
      out_file: './logs/frontend_out.log',
      error_file: './logs/frontend_error.log',
      merge_logs: true,
      log_date_format: 'DD-MM HH:mm:ss Z',
      log_type: 'json',

      exec_mode: 'cluster',
      instances: 0, // 0 = max CPU cores

      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },

      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
    {
      name: 'paginita-backend',
      script: path.join(__dirname, 'backend/node_modules/@strapi/strapi/bin/strapi.js'),
      args: 'start',
      interpreter: process.execPath,
      cwd: path.join(__dirname, 'backend'),
      max_memory_restart: '512M',

      // Logging
      out_file: './logs/backend_out.log',
      error_file: './logs/backend_error.log',
      merge_logs: true,
      log_date_format: 'DD-MM HH:mm:ss Z',
      log_type: 'json',

      exec_mode: 'fork',
      instances: 1,

      env: {
        NODE_ENV: 'development',
      },

      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
