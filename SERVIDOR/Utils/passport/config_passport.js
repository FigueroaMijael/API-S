import passport from 'passport';

/**
 * Middleware que invoca una estrategia de passport.
 * @param {string} strategy - Nombre de la estrategia a ejecutar (e.g., 'jwt', 'local', 'google').
 */
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error);
            if (!user) {
                req.user = null;
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

/**
 * Middleware para proteger rutas por roles.
 * @param {Array} roles - Lista de roles permitidos (e.g., ['admin', 'user']).
 */
export const authorization = (roles) => {
    return async (req, res, next) => {
        if (req.user && roles.includes(req.user.role)){
            next();
        } else {
            res.status(403).render('403'); // Página 403 personalizada
        }
    }
};
