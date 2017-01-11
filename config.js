var config = {};

config.user_name = process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME || 'MAChine';
config.password = process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD || 'reader';  

module.exports = config;