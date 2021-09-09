const fp = require('fastify-plugin');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = fp(function (fastify, opts, next) {
    fastify.decorate('crypto', {
        crypto,
        randomHexString,
        saltString,
        saltPassword
    });
    fastify.decorate('jwt', jwt);
    next();
});
const randomHexString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

const saltString = function (string, salt) {
    var hash = crypto.createHmac('sha512', salt);
    var value;
    hash.update(string);
    value = hash.digest('hex');
    for (let i = 0; i < 1000; i++) {
        hash = crypto.createHmac('sha512', salt);
        hash.update(value);
        value = hash.digest('hex');
    }
    return {
        salt: salt,
        hash: value
    };
};
const saltPassword = function (userpassword) {
    var salt = randomHexString(32);
    return saltString(userpassword, salt);
};
