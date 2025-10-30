const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const ORDERS_URL = process.env.ORDERS_URL || 'http://localhost:3002';
const INVENTORY_URL = process.env.INVENTORY_URL || 'http://localhost:3001';

// Rutas simplificadas que reenvían a servicios internos
app.post('/orders', async (req, res) => {
  try{
    const r = await axios.post(`${ORDERS_URL}/orders`, req.body);
    res.status(r.status).json(r.data);
  } catch(err){
    if(err.response) res.status(err.response.status).json(err.response.data);
    else res.status(500).json({ok:false, error: err.message});
  }
});

app.get('/items', async (req, res) => {
  try{
    const r = await axios.get(`${INVENTORY_URL}/items`);
    res.json(r.data);
  } catch(err){
    res.status(500).json({ok:false, error: err.message});
  }
});

// Export app for testing; if run directly, listen on port
if(require.main === module){
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API Gateway listening on ${port}`));
}

module.exports = app;
