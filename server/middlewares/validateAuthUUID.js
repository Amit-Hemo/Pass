function validateAuthUUID(req, res, next) {
  const uuid = req.params?.uuid || req.body?.uuid;
  const authUUID = req.user;
  if (authUUID !== uuid)
    return res.status(401).json({ error: "401 Unauthorized" });
  next();
}
module.exports = validateAuthUUID;
