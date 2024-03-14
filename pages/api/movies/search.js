import fetch from "node-fetch";
import clientPromise from "/lib/mongodb";
import { ConfigService } from "../../../services/config.service";

/**
* @swagger
* /api/movies/search:
*   get:
*     description: Endpoint which return the filtered part of movies to display
*     parameters:
*       - in: query
*         name: sortByTitle
*         required: false
*         type: string
*         description: Type of sorting to use on movies list
*       - in: query
*         name: page
*         required: true
*         type: integer
*         description: Number of current page to display on movies list
*     responses:
*       200:
*         description: A list of movies filtered by the query
*       400:
*         description: Bad Request
*       405:
*         description: Method Not Allowed
*/
export default async function handler(req, res) {

  const url = ConfigService.themoviedb.urls.search;
  // 'https://api.themoviedb.org/3/movie/search'
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + ConfigService.themoviedb.apiToken
    }
  };

  const client = await clientPromise;
  const db = client.db("ynov-cloud");

  const titleQuery = req.query.sortByTitle;
  const page = req.query.page;

  switch (req.method) {

    case "GET":
        if (titleQuery && page) {
            const search = await fetch(url + '?query=' + titleQuery + '&page=' + page, options)
            .then(r => r.json())
            .catch(err => console.error('error:' + err));
            if (search) {
                res.json({ status: 200, data: { search: search.results } });
            } else {
                res.status(404).json({ status: 404, error: "Not Found" });
            }
        } else {
            res.status(400).json({ status: 400, error: "Bad Request" });
        }
      break;

    default:
      res.status(405).json({ status: 405, error: "Method Not Allowed" });
  }
}