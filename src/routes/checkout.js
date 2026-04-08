const express = require('express');
const Sentry = require('@sentry/node');
const router = express.Router();
const { processPayment } = require('../services/payment');
const { reserveInventory } = require('../services/inventory');
const { getCart } = require('../services/cart');
const { getUser } = require('../services/user');
const logger = require('../middleware/logger');

const MAX_ID_LEN = 128;
const MAX_PM_LEN = 200;

function nonEmptyString(value, maxLen) {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (s.length === 0 || s.length > maxLen) return null;
  return s;
}

/**
 * POST /checkout
 * Processes a checkout request for the authenticated user.
 * Validates cart, reserves inventory, and initiates payment.
 */
router.post('/', async (req, res) => {
  const userId = nonEmptyString(req.body?.userId, MAX_ID_LEN);
  const cartId = nonEmptyString(req.body?.cartId, MAX_ID_LEN);
  const paymentMethodId = nonEmptyString(req.body?.paymentMethodId, MAX_PM_LEN);

  if (!userId || !cartId || !paymentMethodId) {
    return res.status(400).json({ error: 'userId, cartId, and paymentMethodId are required' });
  }

  logger.info('Checkout initiated', { userId, cartId });

  try {
    // Fetch user and cart in parallel
    const [user, cart] = await Promise.all([
      getUser(userId),
      getCart(cartId),
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // BUG (demo / regression story): v2.4.0 mobile leaves cart.items null — this line throws
    // TypeError before any guard. Fix: `if (!cart.items || cart.items.length === 0)`.
    if (cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const items = cart.items;

    // Calculate total
    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Reserve inventory before charging
    const reservation = await reserveInventory(items);

    if (!reservation.success) {
      return res.status(409).json({
        error: 'Some items are out of stock',
        outOfStock: reservation.outOfStockItems,
      });
    }

    // Process payment
    const payment = await processPayment({
      userId,
      amount: total,
      currency: 'USD',
      paymentMethodId,
      reservationId: reservation.id,
    });

    if (!payment.success) {
      // Release inventory reservation if payment fails
      await reservation.release();
      return res.status(402).json({ error: 'Payment failed', code: payment.errorCode });
    }

    logger.info('Checkout completed', { userId, cartId, paymentId: payment.id, total });

    return res.status(200).json({
      success: true,
      orderId: payment.orderId,
      total,
      estimatedDelivery: payment.estimatedDelivery,
    });

  } catch (err) {
    Sentry.captureException(err);
    logger.error('Checkout failed', {
      userId,
      cartId,
      error: err.message,
      stack: err.stack,
    });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
