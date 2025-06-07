require('dotenv').config()

module.exports = {
  apps: [
    {
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
    //   env_stage: {
    //     name: 'paginita-stage',
    //     cwd: '/var/www/stage.alvasori.net/web/',
    //     NODE_ENV: 'production',
    //     PORT: 5001,
    //     mode: 'fork',
    //     instances: '1',
    //   },
    //   env_development: {
    //     name: 'alvasori-dev',
    //     NODE_ENV: 'development',
    //     PORT: 3000,
    //     exec_mode: 'fork',
    //     instances: '1',
    //   },
    },
  ],
}