// Middleware to allow only the resource owner or an admin to proceed.
// It expects `req.userId` to be set by the auth middleware. If you have a
// role-based system, set `req.userRole = 'admin'` in your auth middleware or
// populate it on the request to allow admins.
export function ensureOwnerOrAdmin(req, res, next) {
  const userId = req.userId
  const targetId = req.params.id
  if (!userId) return res.status(401).json({ message: 'Unauthorized' })
  if (userId === targetId) return next()
  // optional admin check if you set req.userRole earlier
  if (req.userRole && req.userRole === 'admin') return next()
  return res.status(403).json({ message: 'Forbidden' })
}
