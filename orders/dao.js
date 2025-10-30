// DAO en memoria para órdenes
const orders = new Map();

module.exports = {
  save: async (order) => {
    orders.set(order.id, order);
    return order;
  },
  find: async (id) => orders.get(id),
  list: async () => Array.from(orders.values())
};
