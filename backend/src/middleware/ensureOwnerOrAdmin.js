/**
 * Middleware que permite solo al dueño del recurso o a un admin continuar.
 * Espera que `req.userId` y opcionalmente `req.userRole` sean establecidos por el middleware de autenticación.
 */
export function ensureOwnerOrAdmin(req, res, next) {
  const userId = req.userId;
  const targetId = req.params.id;
  if (!userId) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  // Si el usuario es dueño del recurso
  if (userId === targetId) {
    return next();
  }
  // Si el usuario es admin
  if (req.userRole && req.userRole.toLowerCase() === 'admin') {
    return next();
  }
  // Si no cumple ninguna condición
  return res.status(403).json({ message: 'No tienes permisos para esta acción' });
}

