import clientPromise from "../../../../lib/mongodb";
import { verifyToken } from "../../../../src/middleware/verifyToken";

/**
 * @swagger
 * /api/movies/{idMovie}/likes:
 *  patch:
 *   description: Increment the like counter of a movie
 *   parameters:
 *    - in: path
 *      name: idMovie
 *      required: true
 *      schema:
 *        type: integer
 *      description: The id of the movie to increment the like counter
 *   responses:
 *    201:
 *      description: The like counter incremented
 *    405:
 *      description: Method Not Allowed
 *  get:
 *    description: Returns the like counter of a movie
 *    parameters:
 *      - in: path
 *        name: idMovie
 *        required: true
 *        schema:
 *          type: integer
 *        description: The id of the movie to get the like counter
 *    responses:
 *      200:
 *        description: The like counter of the movie
 *      405:
 *        description: Method Not Allowed
 * 
 */
export default async function handler(req, res) {

  const idMovie = parseInt(req.query.idMovie, 10);
  const userData = await verifyToken(req, res);
  if (!userData) {
    return res.status(401).json({ status: 401, error: "Unauthorized" });
  }
  const userId = userData.userId

  const client = await clientPromise;
  const db = client.db("ynov-cloud");

  switch (req.method) {

    case "PATCH":

      const like = await db.collection("likes").findOne({idTMDB: idMovie, userId: userId});
      let resMongo, data;

      if (like) {
         resMongo = await db.collection("likes").deleteOne({idTMDB: idMovie, userId: userId});
         data = {
           action: 'likeCounter deleted',
           idMovie: idMovie,
           userId: userId,
           deletedCount: resMongo.deletedCount
         }
         res.status(200).json({ status: 200, data: data });
      } else {
        resMongo = await db.collection("likes").insertOne(
          {idTMDB: idMovie, userId: userId}
        )
        data = {
          action: 'likeCounter created',
          idMovie: idMovie,
          userId: userId,
          insertedId: resMongo.insertedId
        }
        res.status(201).json({ status: 201, data: data });
      }

      break;

    case "GET":

      const likes = await db.collection("likes").findOne({idTMDB: idMovie, userId: userId});
      res.json({ status: 200, data: { likes: likes } });
      break;

    default:
      res.status(405).json({ status: 405, error: "Method Not Allowed" });
  }
}