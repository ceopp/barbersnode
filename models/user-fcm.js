module.exports = (sequelize, DataTypes) => {
  const UserFcm = sequelize.define('UserFcm', {
    fcmToken: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
  });
  UserFcm.associate = function (models) {
    UserFcm.belongsTo(models.User, { as: 'user' });
  };

  UserFcm.fSchema = {
    type: 'object',
    properties: {
      userId: { type: 'string', description: 'ID юзера' },
      fcmToken: { type: 'string', description: 'FCM токен' },
    }
  };
  return UserFcm;
};