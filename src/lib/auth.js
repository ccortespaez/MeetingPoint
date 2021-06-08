/**
 * Modulo exportable que verifica la autenticacion de un usuario
 * @module auth
 * @author Cristóbal Cortés Páez
 * @param {any} req Argumento de solicitud HTTP a la función de middleware
 * @param {any} res Argumento de respuesta HTTP a la función de middleware
 * @param {any} next Argumento utilizado al pasar devoluciones de llamada en situaciones que requieren la ejecución en serie de acciones
 * @return {any} retonar la vista de inicio de sesion si el usuario
 * @return {any} retonar la vista de inicio 
 */
module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('login');
    },
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    }

}