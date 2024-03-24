import { ConfigService } from "../../../services/config.service";
import clientPromise from "/lib/mongodb";
import * as argon2 from "argon2";

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *   tags:
 *    - auth
 *   description: Register a new user to the application
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
 *        - in: body
 *          name: firstName
 *          required: true
 *          schema:
 *            type: string
 *          description: The first name of the user
 *        - in: body
 *          name: lastName
 *          required: true
 *          schema:
 *            type: string
 *          description: The last name of the user
 *   responses:
 *     200:
 *       description: The user is signed in
 *     400:
 *        description: User already exists
 *     405:
 *       description: Method Not Allowed
 * 
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    // Handle registration
    const { email, password, firstName, lastName } = req.body;

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("ynov-cloud");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = {
      email,
      password: await argon2.hash(password),
      firstName,
      lastName,
    };

    // Insert new user into the database
    await db.collection("users").insertOne(newUser);

    return res.status(200).json({ message: "User registered successfully" });
  } else if (req.method === "GET") {
    // Handle user retrieval
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("ynov-cloud");

    // Retrieve all users and remove password field
    const users = await db.collection("users").find().project({ password: 0 }).toArray();

    return res.status(200).json(users);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
    

}