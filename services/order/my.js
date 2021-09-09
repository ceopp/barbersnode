module.exports = async function (f, opts) {
    const Order = f.db.Order;
    const User = f.db.User;
    const Barber = f.db.Barber;
    const Service = f.db.Service;
    const City = f.db.City;

    f.get('/my', {
        schema: {
            tags: ['order'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        let _orders = await Order.findAll({
            where: {
                userId: req.user.id,
            },
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
                },
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
