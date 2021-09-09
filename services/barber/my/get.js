module.exports = async function (f, opts) {
    f.get('/get', {
        schema: {
            tags: ['barber'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isBarber],
    }, async (req, res) => {
        let _barber = req.barber.toJSON();
        let _services = [];
        for (let service of _barber.services) {
            _services.push({
                id: service.id,
                title: service.BarberService.title || service.title,
                price: service.BarberService.price,
            });
        }
        _barber.services = _services;
        res.send(_barber);
    });
};
