import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { useAuth } from '../../src/contexts/auth.context';
import { useRouter } from 'next/router';
import { CardMedia } from '@mui/material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const footers = [
  {
    title: 'Company',
    description: ['Team', 'History', 'Contact us', 'Locations'],
  },
  {
    title: 'Features',
    description: [
      'Cool stuff',
      'Random feature',
      'Team feature',
      'Developer stuff',
      'Another one',
    ],
  },
  {
    title: 'Resources',
    description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
  },
  {
    title: 'Legal',
    description: ['Privacy policy', 'Terms of use'],
  },
];

export default function Dashboard() {

    const { user, loading } = useAuth();
    const [movies, setMovies] = React.useState([]);
    const [likedMovies, setLikedMovies] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/ui/sign-in');
        }

        if (!loading && user) {
          const token = localStorage.getItem('token');
          fetch('/api/movies')
          .then(response => response.json())
          .then(data => {
            setMovies(data.data);
            fetch('/api/movies/likes', {
              headers: {
                'Authorization': token
              }
            })
            .then(response => response.json())
            .then(data => {
              setLikedMovies(data.data.likes);
              /*{
                "likes": [
                  {
                    "_id": "6616aeaad4ae33c912225642",
                    "idTMDB": 1011985,
                    "userId": "65f2f9b7ef70e626e4dc11c8"
                  }
                ]
              }*/
            }).catch(err => {
              console.error(err);
            });
          }).catch(err => {
            console.error(err);
          });
        }
    }, [user, loading, router]);

    const loadMore = () => {
      fetch('/api/movies?page=' + (page + 1))
      .then(response => response.json())
      .then(data => {
        setMovies([...movies, ...data.data]);
      }).catch(err => {
        console.error(err);
      });

      setPage(page + 1);
    }

    const handleLike = (idMovie) => {
      fetch(`/api/movies/${idMovie}/likes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`
        }
      }).then(response => response.json())
      .then(data => {
        data = data.data;
        console.log(data.action);
        if (data.action === 'likeCounter deleted') {
          setLikedMovies(likedMovies.filter(movie => movie.idTMDB !== idMovie));
        }
        if (data.action === 'likeCounter created') {
          setLikedMovies([...likedMovies, {idTMDB: idMovie}]);
        }
      }).catch(err => {
        console.error(err);
      });
    }

  return (
    <ThemeProvider theme={createTheme()}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
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
              href="/ui/liked-movies"
              color="primary"
              variant="outlined"
              sx={{ my: 1, mx: 1.5 }}
            >My liked movies</Button>
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
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Recent movies
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-start">
          {movies.map((movie, index) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} id={movie.id}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia 
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <CardHeader
                  title={movie.title}
                  subheader={movie.release_date}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  sx={{ pb: 0 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography align="center" color="text.secondary" paragraph>
                    {movie.overview.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>
                <Button size="small" color="primary" onClick={() => handleLike(movie.id)}>
                  {likedMovies.some(likedMovie => likedMovie.idTMDB == movie.id) ? 'Unlike' : 'Like'}
                </Button>
                <Button size="small" color="primary" href={`/ui/${movie.id}/details`}>
                  View
                </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={3}>
            <Button variant="outlined" color="primary" onClick={loadMore}>
              View more
            </Button>
          </Grid>
        </Grid>
      </Container>
      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Grid container spacing={4} justifyContent="space-evenly">
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={footer.title}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {footer.title}
              </Typography>
              <ul>
                {footer.description.map((item) => (
                  <li key={item}>
                    <Link href="#" variant="subtitle1" color="text.secondary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      {/* End footer */}
    </ThemeProvider>
  );
}