import * as React from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../src/contexts/auth.context';
import { Box, Container, Link, Typography } from '@mui/material';
import { Copyright } from '@mui/icons-material';

export default function Index() {

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/ui/sign-in');
    }
  }, [user, router]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI - Next.js example
        </Typography>
        <Link href="/ui/sign-in" color="secondary">
          Go to the Sign-In page
        </Link>
        <Copyright />
      </Box>
    </Container>
  );
}