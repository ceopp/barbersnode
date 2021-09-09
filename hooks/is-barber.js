const fp = require('fastify-plugin');
module.exports = fp(async function (f, opts) {
    const Barber = f.db.Barber;
    const Service = f.db.Service;
    f.decorate('isBarber', async (req, res) => {
        const barber = await Barber.findOne({
            where: {
                userId: req.user.id
            },
            include: [
                { model: Service, as: 'services', }
            ]
        });
        if (!barber) return res.forbidden('You must have active Barber to use this method.');
        req.barber = barber;
    });
});