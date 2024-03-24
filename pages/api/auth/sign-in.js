import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import clientPromise from "/lib/mongodb";

/**
 * @swagger
 * /api/auth/sign-in:
 *  post:
 *   tags:
 *    - auth
 *   description: Sign in to the application
 *   parameters:
 *        - in: body
 *          name: email
 *          required: true
 *          schema:
 *            type: string
 *          description: The email of the user
 *        - in: body
 *          name: password
 *          required: true
 *          schema:
 *            type: string
 *          description: The password of the user
 *   responses:
 *     200:
 *       description: The user is signed in
 *     401:
 *        description: Unauthorized or invalid credentials
 *     405:
 *       description: Method Not Allowed
 * 
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("ynov-cloud");

    // Find the user by email
    const user = await db.collection('users').findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify the password using argon2
    const passwordMatch = await argon2.verify(user.password, password);

    // Check if the password matches
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    await db.collection('tokens').insertOne({ token, userId: user._id });

    // Return the token
    return res.status(200).json({ userData: { email: user.email, id: user._id }, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
