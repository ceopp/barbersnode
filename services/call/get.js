module.exports = async function (f, opts) {
    const Call = f.db.Call;
    const Barber = f.db.Barber;
    const User = f.db.User;
    const Service = f.db.Service;
    const City = f.db.City;

    f.get('/get', {
        schema: {
            tags: ['call'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        const _calls = Call.findAll({
            where: {
                userId: req.user.id,
            },
            order: [
                ['createdAt', 'DESC'],
            ],
            include: [
                {
                    model: Barber, as: 'barber',
                    include: [
                        {
                            model: User, as: 'user',
                            attributes: ['id', 'cityId', 'photo', 'name', 'phone'],
                            include: [
                                { model: City, as: 'city' },
                            ]
                        },
                        { model: Service, as: 'services' },
                    ]
                }
            ],
        });
        
        let calls = [];
        for (let barber of _calls) {
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
            calls.push(_barber);
        }
        res.send(calls);
    });
};
