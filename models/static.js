module.exports = (sequelize, DataTypes) => {
  const Static = sequelize.define('Static', {
    key: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    value: DataTypes.STRING,
  }, {
  });
  Static.associate = function (models) {
  };

  Static.fSchema = {
    type: 'object',
    properties: {
      key: { type: 'string' },
      value: { type: 'string' },
    }
  };
  return Static;
};