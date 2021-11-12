module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    isAdmin: DataTypes.BOOLEAN,
    birthday: DataTypes.DATE,
    photo: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    phoneCode: DataTypes.STRING,
    frequency: DataTypes.STRING,
    cityName: {
      type: DataTypes.STRING,
      defaultValue: 'Москва'
    }
  }, {
  });
  User.associate = function (models) {
    User.hasMany(models.UserFcm, { as: 'fcmTokens', foreignKey: 'userId' });
    User.hasMany(models.Order, { as: 'orders', foreignKey: 'userId' });
    User.hasMany(models.Call, { as: 'calls', foreignKey: 'userId' });
    User.hasOne(models.Barber, { as: 'barber', foreignKey: 'userId' });
    User.belongsTo(models.Country, { as: 'country' });
    User.belongsTo(models.City, { as: 'city' });
    User.belongsToMany(models.Barber, { as: 'favorites', through: models.Favorite, foreignKey: 'userId' });
  };

  User.getByPhone = function (phone) {
    return this.findOne({ where: { phone: phone } });
  };
  User.verifyJwt = async function (f, token, get = false) {
    try {
      const data = f.jwt.verify(token, f.config.jwtSecret);
      if (!get) return data;
      const user = await this.findByPk(data.userId);
      if (user.name == 'Профиль удален') return null;
      return user;
    } catch (e) {
      return null;
    }
  };

  User.prototype.generateJwt = function (f) {
    return f.jwt.sign({ userId: this.id }, f.config.jwtSecret);
  };

  User.fSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      isAdmin: { type: 'boolean', description: 'Является админом' },
      phone: { type: 'string', description: 'Phone' },
      name: { type: 'string', description: 'Имя' },
      cityName: { type: 'string', description: 'Город' },
    }
  };
  return User;
};
