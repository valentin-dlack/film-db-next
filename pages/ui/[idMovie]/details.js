import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../../src/contexts/auth.context';
import { useSearchParams } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

export default function FilmDetails() {
  const { user, loading } = useAuth();
  const [movie, setMovie] = useState(null);
  const router = useRouter();
  const id = router.query.idMovie;

 useEffect(() => {
    if (!id) {
      return;
    }

    if (!loading && !user) {
        router.push('/ui/sign-in');
    }

    if (!loading && user) {
        console.log('path', `/api/movies/${id}`)
        fetch(`/api/movies/${id}`, {
            headers: {
            Authorization: localStorage.getItem('token'),
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setMovie(data.data);
            fetch(`/api/movies/${id}/videos`, {
                headers: {
                Authorization: localStorage.getItem('token'),
                },
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('videos', data.data)
                setMovie((prev) => ({
                ...prev,
                movie: {
                    ...prev.movie,
                    videos: data.data.videos,
                },
                }));
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }
  }, [id, user, loading, router]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found.</div>;
  }

  return (
    <ThemeProvider theme={createTheme()}>
    <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {user ? `Welcome, ${user.email} !` : 'Welcome, you are not logged in.'}
          </Typography>
          <Button
            href="/ui/dashboard"
            color="primary"
            variant="outlined"
            sx={{ my: 1, mx: 1.5 }}
            >
            Dashboard
            </Button>
          {user && (
            <Button
              href="/api/auth/logout"
              color="primary"
              variant="outlined"
              sx={{ my: 1, mx: 1.5 }}
            >
              Logout
            </Button>
            )}
            {!user && (
                <Button
              href="#"
              color="primary"
              variant="outlined"
              sx={{ my: 1, mx: 1.5 }}
            >
                Sign In
            </Button>
            )}
        </Toolbar>
      </AppBar>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={`https://image.tmdb.org/t/p/w500${movie.movie.poster_path}`} alt={movie.movie.title} style={{ width: '300px', height: '450px' }} />
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h1>{movie.movie.title}</h1>
        <p>{movie.movie.overview}</p>
        <p>Release date: {movie.movie.release_date}</p>
        <p>Vote average: <Rating value={movie.movie.vote_average / 2} precision={0.1} readOnly /></p>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">Genres:</Typography>
            <Typography variant="body1">
                <ul>
                    {movie.movie.genres.map(genre => <li key={genre.id}>{genre.name}</li>)}
                </ul>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Production Companies:</Typography>
            <Typography variant="body1">{movie.movie.production_companies.map(company => company.name).join(', ')}</Typography>
          </Grid>
          {/* Add more details sections with Grid and Typography */}
        </Grid>
      </div>
      {movie.movie.videos && movie.movie.videos.length > 0 &&
          movie.movie.videos.filter(video => video.type === 'Trailer').map(video => (
              <div key={video.id}>
                  <h2>{video.name}</h2>
                  <iframe
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                  />
              </div>
          ))
      }
    </div>
    </ThemeProvider>
  );
}