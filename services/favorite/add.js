module.exports = async function (f, opts) {
    const Favorite = f.db.Favorite;

    f.post('/add', {
        schema: {
            tags: ['favorite'],
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
        try {
            await Favorite.create({
                userId: req.user.id,
                barberId: req.body.barberId,
            });
            res.send(true);
        } catch (e) {
            res.methodNotAllowed('Барбер уже в избранном');
        }
    });
};
