/**
 * In-memory orders for refund demos — no Postgres.
 * Seeds a few orders so POST /refund works without a prior checkout.
 */

const orders = new Map([
  [
    'ORD-demo-refundable',
    {
      id: 'ORD-demo-refundable',
      userId: 'demo-user',
      paymentIntentId: 'pi_demo_mock',
      amount: 10,
      currency: 'USD',
      refundedAmount: 0,
      status: 'paid',
    },
  ],
  [
    'ORD-demo-partial',
    {
      id: 'ORD-demo-partial',
      userId: 'demo-user',
      paymentIntentId: 'pi_demo_partial',
      amount: 100,
      currency: 'USD',
      refundedAmount: 25,
      status: 'partially_refunded',
    },
  ],
  [
    'ORD-demo-fully-refunded',
    {
      id: 'ORD-demo-fully-refunded',
      userId: 'demo-user',
      paymentIntentId: 'pi_demo_done',
      amount: 50,
      currency: 'USD',
      refundedAmount: 50,
      status: 'refunded',
    },
  ],
]);

async function getOrder(orderId) {
  return orders.get(orderId) ?? null;
}

async function recordRefund(orderId, amount) {
  const order = orders.get(orderId);
  if (!order) return null;

  const refundedAmount = order.refundedAmount + amount;
  const status =
    refundedAmount >= order.amount ? 'refunded' : 'partially_refunded';

  const updated = { ...order, refundedAmount, status };
  orders.set(orderId, updated);
  return updated;
}

function remainingRefundable(order) {
  return Math.max(0, order.amount - order.refundedAmount);
}

module.exports = { getOrder, recordRefund, remainingRefundable };
