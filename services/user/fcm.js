module.exports = async function (f, opts) {
    const UserFcm = f.db.UserFcm;
    f.post('/fcm', {
        schema: {
            tags: ['user'],
            body: {
                type: 'object',
                properties: {
                    fcmToken: { type: 'string', description: 'Firebase токен' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        if (!req.body.fcmToken) return res.paymentRequired('Нужен токен для пушей');
        await UserFcm.destroy({ where: { fcmToken: req.body.fcmToken } });
        await UserFcm.create({
            userId: req.user.id,
            fcmToken: req.body.fcmToken
        });
        res.send({ success: true });
    });
};
