module.exports = async function (f, opts) {
    const Order = f.db.Order;
    f.post('/cancel', {
        schema: {
            tags: ['order'],
            body: {
                type: 'object',
                properties: {
                    orderId: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        try {
            let { orderId } = req.body;
            if (!orderId) return res.badRequest('Обязательен ID заказа');

            const order = await Order.findByPk(orderId);
            if (!order) return res.badRequest('Заказ не найден');
            order.status = 'cancelled';
            await order.save();
            res.send(true);
            f.fcmSendUser(order.userId,
                'Ваша запись отменена',
                'Откройте приложение, чтобы проверить заказы',
                {
                    event: 'order_declined'
                });
        } catch (e) {
            log.e(e);
            res.send(false);
        }
    });
};
