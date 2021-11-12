module.exports = async function (f, opts) {
    const Service = f.db.Service;
    f.post('/create', {
        schema: {
            tags: ['services'],
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth],
    }, async (req, res) => {
        const { title } = req.body;
        const service = await Service.create({
            title,
        });
        res.send(service);
    });
};
