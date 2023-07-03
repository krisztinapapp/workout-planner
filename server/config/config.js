// check environment
let env = process.env.NODE_ENV || 'development';

// fetch environment configuration
let config = require('./config.json');

// envConfig is either development or production
let envConfig = config[env];

// add environment configuration values to process.env
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);