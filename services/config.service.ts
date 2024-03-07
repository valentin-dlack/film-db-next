export const ConfigService = {
    themoviedb: {
        urls: {
            discover: 'https://api.themoviedb.org/3/discover/movie',
            movie: 'https://api.themoviedb.org/3/movie',
            top_rated: 'https://api.themoviedb.org/3/movie/top_rated',
            search: 'https://api.themoviedb.org/3/search/movie',
        },
        apiToken: process.env.THEMOVIEDB_API_TOKEN,
        apiKey: process.env.THEMOVIEDB_API_KEY
    }
};