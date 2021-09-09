const fs = require('fs');
const path = require('path');

module.exports = async function (f) {
    let sql = fs.readFileSync(path.join(__basedir, 'seeders', 'countries.sql'));
    await f.db.sequelize.query('BEGIN;' + sql + 'COMMIT;');

    sql = fs.readFileSync(path.join(__basedir, 'seeders', 'cities.sql'));
    await f.db.sequelize.query('BEGIN;' + sql + 'COMMIT;');
};