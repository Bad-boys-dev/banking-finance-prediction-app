jest.mock('axios');
import axios from 'axios';

import { lookupInstitutions } from './connector';

describe('test', () => {
  it('should successfully look up institutions', async () => {
    (axios as unknown as jest.Mock).mockImplementation(() => ({
      data: { homer: 'simpson' },
      status: 200,
    }));

    const response = await lookupInstitutions('1', '1');

    expect(response).toEqual({ homer: 'simpson' });
    expect(axios).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith({
      method: 'GET',
      url: 'http://localhost:8082/api/v1/institutions?page=1&limit=1',
    });
  });
});
