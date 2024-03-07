import fetch from "node-fetch";
import { ConfigService } from "../../../../services/config.service";

export default async function handler(req, res) {

  const idMovie = parseInt(req.query.idMovie, 10);
  const url = ConfigService.themoviedb.urls.top_rated + "?language=fr-FR&page=1";
  // 'https://api.themoviedb.org/3/movie/top_rated'
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + ConfigService.themoviedb.apiToken
    }
  };

  switch (req.method) {

    case "GET":

        const topRated = await fetch(url, options)
        .then(r => r.json())
        .catch(err => console.error('error:' + err));

        if (topRated) {
            res.json({ status: 200, data: { topRated: topRated.results } });
        } else {
            res.status(404).json({ status: 404, error: "Not Found" });
        }

    default:
      res.status(405).json({ status: 405, error: "Method Not Allowed" });
  }
}