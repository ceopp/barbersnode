const fp = require('fastify-plugin');
module.exports = fp(async function (f, opts) {
    f.decorate('isAdmin', async (req, res) => {
        if (!req.user.isAdmin) return res.forbidden('Must be admin');
    });
});