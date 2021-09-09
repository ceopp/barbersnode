const fp = require('fastify-plugin');
const axios = require('axios');

module.exports = fp(function (f, opts, next) {
    f.decorate('sms', async (phone, message) => {
        phone = phone.replace('+', '');
        try {
            const resp = await axios.get('https://sms.ru/sms/send', {
                params: {
                    to: phone,
                    msg: message,
                    ...f.config.sms,
                }
            });
            log.i(resp.body);
            log.i(resp.data);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error);
        }
    });
    next();
});