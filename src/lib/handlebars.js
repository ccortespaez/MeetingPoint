/**
 * Modulo exportable que formatea fechas 
 * @module handlebars
 * @author Cristóbal Cortés Páez
*/

/** 
 * Constante que requiere el modulo TimeagoJS
 * @requires timeago.js 
 */
const { format } = require('timeago.js');

/**
 * @const helpers Objeto vacio 
 * @type {object}
 */
const helpers = {};
/**
 * Funcion que formatea la fecha con timeago
 * @function
 * @param timeago
 * @returns retorna el formato timestamp
 */
helpers.timeago = (timeago) => {
    return format(timestamp);
}

module.exports = helpers;