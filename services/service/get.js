module.exports = async function (f, opts) {
    const Service = f.db.Service;
    f.get('/get', {
        schema: {
            tags: ['services'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        let services = await Service.findAll();
        res.send(services);
    });
};
