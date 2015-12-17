var config = {};

config.user_name = process.env.APP_USER || 'app_user';
config.password=  process.env.APP_USER_PASSWORD || 'reader';

module.exports = config;