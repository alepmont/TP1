// Objeto de negocio: contiene validaciones y reglas de dominio para órdenes.
class OrderService {
  constructor({dao}){
    this.dao = dao;
  }

  async createOrder(dto){
    // DTO -> negocio
    if(!dto.itemId || !dto.quantity) throw new Error('Invalid DTO');
    if(dto.quantity <= 0) throw new Error('Quantity must be > 0');
    const order = {
      id: dto.id,
      itemId: dto.itemId,
      quantity: dto.quantity,
      status: 'PENDING'
    };
    // persistir
    await this.dao.save(order);
    return order;
  }
}

module.exports = OrderService;
