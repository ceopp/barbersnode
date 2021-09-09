
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const db = { models: {} };

module.exports = function (f) {
  let sequelize = new Sequelize(f.config.db.database, f.config.db.username, f.config.db.password, f.config.db);
  Sequelize.Model.prototype.assign = function (data) {
    for (let key in data)
      if (data[key] != null)
        this[key] = data[key];
  };
  Sequelize.Model.prototype.assignNullable = function (data) {
    for (let key in data)
      this[key] = data[key];
  };
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      const model = (require(path.join(__dirname, file)))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
      db.models[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  db.Op = Sequelize.Op;
  db.paginate = ({ page, pageSize }) => ({
    offset: page * pageSize,
    limit: (page + 1) * pageSize,
  });
  return db;
};
