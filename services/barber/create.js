module.exports = async function (f, opts) {
    const Barber = f.db.Barber;
    f.post('/create', {
        schema: {
            tags: ['barber'],
            body: {
                type: 'object',
                properties: {
                    about: { type: 'string' },
                    orderPlace: { type: 'array', items: { type: 'string' } },
                    portfolio: { type: 'array', items: { type: 'string' } },
		    latitude: {type: 'string'},
		    longitude: {type: 'string'},
		    address: {type: 'string'}
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        try {
            let barber = await Barber.findOne({
                where: {
                    userId: req.user.id
                }
            });
            if (barber) return res.methodNotAllowed('You already have registered Barber');
            let { portfolio, about, orderPlace, latitude, longitude, address } = req.body;
            barber = await Barber.create({
                userId: req.user.id,
                portfolio,
                about,
                orderPlace,
		latitude,
		longitude,
		address
            });
            res.send(barber);
        } catch (e) {
            log.e(e);
        }
        res.internalServerError();
    });
};