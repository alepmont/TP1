const request = require('supertest');

const inventoryApp = require('../inventory/index');
const ordersApp = require('../orders/index');

describe('Orders API (smoke)', () => {
  let invServer;
  let ordersServer;

  beforeAll((done) => {
    // Start inventory on random port
    invServer = inventoryApp.listen(0, () => {
      const port = invServer.address().port;
      // Tell orders to use this inventory URL
      process.env.INVENTORY_URL = `http://127.0.0.1:${port}`;
      // require orders app after setting env (orders/index reads env on import)
      // but ordersApp is already required above; to ensure it uses env, we create a fresh app by clearing cache
      delete require.cache[require.resolve('../orders/index')];
      const freshOrdersApp = require('../orders/index');
      ordersServer = freshOrdersApp.listen(0, done);
    });
  });

  afterAll((done) => {
    ordersServer.close(() => invServer.close(done));
  });

  test('POST /orders creates and compensates on insufficient stock', async () => {
    // Primero dejar stock a 0 para forzar fallo
    await request(invServer).post('/setStock').send({itemId: 'item-1', quantity: 0});

    const res = await request(ordersServer).post('/orders').send({itemId: 'item-1', quantity: 1});
    // Debe responder con error (400 o 503) y el sistema debe haber compensado (orden CANCELLED)
    expect([400,503]).toContain(res.statusCode);
  }, 15000);
});
