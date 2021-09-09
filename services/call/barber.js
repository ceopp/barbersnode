module.exports = async function (f, opts) {
    const Call = f.db.Call;
    const Barber = f.db.Barber;

    f.post('/barber', {
        schema: {
            tags: ['call'],
            body: {
                type: 'object',
                properties: {
                    barberId: { type: 'string' },
                },
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {

        Call.create({
            userId: req.user.id,
            barberId: req.body.barberId,
            byUser: true,
        });
        res.send(true);
        const barber = await Barber.findByPk(req.body.barberId);
        f.fcmSendUser(barber.userId,
            'Вам звонили',
            'Откройте приложение, чтобы проверить входящие',
            {
                event: 'call_barber'
            });
    });
};
