module.exports = async function (f, opts) {
    const Call = f.db.Call;

    f.post('/user', {
        schema: {
            tags: ['call'],
            body: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                },
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isBarber],
    }, async (req, res) => {
        Call.create({
            userId: req.body.userId,
            barberId: req.barber.id,
            byUser: false,
        });
        res.send(true);
        f.fcmSendUser(req.body.userId,
            'Вам звонили',
            '',
            {
                event: 'call_user'
            });
    });
};
