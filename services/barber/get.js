module.exports = async function (f, opts) {
    const Barber = f.db.Barber;
    const Service = f.db.Service;
    const User = f.db.User;
    const City = f.db.City;

    f.post('/filter', {
        schema: {
            tags: ['barber'],
            body: {
                type: 'object',
                properties: {
                    serviceId: { type: 'string' },
                    countryId: { type: 'string' },
                    cityId: { type: 'string' },
                    orderPlace: { type: 'string' },
                    page: { type: 'integer', default: 0 },
                    pageSize: { type: 'integer', default: 100 },
                }
            },

            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        const { serviceId, countryId, cityId, page, pageSize, orderPlace } = req.body;
        let cityAnd = [];
        if (countryId != null) cityAnd.push({ countryId });
        if (cityId != null) cityAnd.push({ cityId });
        let and = [];
        if (orderPlace != null && orderPlace != 'Любое')
            and[f.db.Op.or] = [
                { 'orderPlace': { [f.db.Op.overlap]: [orderPlace, 'Любое'] } },
                { 'orderPlace': { [f.db.Op.eq]: null } }
            ];
        let _barbers = await Barber.findAll({
            // where: { [f.db.Op.and]: { isActive: { [f.db.Op.ne]: false }, ...and } },
            ...f.db.paginate({ page: page || 0, pageSize: pageSize || 100 }),
            include: [
                {
                    model: Service, as: 'services',
                    where: serviceId != null ? { id: serviceId } : null,
                },
                {
                    model: User, as: 'user',
                    attributes: ['id', 'cityId', 'photo', 'name', 'phone'],
                    where: cityAnd != [] ? cityAnd : null,
                    include: [
                        { model: City, as: 'city' },
                    ]
                },

            ],
        });
        let barbers = [];
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
            barbers.push(_barber);
        }
        res.send(barbers);

    });
};
