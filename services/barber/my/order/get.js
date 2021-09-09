module.exports = async function (f, opts) {
    const Service = f.db.Service;
    const Barber = f.db.Barber;
    const Order = f.db.Order;
    const User = f.db.User;
    const City = f.db.City;
    f.get('/get', {
        schema: {
            tags: ['barber'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isBarber],
    }, async (req, res) => {
        const _orders = await Order.findAll({
            where: { barberId: req.barber.id },
            include: [
                {
                    model: Barber, as: 'barber',
                    include: [
                        { model: Service, as: 'services' },
                    ]
                },
                {
                    model: User, as: 'user',
                    attributes: ['id', 'cityId', 'photo', 'name', 'phone'],
                    include: [
                        { model: City, as: 'city' },
                    ]
                }
            ]
        });

        let orders = [];
        for (let order of _orders) {
            let _order = order.toJSON();
            _order.services = [];
            let _services = [];
            for (let service of _order.barber.services) {
                const s = {
                    id: service.id,
                    title: service.BarberService.title || service.title,
                    price: service.BarberService.price,
                };
                if (order.services.includes(parseInt(s.id)))
                    _order.services.push(s);
                _services.push(s);
            }
            _order.barber.services = _services;
            orders.push(_order);
        }
        res.send(orders);
    });
};