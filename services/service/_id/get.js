module.exports = async function (f, opts) {
    const Service = f.db.Service;
    f.get('/get', {
        schema: {
            tags: ['services'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        let service = await Service.findByPk(req.params.id);
        res.send(service);
    });
};
