// DAO en memoria para inventario. Responsable del acceso a datos.
const items = new Map();

// Inicializar con algunos items
items.set('item-1', {id: 'item-1', name: 'Teclado', stock: 5});
items.set('item-2', {id: 'item-2', name: 'Mouse', stock: 2});

module.exports = {
  list: async () => Array.from(items.values()),
  find: async (id) => items.get(id),
  reserve: async (id, qty) => {
    const it = items.get(id);
    if(!it) throw new Error('Item not found');
    if(it.stock < qty) throw new Error('Insufficient stock');
    it.stock -= qty;
    return true;
  },
  release: async (id, qty) => {
    const it = items.get(id);
    if(!it) throw new Error('Item not found');
    it.stock += qty;
    return true;
  },
  // for testing
  setStock: async (id, qty) => {
    const it = items.get(id);
    if(!it) throw new Error('Item not found');
    it.stock = qty;
  }
};
