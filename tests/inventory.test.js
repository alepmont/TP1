const request = require('supertest');
const inventoryApp = require('../inventory/index');

describe('Inventory API (smoke)', () => {
  let server;
  beforeAll((done) => {
    server = inventoryApp.listen(0, done);
  });
  afterAll((done) => server.close(done));

  test('GET /items returns JSON array', async () => {
    const res = await request(server).get('/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
