const fp = require('fastify-plugin');
const fbAdmin = require('firebase-admin');

module.exports = fp(function (fastify, _opts, next) {
  var serviceAccount = require(`${__basedir}/firebase.json`);
  fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccount),
    databaseURL: "https://barbers-53d47.firebaseio.com"
  });

  const fcmSendToken = async function (tokens, title, body, data = {}) {
    for (const token of tokens) {
      var message = {
        data: {
          ...data,
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
        notification: { title, body },
        token
      };
      try {
        await fbAdmin.messaging().send(message);
      } catch (e) { }
    }
  }

  const fcmSendUser = async function (userId, title, body, data = {}) {
    const tokens = await fastify.db.UserFcm.findAll({ where: { userId } });
    return fcmSendToken(tokens.map(_ => _.fcmToken), title, body, data);
  }

  fastify.decorate('firebase', fbAdmin);
  fastify.decorate('fcmSendToken', fcmSendToken);
  fastify.decorate('fcmSendUser', fcmSendUser);

  next();
});

// Уведомления.
// 1. К вам записались
// 2. Вам звонили
// 3. Ваша модерация прошла успешно
// 4. Ваша запись отменена
// 5. Вам оставлен отзыв
// 6. Вам пришло сообщение от поддержки