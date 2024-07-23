const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        dialectModule: require('mysql2'),
        logging: false
    });

sequelize.authenticate().then(() => {
    console.info('CONNECTION SUCCESSFULL!!!');
}).catch((error) => {
    console.error('CONNECTION FAIL:::', error);
});

module.exports = sequelize;
