const express = require('express');
const Sentry = require('@sentry/node');
const router = express.Router();
const { processRefund } = require('../services/refund');
const { getOrder, recordRefund, remainingRefundable } = require('../services/orders');
const { getUser } = require('../services/user');
const logger = require('../middleware/logger');

const MAX_ID_LEN = 128;
const ALLOWED_REASONS = new Set([
  'requested_by_customer',
  'duplicate',
  'fraudulent',
]);

function nonEmptyString(value, maxLen) {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (s.length === 0 || s.length > maxLen) return null;
  return s;
}

function parseAmount(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/**
 * POST /refund
 * Refunds all or part of a paid order. Uses in-memory orders for demos.
 */
router.post('/', async (req, res) => {
  const userId = nonEmptyString(req.body?.userId, MAX_ID_LEN);
  const orderId = nonEmptyString(req.body?.orderId, MAX_ID_LEN);
  const amount = parseAmount(req.body?.amount);
  const reasonRaw = req.body?.reason;
  const reason =
    reasonRaw == null || reasonRaw === ''
      ? 'requested_by_customer'
      : nonEmptyString(String(reasonRaw), 64);

  if (!userId || !orderId) {
    return res.status(400).json({ error: 'userId and orderId are required' });
  }

  if (amount == null || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  if (!reason || !ALLOWED_REASONS.has(reason)) {
    return res.status(400).json({
      error: `reason must be one of: ${[...ALLOWED_REASONS].join(', ')}`,
    });
  }

  logger.info('Refund initiated', { userId, orderId, amount, reason });

  try {
    const [user, order] = await Promise.all([getUser(userId), getOrder(orderId)]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Order does not belong to user' });
    }

    const remaining = remainingRefundable(order);
    if (remaining <= 0) {
      return res.status(409).json({ error: 'Order is already fully refunded' });
    }

    if (amount > remaining) {
      return res.status(400).json({
        error: 'Refund amount exceeds remaining refundable balance',
        remaining,
      });
    }

    const refund = await processRefund({
      orderId,
      paymentIntentId: order.paymentIntentId,
      amount,
      currency: order.currency,
      reason,
    });

    if (!refund.success) {
      return res.status(402).json({ error: 'Refund failed', code: refund.errorCode });
    }

    const updated = await recordRefund(orderId, amount);

    logger.info('Refund completed', {
      userId,
      orderId,
      refundId: refund.id,
      amount,
    });

    return res.status(200).json({
      success: true,
      refundId: refund.id,
      orderId,
      amount,
      currency: order.currency,
      status: refund.status,
      orderStatus: updated.status,
      remainingRefundable: remainingRefundable(updated),
    });
  } catch (err) {
    Sentry.captureException(err);
    logger.error('Refund failed', {
      userId,
      orderId,
      error: err.message,
      stack: err.stack,
    });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
