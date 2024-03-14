import clientPromise from "/lib/mongodb";
import { ConfigService } from "../../../../services/config.service";

/**
 * @swagger
 * /api/movies/discover/recommended:
 *  get:
 *      description: Returns a list of recommended movies based on liked movies by user
 *      responses:
 *          200:
 *              description: A list of recommended movies
 *          405:
 *              description: Method Not Allowed
 * 
 */
export default async function handler(req, res) {

    // 'https://api.themoviedb.org/3/movie'
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + ConfigService.themoviedb.apiToken
      }
    };

  const client = await clientPromise;
  const db = client.db("ynov-cloud");

  switch (req.method) {

    case "GET":
        //get liked movies
        const likes = await db.collection("likes").find().toArray();
        let genre = [];

        // get genre of liked movies
        for (let i = 0; i < likes.length; i++) {
            const movie = await fetch(ConfigService.themoviedb.urls.movie + '/' + likes[i].idTMDB, options)
            .then(r => r.json())
            .catch(err => console.error('error:' + err));
            if (movie.genres) {
                for (let j = 0; j < movie.genres.length; j++) {
                    if (!genre.includes(movie.genres[j].id)) {
                        genre.push(movie.genres[j].id);
                    }
                }
            }
        }

        let recommended = [];

        // get movies by genre
        for (let i = 0; i < genre.length; i++) {
            const movies = await fetch(ConfigService.themoviedb.urls.discover + '?with_genres=' + genre[i], options)
            .then(r => r.json())
            .catch(err => console.error('error:' + err));
            recommended.push(movies.results);
        }

        let final = [];

        // get the 5 best movies
        for (let i = 0; i < recommended.length; i++) {
            for (let j = 0; j < recommended[i].length; j++) {
                final.push(recommended[i][j]);
            }
        }

        // sort by vote_average
        final.sort((a, b) => (a.vote_average < b.vote_average) ? 1 : -1);

        if (final) {
            res.json({ status: 200, data: { recommended: final.slice(0, 5) } });
        } else {
            res.status(404).json({ status: 404, error: "Not Found" });
        }

    default:
      res.status(405).json({ status: 405, error: "Method Not Allowed" });
  }
}