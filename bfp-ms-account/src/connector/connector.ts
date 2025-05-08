import axios from 'axios';

export const lookupInstitutions = async (page: string, limit: string) => {
  const url = new URL('http://localhost:8082/api/v1/institutions');

  const searchParams = url.searchParams;
  if (page !== '') {
    searchParams.set('page', String(+page));
  }

  if (limit !== '') {
    searchParams.set('limit', String(+limit));
  }

  url.search = searchParams.toString();
  let data: object;
  let statusCode: number;

  try {
    ({ data, status: statusCode } = await axios({
      url: url.toString(),
      method: 'GET',
    }));
  } catch (err: unknown) {
    throw new Error('Failed to lookup institutions');
  }

  if (statusCode !== 200) {
    throw new Error('Something went wrong!');
  }

  return data;
};
