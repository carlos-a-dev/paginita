// require('dotenv').config()

module.exports = {
  apps: [
    {
      name: 'paginita-frontend',
      script: '.output/server/index.mjs',
      max_memory_restart: '200M',

      // Logging
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      log_date_format: 'DD-MM HH:mm:ss Z',
      log_type: 'json',

      // Env Specific Config
      env_production: {
        name: 'paginita',
        cwd: '/var/www/paginita/frontend/',
        NODE_ENV: 'production',
        PORT: 5000,
        exec_mode: 'cluster',
        instances: 0,
      },
    },
    {
      name: 'paginita-backend',
      script: 'pnpm',
      args: 'start',
      max_memory_restart: '200M',

      // Logging
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      merge_logs: true,
      log_date_format: 'DD-MM HH:mm:ss Z',
      log_type: 'json',

      // Env Specific Config
      env_production: {
        name: 'paginita',
        cwd: '/var/www/paginita/backend/',
        NODE_ENV: 'production',
        exec_mode: 'fork',
        instances: 0,
      },
    },
  ],
}