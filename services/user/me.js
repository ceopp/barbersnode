module.exports = async function (f, opts) {
    f.get('/me', {
        schema: {
            tags: ['user'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        let user = req.user.toJSON();
        delete user.phoneCode;
        res.send(user);
    });
};
