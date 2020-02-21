module.exports = function (req, res, next) {
  // 401 Unauthorized (no valid json token, the user can try)
  // 403 Forbidden (if they send a valid json token and they have no access)
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");

  next();
}