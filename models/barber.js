module.exports = (sequelize, DataTypes) => {
  const Barber = sequelize.define('Barber', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    portfolio: DataTypes.ARRAY(DataTypes.STRING),
    orderPlace: DataTypes.ARRAY(DataTypes.STRING),
    rating: DataTypes.REAL,
    isActive: DataTypes.BOOLEAN,
    about: DataTypes.TEXT,
    phoneCode: DataTypes.STRING,
    /*latitude: DataTypes.TEXT,
    longitude: DataTypes.TEXT,
    address: DataTypes.TEXT*/
  }, {
  });

  Barber.associate = function (models) {
    Barber.belongsTo(models.User, { as: 'user' });
    Barber.belongsToMany(models.Service, { as: 'services', through: models.BarberService, foreignKey: 'barberId' });
    Barber.belongsToMany(models.User, { as: 'favorites', through: models.Favorite, foreignKey: 'barberId' });
    Barber.hasMany(models.Call, { as: 'calls', foreignKey: 'barberId' });
    Barber.hasMany(models.Order, { as: 'orders', foreignKey: 'barberId' });
    Barber.hasMany(models.Feedback, { as: 'feedbacks', foreignKey: 'barberId' });
  };

  Barber.fSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    }
  };
  return Barber;
};