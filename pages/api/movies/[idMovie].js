import fetch from "node-fetch";
import clientPromise from "/lib/mongodb";
import { ConfigService } from "../../../services/config.service";

export default async function handler(req, res) {

  const idMovie = parseInt(req.query.idMovie, 10);
  const url = ConfigService.themoviedb.urls.movie + '/' + idMovie;
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
      const movie = await fetch(url, options)
      .then(r => r.json())
      .catch(err => console.error('error:' + err));

      const likes = await db.collection("likes").findOne({idTMDB: idMovie});

      if (likes && likes.likeCounter) {
        movie.likes = likes.likeCounter;
      } else {
        movie.likes = 0;
      }

      if (movie) {
        res.json({ status: 200, data: { movie: movie } });
      } else {
        res.status(404).json({ status: 404, error: "Not Found" });
      }
      break;

    default:
      res.status(405).json({ status: 405, error: "Method Not Allowed" });
  }
}