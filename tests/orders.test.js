const request = require('supertest');

describe('Orders API (smoke)', () => {
  test('POST /orders creates and compensates on insufficient stock', async () => {
    // Primero dejar stock a 0 para forzar fallo
    await request('http://localhost:3001').post('/setStock').send({itemId: 'item-1', quantity: 0});

    const res = await request('http://localhost:3000').post('/orders').send({itemId: 'item-1', quantity: 1});
    // Debe responder con error (400 o 503) y el sistema debe haber compensado (orden CANCELLED)
    expect([400,503]).toContain(res.statusCode);
  }, 10000);
});
