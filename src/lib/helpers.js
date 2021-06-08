/**
 * Modulo exportable que encripta las contraseñas de los usuarios con la libreria Bcryptjs
 * @module bcryptjs
 * @author Cristóbal Cortés Páez
*/

/** 
 * Constante que requiere el modulo BcryptJS para encriptacion de contraseñas
 * @const format
 * @requires timeago.js 
 */
const bcrypt = require('bcryptjs');

/**
 * @const helpers Objeto vacio 
 * @type {object}
 */
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (e) {
        console.log(e)
    }
};


module.exports = helpers;