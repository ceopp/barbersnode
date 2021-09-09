module.exports = async function (f, opts) {
    const Barber = f.db.Barber;
    f.post('/deleteConfirm', {
        schema: {
            tags: ['user'],
            body: {
                type: 'object',
                properties: {
                    code: { type: 'string', description: 'SMS code' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        if (!req.body.code)
            return res.unauthorized('Нужен код из смс');
        if (!req.user.phoneCode)
            return res.unauthorized('Запросите код сначала');
        if (req.body.code != req.user.phoneCode)
            return res.unauthorized('Неправильный код');
        req.user.assignNullable({
            phone: null,
            phoneCode: null,
            birthday: null,
            name: 'Профиль удален',
            photo: '',
        });
        await req.user.save();
        const barber = await Barber.findOne({
            where: { userId: req.user.id }
        });
        if (barber) {
            barber.assignNullable({
                portfolio: [],
                about: '',
                isActive: false,
            });
            await barber.save();
        }
        return true;
    });
};
