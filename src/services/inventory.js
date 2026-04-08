const logger = require('../middleware/logger');

const reservations = new Map();

/**
 * Reserves stock for cart line items. Stub implementation stores reservations in memory.
 */
async function reserveInventory(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      success: false,
      outOfStockItems: [],
    };
  }

  const id = `res-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  reservations.set(id, { items: items.map((i) => ({ ...i })) });

  return {
    success: true,
    id,
    outOfStockItems: [],
    async release() {
      reservations.delete(id);
      logger.info('Released inventory reservation', { id });
    },
  };
}

module.exports = { reserveInventory };
