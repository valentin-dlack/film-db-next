import clientPromise from "../../../lib/mongodb";
import { ConfigService } from "../../../services/config.service";
import { verifyToken } from "../../../src/middleware/verifyToken";

export default async function handler(req, res) {

    const url = ConfigService.themoviedb.urls.movie + '/';
    // 'https://api.themoviedb.org/3/movie'
    const options = {
        method: 'GET',
        headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + ConfigService.themoviedb.apiToken
        }
    };

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
                    let movies = [];
                    for (let i = 0; i < likes.length; i++) {
                        const movie = await fetch(url + likes[i].idTMDB, options)
                        .then(r => r.json())
                        .catch(err => console.error('error:' + err));
                        movies.push(movie);
                    }
                    res.json({ status: 200, data: { movies: movies } });

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
