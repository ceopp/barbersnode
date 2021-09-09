module.exports = async function (f, opts) {
    const User = f.db.User;
    f.post('/deleteSend', {
        schema: {
            tags: ['barber'],
            security: [{ 'Authorization': [] }]
        },
        onRequest: [f.auth, f.isBarber],
    }, async (req, res) => {
        const phoneCode = f.utils.genCode();
        req.barber.phoneCode = phoneCode;
        await req.barber.save();
        f.sms(req.user.phone, `Код удаления профиля барбера: ${phoneCode}`);
        return true;
    });
};
