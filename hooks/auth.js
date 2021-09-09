const fp = require('fastify-plugin');
module.exports = fp(async function (f, opts) {
  const User = f.db.User;
  f.decorate('auth', async (req, res) => {
    if (!req.headers.authorization) return res.unauthorized('Token is required');
    const user = await User.verifyJwt(f, req.headers.authorization, true);
    if (!user) return res.unauthorized('Token invalid or user not found');
    req.user = user;
  });
});
