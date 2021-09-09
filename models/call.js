module.exports = (sequelize, DataTypes) => {
  const Call = sequelize.define('Call', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    byUser: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
  }, {
  });
  Call.associate = function (models) {
    Call.belongsTo(models.User, { as: 'user' });
    Call.belongsTo(models.Barber, { as: 'barber' });
  };

  Call.fSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    }
  };
  return Call;
};