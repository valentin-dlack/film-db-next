import fetch from "node-fetch";
import { ConfigService } from "../../../../services/config.service";

/**
 * @swagger
 * /api/movies/{idMovie}/videos:
 *  get:
 *     description: Returns a list of the videos of a movie from The Movie Database
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         type: integer
 *         description: The id of the movie to get the videos
 *     responses:
 *        200:
 *           description: A list of videos of the movie
 *        404:
 *           description: Not Found
 *        405:
 *           description: Method Not Allowed
 * 
 */
export default async function handler(req, res) {

  const idMovie = parseInt(req.query.idMovie, 10);
  const url = ConfigService.themoviedb.urls.movie + '/' + idMovie + '/videos';
  // 'https://api.themoviedb.org/3/movie/{movie_id}/videos'
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + ConfigService.themoviedb.apiToken
    }
  };

  switch (req.method) {

    case "GET":

        const videos = await fetch(url, options)
        .then(r => r.json())
        .catch(err => console.error('error:' + err));

        if (videos && videos.results) {
            videos.results.forEach(video => {
                video.youtubeLink = 'https://www.youtube.com/watch?v=' + video.key;
            });
        }

        if (videos) {
            res.json({ status: 200, data: { videos: videos.results } });
        } else {
            res.status(404).json({ status: 404, error: "Not Found" });
        }

    default:
      res.status(405).json({ status: 405, error: "Method Not Allowed" });
  }
}