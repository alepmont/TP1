const request = require('supertest');
const express = require('express');

// Importar el servidor de inventory en lugar de arrancar el puerto
const inventory = require('../inventory/index');

describe('Inventory API (smoke)', () => {
  test('GET /items returns JSON array', async () => {
    const res = await request('http://localhost:3001').get('/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
