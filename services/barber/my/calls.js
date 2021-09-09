module.exports = async function (f, opts) {
    const Call = f.db.Call;
    const User = f.db.User;
    const City = f.db.City;

    f.get('/calls', {
        schema: {
            tags: ['call'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isBarber],
    }, async (req, res) => {
        const calls = await Call.findAll({
            where: {
                barberId: req.barber.id,
            },
            order: [
                ['createdAt', 'DESC'],
            ],
            include: [
                {
                    model: User, as: 'user',
                    attributes: ['id', 'cityId', 'photo', 'name', 'phone'],
                    include: [
                        { model: City, as: 'city' },
                    ]
                }
            ]
        });
        res.send(calls);
    });
};
