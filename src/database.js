/**
 * Modulo exportable que crea la conexion con la base de datos
 * @module database
 * @author Cristóbal Cortés Páez
 */

/** 
 * Constante que requiere el modulo de Mysql
 * @const mysql
 * @requires mysql
 */
const mysql = require('mysql');

/** 
 * Constante que requiere promisify del modulo util
 * @const promisify
 * @requires util
 */
const {promisify} = require('util');

/** 
 * Constante que requiere las credenciales de la base de datos
 * @const database
 * @requires keys
 */
const {database} = require('./keys');

/**
 * Constante que crea un pool de conexion
 * @const pool
 */
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
