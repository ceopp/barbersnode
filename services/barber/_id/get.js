module.exports = async function (f, opts) {
    const Barber = f.db.Barber;
    const User = f.db.User;
    const City = f.db.City;
    f.get('/get', {
        schema: {
            tags: ['barber'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        const barber = await Barber.findByPk(req.params.id, {
            include: [
                {
                    model: User, as: 'user',
                    attributes: ['id', 'cityId', 'photo', 'name', 'phone'],
                    include: [
                        { model: City, as: 'city' },
                    ]
                },
                {
                    model: User, as: 'favorites',
                    where: { userId: req.user.id },
                    include: [
                        { model: City, as: 'city' },
                    ]
                }
            ]
        });
        res.send(barber);
    });
};
