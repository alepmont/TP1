const express = require('express');
const axios = require('axios');
const {v4: uuidv4} = require('uuid');
const OrderDAO = require('./dao');
const OrderService = require('./business');
const CircuitBreaker = require('../lib/circuitBreaker');

const app = express();
app.use(express.json());

const orderService = new OrderService({dao: OrderDAO});

// Circuit breaker para llamadas al servicio de inventario
const inventoryCb = new CircuitBreaker({failureThreshold: 2, timeout: 5000});

// DTO: estructura de entrada para crear órdenes
app.post('/orders', async (req, res) => {
  const dto = req.body; // espera {itemId, quantity}
  dto.id = uuidv4();

  try{
    // 1) Crear orden en estado PENDING (persistir)
    const order = await orderService.createOrder(dto);

    // 2) Reservar inventario llamando a inventory (con circuit breaker)
    await inventoryCb.call(() => axios.post('http://localhost:3001/reserve', {itemId: dto.itemId, quantity: dto.quantity}));

    // 3) Si correcto, actualizar orden como CONFIRMED
    order.status = 'CONFIRMED';
    await OrderDAO.save(order);

    res.json({ok: true, order});
  } catch(err){
    // Falla en la reserva — saga de compensación: cancelar/compensar
    // Si la reserva falló después de crear la orden, la compensación es marcarla como CANCELLED
    if(dto.id){
      const existing = await OrderDAO.find(dto.id);
      if(existing){
        existing.status = 'CANCELLED';
        await OrderDAO.save(existing);
      }
    }

    const code = err.code === 'EOPEN' ? 503 : 400;
    res.status(code).json({ok: false, error: err.message});
  }
});

app.get('/orders', async (req, res) => {
  const list = await OrderDAO.list();
  res.json(list);
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Orders service listening on ${port}`));
