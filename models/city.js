module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(128),
    regionId: DataTypes.INTEGER,
    ordering: {
      type: DataTypes.INTEGER,
      default: 10000
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      default: true
    },
  }, {
  });
  City.associate = function (models) {
    City.belongsTo(models.Country, { as: 'country' });
  };

  City.fSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    }
  };
  return City;
};