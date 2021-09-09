module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    rating: DataTypes.REAL,
    theme: DataTypes.STRING,
    text: DataTypes.TEXT,
  }, {
  });
  Feedback.associate = function (models) {
    Feedback.belongsTo(models.Barber, { as: 'barber' });
    Feedback.belongsTo(models.User, { as: 'user' });
  };

  Feedback.fSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
    }
  };
  return Feedback;
};
