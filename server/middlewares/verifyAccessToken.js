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
    if (error.name === 'TokenExpiredError') {
      return res.status(403).send({ error: 'Token is expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(403).send({ error: 'Invalid Token' });
    } else {
      return res.status(500).send({ error: 'Server error' });
    }
  }
}

module.exports = verifyAccessToken;
