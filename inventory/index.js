const express = require('express');
const dao = require('./dao');
const app = express();
app.use(express.json());

app.get('/items', async (req, res) => {
  const list = await dao.list();
  res.json(list);
});

app.post('/reserve', async (req, res) => {
  const {itemId, quantity} = req.body;
  try{
    await dao.reserve(itemId, quantity);
    res.json({ok: true});
  } catch(err){
    res.status(400).json({ok: false, error: err.message});
  }
});

app.post('/release', async (req, res) => {
  const {itemId, quantity} = req.body;
  try{
    await dao.release(itemId, quantity);
    res.json({ok: true});
  } catch(err){
    res.status(400).json({ok: false, error: err.message});
  }
});

app.post('/setStock', async (req, res) => {
  const {itemId, quantity} = req.body;
  try{
    await dao.setStock(itemId, quantity);
    res.json({ok: true});
  } catch(err){
    res.status(400).json({ok: false, error: err.message});
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Inventory service listening on ${port}`));
