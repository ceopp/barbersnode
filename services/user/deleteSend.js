module.exports = async function (f, opts) {
    const User = f.db.User;
    f.post('/deleteSend', {
        schema: {
            tags: ['user'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: f.auth,
    }, async (req, res) => {
        const phoneCode = f.utils.genCode();
        req.user.phoneCode = phoneCode;
        await req.user.save();
        f.sms(req.user.phone, `Код удаления профиля barbers_msk: ${phoneCode}`);

        return true;
    });
};
