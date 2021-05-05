const mysql = require('mysql');
const {promisify} = require('util');
const {database} = require('./keys');

const pool = mysql.createPool(database);
pool.getConnection((error, connection) => {
    if(error){
        if(error.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION LOST');
        }else if(error.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTION');
        }else if(error.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }

        if(connection) connection.release();
        console.log('DB MYSQL CONNECTED')
    }
});
pool.query = promisify(pool.query);

module.exports = pool;
