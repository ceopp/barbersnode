module.exports = async function (f, opts) {
    const Feedback = f.db.Feedback;
    const Barber = f.db.Barber;

    f.post('/send', {
        schema: {
            tags: ['feedback'],
            body: {
                type: 'object',
                properties: {
                    theme: { type: 'string' },
                    text: { type: 'string' },
                    rating: { type: 'string' },
                    barberId: { type: 'string' },
                },
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        let { theme, text, rating, barberId } = req.body;
        if (!rating) rating = null;
        if (!barberId) barberId = null;
        await Feedback.create({
            theme,
            text: text.trim(),
            rating,
            barberId,
            userId: req.user.id,
        });
        res.send(true);
        if (barberId != null) {
            const { avg } = await Feedback.findOne({
                attributes: [[f.db.Sequelize.fn('avg', f.db.Sequelize.col('rating')), 'avg']],
                raw: true,
            });
            const barber = await Barber.findByPk(barberId);
            barber.rating = avg;
            barber.save();
            f.fcmSendUser(barber.userId,
                'Вам оставлен отзыв',
                'Откройте приложение, чтобы проверить отзывы',
                {
                    event: 'new_feedback'
                });
        }
    });
};
