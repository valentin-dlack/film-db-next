import fetch from "node-fetch";
import { ConfigService } from "../../services/config.service";


/**
 * @swagger
 * /api/movies:
 *   get:
 *     description: Returns a list of movies from The Movie Database
 *     responses:
 *       200:
 *         description: A list of movies
 */
export default async function handler(req, res) {
    let url = ConfigService.themoviedb.urls.discover;

    // get params in url query
    const page = req.query.page;

    page ? url += `?page=${page}` : url += `?page=1`;

    if (ConfigService.themoviedb.apiToken === "") {
        return res.status(500).json({ status: 500, error: "Internal Server Error" });
    }

    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${ConfigService.themoviedb.apiToken}`
        }
    };

    const apiResponse = await fetch(url, options)
        .then(response => response.json())
        .catch(error => {
            return res.status(500).json({ status: 500, error: "Internal Server Error" });
        });

    if (apiResponse) {
        res.status(200).json({ status: 200, data: apiResponse.results });
    }
}