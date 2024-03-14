import jwt from 'jsonwebtoken';
import clientPromise from "/lib/mongodb";
import { ObjectId } from 'mongodb';

export async function verifyToken(req, res) {
    const token = req.headers.authorization;
  
    try {
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("ynov-cloud");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if the token is in the database
      const tokenExists = await db.collection('tokens').findOne({ token, userId: ObjectId(decoded.userId) });
      if (!tokenExists) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      // Regenerate the token if it's expired
      if (jwt.decode(token).exp < Date.now() / 1000) {
        const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
        await db.collection('tokens').updateOne({ userId: decoded.userId, token }, { $set: { token: newToken } });
        req.headers.authorization = newToken;
      }
  
      return Response;
    } catch (error) {
        switch (error.message) {
            case 'jwt must be provided':
                return res.status(401).json({ message: 'Token must be provided' });
            case 'invalid signature':
                return res.status(401).json({ message: 'Invalid token' });
            case 'jwt expired':
                return res.status(401).json({ message: 'Token expired' });
            default:
                return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}