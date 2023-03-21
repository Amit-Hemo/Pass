const jwt = require("jsonwebtoken");

function verifyAccessToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader?.startsWith("Bearer"))
    return res.status(401).json({ error: "Authorization header not exist" });

  const accessToken = authorizationHeader.split(" ")[1];
  if (!accessToken)
    return res.status(403).json({ error: "Access token not exist" });

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.uuid;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid access token" });
  }
}

module.exports = verifyAccessToken;
