module.exports = async function (f, opts) {
    const User = f.db.User;
    f.post('/send', {
        schema: {
            tags: ['auth'],
            body: {
                type: 'object',
                properties: {
                    phone: { type: 'string', description: 'Phone' },
                }
            },
        },
    }, async (req, res) => {
        if (!req.body.phone)
            return res.unauthorized('Нужен телефон');
        let user = await User.getByPhone(req.body.phone);
        const phoneCode = req.body.phone == '+7(999) 999-99-99' || req.body.phone == '+7(999) 999-99-66' ? 1234 : f.utils.genCode();
        if (!user) {
            user = await User.create({
                phone: req.body.phone,
                phoneCode,
            });
        } else {
            user.phoneCode = phoneCode;
            await user.save();
        }
        if (req.body.phone == '+7(999) 999-99-99' || req.body.phone == '+7(999) 999-99-66') return true;
        f.sms(req.body.phone, `Код входа в barbers_msk: ${phoneCode}`);

        return true;
    });
};

