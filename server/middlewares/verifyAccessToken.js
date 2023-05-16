const jwt = require('jsonwebtoken');

function verifyAccessToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader?.startsWith('Bearer'))
    return res.status(401).json({ error: 'Authorization header not exist' });

  const accessToken = authorizationHeader.split(' ')[1];
  if (!accessToken)
    return res.status(403).json({ error: 'Access token not exist' });

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.uuid;
    next();
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      return res.status(403).json({ error: 'Invalid token' });
    } else {
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = verifyAccessToken;
