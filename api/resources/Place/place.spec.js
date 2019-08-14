const supertest = require('supertest');

const db = require('./place.model');
const server = require('../../server');

describe('Places', () => {
  beforeAll(() => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  it('should work', () => {
    expect(1).toBe(1);
  });

  it('db should be a function', () => {
    expect(typeof db).toBe('object');
  });

  it('should respond with status 200', async () => {
    const request = await supertest(server)
      .get('/')
      .expect(200);
    expect(request.body).toEqual({
      message: 'API is up',
    });
  });
});
