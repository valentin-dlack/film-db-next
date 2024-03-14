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
    const url = ConfigService.themoviedb.urls.discover;

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
            console.error(error);
            return null;
        });

    if (apiResponse) {
        res.status(200).json({ status: 200, data: apiResponse.results });
    }
}