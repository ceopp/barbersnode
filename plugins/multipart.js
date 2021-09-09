const fp = require('fastify-plugin');
module.exports = fp(function (f, opts, next) {
    f.register(require('fastify-file-upload'), {
        useTempFiles: true,
        tempFileDir: `${__basedir}/uploads/`,
        limits: { fileSize: 50 * 1024 * 1024 },
    });
    next();
});
