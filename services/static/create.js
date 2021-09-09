module.exports = async function (f, opts) {
    const Static = f.db.Static;
    f.post('/create', {
        schema: {
            tags: ['services'],
            body: {
                type: 'object',
                properties: {
                    key: { type: 'string' },
                    value: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isAdmin],
    }, async (req, res) => {
        const { key, value } = req.body;
        const newStatic = await Static.create({ key, value });
        res.send(newStatic);
    });
};
