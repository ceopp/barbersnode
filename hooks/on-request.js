const fp = require('fastify-plugin');

module.exports = fp(async function (f, _opts) {
	if (process.env.DEBUG_REQUESTS) {
		f.addHook('preValidation', async (req, ) => {
			log.i('I', req.id, {
				method: req.req.method,
				url: req.req.url,
				query: { ...req.query },
				params: req.params,
				body: req.body,
				ip: req.headers['x-real-ip']
			});
		});
		f.addHook('onSend', async (req, res) => {
			log.i('O', req.id, {
				method: req.req.method,
				url: req.req.url,
				status: res.statusCode,
			});
		});
	}
});