import { verifyToken } from "../../../src/middleware/verifyToken";

export default async function handler(req, res) {
    // Check if the user is authorized
    await verifyToken(req, res);

    // Return the user's profile
    return res.status(200).json({ message: "User profile" });
}