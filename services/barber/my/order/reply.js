module.exports = async function (f, opts) {
    const Order = f.db.Order;
    f.post('/reply', {
        schema: {
            tags: ['barber'],
            body: {
                type: 'object',
                properties: {
                    orderId: { type: 'string' },
                    status: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isBarber],
    }, async (req, res) => {
        let { orderId, status } = req.body;
        const order = await Order.findByPk(orderId);
        if (order.barberId != req.barber.id) return res.methodNotAllowed('This Order is not for this Barber');
        order.assign({
            status,
        });
        await order.save();
        res.send(true);
        //TODO: send notifications to Barber or place
    });
};