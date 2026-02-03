export function requireRoot(req, res, next) {
  if (req.user.role !== 'root') {
    return res.status(403).json({ error: 'Root access required' });
  }
  next();
}
