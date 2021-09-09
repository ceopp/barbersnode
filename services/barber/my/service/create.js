module.exports = async function (f, opts) {
    const BarberService = f.db.BarberService;

    f.post('/create', {
        schema: {
            tags: ['barber'],
            body: {
                type: 'object',
                properties: {
                    serviceId: { type: 'string' },
                    price: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isBarber],
    }, async (req, res) => {
        try {
            await BarberService.create({
                barberId: req.barber.id,
                serviceId: req.body.serviceId,
                price: req.body.price,
            });
        } catch (e) {
            log.e(e);
        } finally {
            res.send(true);
        }
    });
};