module.exports = async function (f, opts) {
    f.post('/edit', {
        schema: {
            tags: ['barber'],
            body: {
                type: 'object',
                properties: {
                    about: { type: 'string' },
                    orderPlace: { type: 'array', items: { type: 'string' } },
                    portfolio: { type: 'array', items: { type: 'string' } },
                    isActive: { type: 'boolean', example: true },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isBarber],
    }, async (req, res) => {
	
        let { portfolio, about, isActive, orderPlace } = req.body;
        req.barber.assign({
            portfolio,
            about: about.trim(),
            isActive,
            orderPlace,
        });
        await req.barber.save();
        res.send(req.barber);
    });
};