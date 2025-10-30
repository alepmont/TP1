# Microservicios ejemplo — TP1
# Microservicios ejemplo — TP1

Este repositorio es un ejemplo didáctico pensado para explicar a un colega junior varios patrones y conceptos de arquitectura aplicada:

- Microservicios con comunicación HTTP (inventory, orders, gateway).
- API REST: cada servicio expone endpoints claros y específicos.
- Separación de responsabilidades: DTO (datos entrantes), DAO (acceso a datos) y objeto de negocio (reglas/validaciones).
- Circuit breaker: protección frente a fallos repetidos en llamadas a servicios remotos.
- Saga simple: patrón de compensación al fallar operaciones distribuidas (aquí: reserva de inventario al crear una orden).

Servicios incluidos (puertos por defecto):
- `inventory` — puerto 3001 — gestiona stock: GET `/items`, POST `/reserve`, POST `/release`, POST `/setStock`.
- `orders` — puerto 3002 — gestión de órdenes: POST `/orders`, GET `/orders`.
- `gateway` — puerto 3000 — gateway simple que reenvía `/orders` y `/items` a los servicios internos.

Estructura relevante:

- `inventory/dao.js` — DAO (acceso a datos) en memoria. Encapsula la lógica de lectura y modificación del stock.
- `orders/dao.js` — DAO en memoria para órdenes.
- `orders/business.js` — Objeto de negocio: validaciones y creación de la entidad `order` (estado PENDING/CONFIRMED/CANCELLED).
- `lib/circuitBreaker.js` — implementación didáctica del patrón circuit breaker.

Cómo ejecutar (Windows PowerShell)

1. Instala Node.js (incluye npm) si no lo tienes: https://nodejs.org/
2. En PowerShell ejecuta:

```powershell
cd "c:\Users\adond\Documents\DESARROLLO DE SOFTWARE iesMB\3ro año\Arquitectura y diseño de interfaces\TP1"
npm install

# En terminales separadas:
npm run start:inventory
npm run start:orders
npm run start:gateway

# Alternativamente, en una sola terminal (usa concurrently):
npm run start
```

Nota: en mi intento anterior en este entorno, `npm` no estaba disponible; asegúrate de que Node.js está instalado y accesible desde PowerShell.

Endpoints y ejemplos de prueba (PowerShell/curl)

1) Consultar catálogo (vía gateway):

```powershell
curl http://localhost:3000/items
```

2) Crear una orden (happy path):

```powershell
curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{"itemId":"item-1","quantity":1}'
```

3) Forzar fallo y ver la saga de compensación:

Primero reduce el stock a 0 (directo al servicio inventory):

```powershell
curl -X POST http://localhost:3001/setStock -H "Content-Type: application/json" -d '{"itemId":"item-1","quantity":0}'
```

Ahora intenta crear una orden para `item-1`. La reserva fallará y la orden pasará a `CANCELLED`.

```powershell
curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{"itemId":"item-1","quantity":1}'
```

Ver órdenes:

```powershell
curl http://localhost:3002/orders
```

Explicación técnica breve

- DTO (Data Transfer Object): los JSON que recibe el endpoint de `orders` actúan como DTOs (`{itemId, quantity}`). Antes de crear la entidad se validan y se convierten.
- DAO (Data Access Object): `inventory/dao.js` y `orders/dao.js` encapsulan acceso a datos (aquí memoria). En producción sería una capa sobre la BD.
- Objeto de Negocio: `orders/business.js` implementa reglas (por ejemplo, cantidad > 0), crea la entidad con estado inicial `PENDING` y delega persistencia al DAO.
- Circuit Breaker: `lib/circuitBreaker.js` mantiene contadores de fallos y abre el circuito si se excede el umbral, evitando más llamadas mientras esté `OPEN`.
- Saga simple: la secuencia para crear una orden es: crear orden PENDING -> llamar a inventory.reserve -> si éxito, marcar CONFIRMED; si falla, compensar (marcar CANCELLED). En sistemas reales la saga suele ser basada en eventos o un orquestador.

Notas y mejoras posibles

- Sustituir DAOs en memoria por una base de datos (Postgres, MongoDB). Añadir migraciones.
- Sustituir las llamadas HTTP síncronas por eventos/colas (RabbitMQ/Kafka) para lograr mayor resiliencia.
- Añadir trazabilidad distribuida (headers de correlación) y sistemas de observabilidad.
- Añadir tests unitarios e integración (puedo generarlos si quieres).

*** Fin de documentación básica ***
