module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    status: DataTypes.STRING,
    amount: DataTypes.REAL,
    date: DataTypes.DATE,
    services: DataTypes.ARRAY(DataTypes.INTEGER),
  }, {
  });

  Order.associate = function (models) {
    Order.belongsTo(models.User, { as: 'user' });
    Order.belongsTo(models.Barber, { as: 'barber' });
  };

  Order.fSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    }
  };
  return Order;
};