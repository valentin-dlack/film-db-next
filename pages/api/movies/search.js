import fetch from "node-fetch";
import clientPromise from "/lib/mongodb";
import { ConfigService } from "../../../services/config.service";

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

  switch (req.method) {

    case "POST":
        if (req.body.query) {
            const search = await fetch(url + '?query=' + req.body.query, options)
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