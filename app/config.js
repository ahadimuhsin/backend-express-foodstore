const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// console.log(process.env.DB_PASS);
module.exports = {
    rootPath: path.resolve(__dirname, '..'), //path lengkap projek root aplikasi di dalam file system
    secretKey: process.env.SECRET_KEY,
    serviceName: process.env.SERVICE_NAME,
    //ekspor pengaturan db
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPort: process.env.DB_PORT,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME
}