module.exports = async function (f, opts) {
    const Service = f.db.Service;
    f.post('/edit', {
        schema: {
            tags: ['services'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                }
            },
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isAdmin],
    }, async (req, res) => {
        let { title, isActive } = req.body;

        let service = await Service.findByPk(req.params.id);
        service.assign({
            title,
            isActive,
        });
        await service.save();
        res.send(service);
    });
};
