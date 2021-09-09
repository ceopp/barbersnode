module.exports = async function (f, opts) {
    const Favorite = f.db.Favorite;

    f.post('/remove', {
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
        Favorite.destroy({
            where: {
                userId: req.user.id,
                barberId: req.body.barberId,
            }
        });
        res.send(true);
    });
};
