module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    /* {
      script: 'npm',
      name: 'gStash',
      cwd: './api',
      args: 'run-script start',
      watch: true,
    },*/

    // Second application
    {
      script: 'npm',
      name: 'indexer',
      cwd: './indexer',
      args: 'run-script start',
      watch: true,
    },

    // Front application
    /* {
      script: "npm",
      name: "front",
      cwd: "./front",
      args: "run-script run dev",
      watch: true
    } */
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  /*deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }*/
}
