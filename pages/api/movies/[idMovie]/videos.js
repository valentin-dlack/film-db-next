import fetch from "node-fetch";
import { ConfigService } from "../../../../services/config.service";

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