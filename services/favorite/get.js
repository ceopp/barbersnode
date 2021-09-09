module.exports = async function (f, opts) {
    const User = f.db.User;
    const Barber = f.db.Barber;
    const Service = f.db.Service;
    const City = f.db.City;

    f.get('/get', {
        schema: {
            tags: ['favorite'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        const _barbers = await Barber.findAll({
            include: [
                {
                    model: User, as: 'user',
                    attributes: ['id', 'cityId', 'photo', 'name', 'phone'],
                    include: [
                        { model: City, as: 'city' },
                    ]
                },
                { model: Service, as: 'services' },
                {
                    model: User, as: 'favorites',
                    attributes: ['id', 'cityId', 'photo', 'name', 'phone'],
                    require: true,
                    where: {
                        id: req.user.id,
                    },
                    include: [
                        { model: City, as: 'city' },
                    ]
                }
            ]
        });

        let favorites = [];
        for (let barber of _barbers) {
            let _barber = barber.toJSON();
            let _services = [];
            for (let service of barber.services) {
                _services.push({
                    id: service.id,
                    title: service.BarberService.title || service.title,
                    price: service.BarberService.price,
                });
            }
            _barber.services = _services;
            favorites.push(_barber);
        }
        res.send(favorites);
    });
};
