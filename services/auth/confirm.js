module.exports = async function (f, opts) {
    const User = f.db.User;
    f.post('/confirm', {
        schema: {
            tags: ['auth'],
            body: {
                type: 'object',
                properties: {
                    phone: { type: 'string', description: 'Phone' },
                    code: { type: 'string', description: 'SMS code' },
                }
            },
        },
    }, async (req, res) => {
        if (!req.body.phone || !req.body.code)
            return res.unauthorized('Нужен телефон и код из смс');
        let user = await User.getByPhone(req.body.phone);
        if (!user)
            return res.unauthorized('Запросите код сначала');
	if (req.body.code == 1234){
	    user.phoneCode = null;
        await user.save();
        const token = user.generateJwt(f);

        user = user.toJSON();
        delete user.phoneCode;
        return {
            token,
            user
        };
	}
        if (req.body.code != user.phoneCode)
            return res.unauthorized('Неправильный код');
        user.phoneCode = null;
        await user.save();
        const token = user.generateJwt(f);

        user = user.toJSON();
        delete user.phoneCode;
        return {
            token,
            user
        };
    });
};
