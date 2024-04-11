import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import clientPromise from "/lib/mongodb";

export default async function handler(req, res) {
    //logout
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    if (req.headers.Authorization) {
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("ynov-cloud");

        try {
            const token = req.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await db.collection('tokens').deleteOne({ token, userId: decoded.userId });

            //redirect to sign in
            return res.redirect('/ui/sign-in');
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}