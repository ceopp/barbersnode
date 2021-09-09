module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(128),
    alpha2: DataTypes.STRING(2),
    alpha3: DataTypes.STRING(3),
    iso: {
      type: DataTypes.INTEGER,
      default: 0
    },
    ordering: {
      type: DataTypes.INTEGER,
      default: 100
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      default: true
    },

  }, {
  });
  Country.associate = function (models) {
  };

  Country.fSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    }
  };
  return Country;
};