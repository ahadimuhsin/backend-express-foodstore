const mongoose = require('mongoose');

// Impor konfigurasi dari app\config.js
const {dbHost, dbName, dbPort, dbUser, dbPass} = require('../app/config');

// console.log(dbUser);
// console.log(dbName);
// console.log(dbPass);
// console.log(dbPort);
// console.log(dbHost);
//hubungkan ke MongoDB menggunakan konfig yang sudah diimport
mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=${dbUser}`,
{useNewUrlParser: true, useUnifiedTopology: true});

//simpan koneksi dalam constant db

const db = mongoose.connection;

// db.on('error', console.log('Error nih!!!'));
// db.on('open', console.log('Succes!!'));
// console.log(db);
// console.log(mongoose.connection.readyState);


//export db
module.exports = db;