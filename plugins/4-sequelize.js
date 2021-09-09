const fp = require('fastify-plugin');

module.exports = fp(function (f, opts, next) {
    f.decorate('db', (require('../models'))(f));
    next();
});