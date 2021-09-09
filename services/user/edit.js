module.exports = async function (f, opts) {
    f.post('/edit', {
        schema: {
            tags: ['user'],
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    birthday: { type: 'string' },
                    photo: { type: 'string' },
                    frequency: { type: 'string' },
                    countryId: { type: 'string' },
                    cityId: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        let {
            name,
            birthday,
            photo,
            frequency,
            countryId,
            cityId, } = req.body;

        req.user.assign({
            name,
            birthday,
            photo,
            frequency,
            countryId,
            cityId
        });
        await req.user.save();
        res.send(req.user);
    });
};
