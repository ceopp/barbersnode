module.exports = async function (f, opts) {
    const Static = f.db.Static;
    f.get('/get', {
        schema: {
            tags: ['services'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        let statics = await Static.findAll();
        const st = {};
        for (const s of statics) {
            st[s.key] = s.value;
        }
        res.send(st);
    });
};
