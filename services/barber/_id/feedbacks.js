module.exports = async function (f, opts) {
    const Feedback = f.db.Feedback;
    const User = f.db.User;
    const City = f.db.City;

    f.get('/feedbacks', {
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
        const feedbacks = await Feedback.findAll({
            where: {
                barberId: req.params.id,
            },
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
        res.send(feedbacks);
    });
};
