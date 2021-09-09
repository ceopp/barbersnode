module.exports = async function (f, opts) {
    const City = f.db.City;

    f.get('/cities/:countryId', {
        schema: {
            tags: ['geo'],
            params: {
                type: 'object',
                properties: {
                    countryId: { type: 'string' },
                }
            },
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        let { countryId } = req.params;

        const cities = await City.findAll({
            where: { countryId },
            order: [
                ['ordering', 'ASC'],
            ]
        });
        res.send(cities);
    });
};