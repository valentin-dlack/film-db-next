import clientPromise from "../../../lib/mongodb";
import { verifyToken } from "../../../src/middleware/verifyToken";

/**
 * @swagger
 * /api/movies/likes:
 *  get:
 *    description: Returns the movies liked by the user
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        required: true
 *        schema:
 *          type: string
 *        description: The token of the user
 *    responses:
 *      200:
 *        description: The movies liked by the user
 *      405:
 *        description: Method Not Allowed
 * 
 */
export default async function handler(req, res) {

    const userData = await verifyToken(req, res);
    if (!userData) {
        return res.status(401).json({ status: 401, error: "Unauthorized" });
    }
    const userId = userData.userId

    const client = await clientPromise;
    const db = client.db("ynov-cloud");

    try {
        switch (req.method) {
            case "GET":
    
                const likes = await db.collection("likes").find({userId: userId}).toArray();
    
                if (likes) {
                    res.json({ status: 200, data: { likes: likes } });
                } else {
                    res.status(404).json({ status: 404, error: "Not Found" });
                }
                break;
    
            default:
                res.status(405).json({ status: 405, error: "Method Not Allowed" });
        }
    } catch (error) {
        throw error;
    }
}
