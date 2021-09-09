module.exports = async function (f, opts) {
    const Order = f.db.Order;
    const BarberService = f.db.BarberService;
    f.post('/create', {
        schema: {
            tags: ['order'],
            body: {
                type: 'object',
                properties: {
                    barberId: { type: 'string' },
                    services: { type: 'array' },
                    date: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        try {
            let { barberId, services, date } = req.body;
            if (!barberId || !services) res.badRequest('ID Барбера и сервиса обязателен');

            const _service = await BarberService.findAll({
                where: { barberId }
            });
            let amount = 0;
            for (const s of _service) {
                if (services.includes(parseInt(s.id)))
                    amount += s.price;
            }
            let order = await Order.create({
                userId: req.user.id,
                barberId,
                services,
                date,
                amount,
                status: 'waiting'
            });
            order = order.toJSON();
            res.send(order);
            f.fcmSendUser(barberId,
                'К вам записались',
                'Откройте приложение чтобы проверить запись',
                {
                    event: 'new_order'
                });
        } catch (e) {
            log.e(e);
            res.send(false);
        }
    });
};
