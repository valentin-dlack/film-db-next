import { verifyToken } from "../../../src/middleware/verifyToken";
import clientPromise from "/lib/mongodb";

export default async function handler(req, res) {
    // Check if the user is authorized
    const token = await verifyToken(req, res);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("ynov-cloud");

    // Retrieve the user from the database
    const user = await db.collection("users").findOne({ _id: req.userId });

}