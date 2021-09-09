module.exports = async function (f, opts) {
    const Barber = f.db.Barber;
    f.post('/deleteConfirm', {
        schema: {
            tags: ['barber'],
            body: {
                type: 'object',
                properties: {
                    code: { type: 'string', description: 'SMS code' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isBarber],
    }, async (req, res) => {
        if (!req.body.code)
            return res.unauthorized('Нужен код из смс');
        if (!req.barber.phoneCode)
            return res.unauthorized('Запросите код сначала');
        if (req.body.code != req.barber.phoneCode)
            return res.unauthorized('Неправильный код');
        req.barber.assignNullable({
            userId: 0,
            portfolio: [],
            about: '',
            isActive: false,
        });
        await req.barber.save();
        return true;
    });
};
