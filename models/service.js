module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    title: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
  }, {
  });
  Service.associate = function (models) {
    Service.belongsToMany(models.Barber, { as: 'barbers', through: models.BarberService, foreignKey: 'serviceId' });
  };

  Service.fSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    }
  };
  return Service;
};