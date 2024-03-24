import { verifyToken } from "../../../src/middleware/verifyToken";
import clientPromise from "/lib/mongodb";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    // Check if the user is authorized
    const userData = await verifyToken(req, res);

    console.log('userId', userData.userId);

    //get user profile
    const client = await clientPromise;
    const db = client.db("ynov-cloud");

    const user = await db.collection('users').findOne({ _id: ObjectId(userData.userId) }, { projection: { password: 0 } });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's profile
    return res.status(200).json(user);
}