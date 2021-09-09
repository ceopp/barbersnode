module.exports = async function (f, opts) {
    const Country = f.db.Country;

    f.get('/countries', {
        schema: {
            tags: ['geo'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        const countries = await Country.findAll({
            order: [
                ['ordering', 'ASC'],
            ]
        });
        res.send(countries);
    });
};