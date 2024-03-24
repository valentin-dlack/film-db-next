// FILEPATH: /c:/Users/vazzm/Documents/YNOV/M1 - COURS Next/ynov-cloud-app/__tests__/pages/index.test.js
import { render, screen } from '@testing-library/react';
import Index from '../../pages/index';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/contexts/auth.context';


jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../src/contexts/auth.context', () => ({
  useAuth: jest.fn(),
}));

describe('Index', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
    }));

    useAuth.mockImplementation(() => ({
      user: null,
    }));
  });

  it('renders without crashing', () => {
    render(<Index />);
    expect(screen.getByText('Material UI - Next.js example')).toBeInTheDocument();
  });

  it('contains link to Sign-In page', () => {
    render(<Index />);
    expect(screen.getByText('Go to the Sign-In page')).toBeInTheDocument();
  });
});