const supertest = require('supertest');

const db = require('../../../database/db.config');
const place = require('./place.model');
const server = require('../../server');

describe('Places', () => {
  beforeAll(() => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  beforeEach(() => {
    db.truncate('attraction');
  });

  it('should work', () => {
    expect(1).toBe(1);
  });

  it('db should be an object', async () => {
    expect(typeof place).toBe('object');
  });

  it('db.add should be a function', async () => {
    expect(typeof place.add).toBe('function');
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
