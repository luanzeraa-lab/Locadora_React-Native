const jwt = require('jsonwebtoken');

const JWT_SECRET = 'technologic-demo-secret';

function createToken(user) {
  return jwt.sign({ id: user._id.toString(), name: user.name, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Autenticação necessária.' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
  }
}

function authOptional(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  return next();
}

module.exports = { createToken, authRequired, authOptional };
