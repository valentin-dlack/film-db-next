import jwt from 'jsonwebtoken';

async function auth(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Not authenticated' });
    return null;
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401).json({ message: 'Not authenticated' });
    return null;
  }

  return decoded;
}

module.exports = auth;