module.exports = (sequelize, DataTypes) => {
  const BarberService = sequelize.define('BarberService', {
    price: DataTypes.REAL,
    title: DataTypes.STRING,
  }, {
  });

  BarberService.fSchema = {
    type: 'object',
    properties: {
      price: { type: 'string' },
      title: { type: 'string' },
    }
  };
  return BarberService;
};