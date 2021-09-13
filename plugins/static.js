const path = require('path');
const fp = require('fastify-plugin');
module.exports = fp(function (fastify, opts, next) {
    fastify.register(require('fastify-static'), {
        root: path.join(__basedir, 'public'),
        prefix: '/',
        redirect: true
    });
    fastify.register(require('fastify-static'), {
        root: path.join(__basedir, 'uploads'),
        prefix: '/uploads',
        redirect: true,
        decorateReply: false
    });
/*    fastify.register(require('fastify-static'), {
        root: path.join(__basedir, 'admin'),
        prefix: '/admin',
        decorateReply: false
    });*/
    next();
});
