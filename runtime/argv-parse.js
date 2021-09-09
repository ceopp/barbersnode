const fs = require('fs');
const path = require('path');

module.exports = function (f) {
    const argv = process.argv.slice(2);
    switch (argv[0]) {
        case 'sync':
            syncDatabase(f, argv);
            return true;
        case 'alter':
            alterDatabase(f);
            return true;
        case 'seed':
            seedDatabase(f, argv);
            return true;
    }
    return false;
};

const syncDatabase = async function (f, argv) {
    await f.db.sequelize.sync({ force: argv[1] == 'force' });
    log.i('end');
    process.exit(0);
};

const alterDatabase = async function (f) {
    await f.db.sequelize.sync({ alter: true });
    log.i('end');
    process.exit(0);
};

const seedDatabase = async function (f, argv) {
    const files = fs
        .readdirSync(path.join(__basedir, 'seeders'))
        .filter(file => {
            const allPred = argv[1] == 'all' ? true : argv.slice(1).includes(file.slice(0, -3));
            return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js' && allPred);
        });
    for (let file of files) {
        log.i(path.join(__basedir, 'seeders', file));
        const seeder = require(path.join(__basedir, 'seeders', file));
        try {
            await seeder(f);
        } catch (e) { log.e(e); }
    }
    process.exit(0);
};
