import handler from '../../pages/api/discover';
import fetch from 'node-fetch';
import { ConfigService } from '../../src/services/config.service';

jest.mock('node-fetch');

describe('API Handler for Discover', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return data from the discover API when successful', async () => {
    const mockData = {
      results: [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' }
      ]
    };

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockData)
    });

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 200, data: mockData.results });
  });

  it('should handle network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: 500, error: 'Internal Server Error' });
  });

  it('should handle errors in configuration', async () => {
    jest.replaceProperty(ConfigService.themoviedb.keys, 'API_TOKEN', jest.fn().mockReturnValue('MY_API_TOKEN_VALUE'));

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: 500, error: 'Internal Server Error' });
  });
});