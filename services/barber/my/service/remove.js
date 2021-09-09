module.exports = async function (f, opts) {
    const BarberService = f.db.BarberService;

    f.post('/remove', {
        schema: {
            tags: ['barber'],
            body: {
                type: 'object',
                properties: {
                    serviceId: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isBarber],
    }, async (req, res) => {
        try {
            await BarberService.destroy({
                where: {
                    barberId: req.barber.id,
                    serviceId: req.body.serviceId,
                }
            });
        } catch (e) {
            log.e(e);
        } finally {
            res.send(true);
        }
    });
};