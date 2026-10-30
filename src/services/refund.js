const logger = require('../middleware/logger');

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return require('stripe')(key);
}

/**
 * Creates a refund against a Stripe PaymentIntent (or mock when DEMO_MOCK_STRIPE is set).
 */
async function processRefund({ orderId, paymentIntentId, amount, currency, reason }) {
  const mock =
    process.env.DEMO_MOCK_STRIPE === '1' || process.env.DEMO_MOCK_STRIPE === 'true';

  if (mock) {
    logger.info('Processing refund (DEMO_MOCK_STRIPE)', {
      orderId,
      paymentIntentId,
      amount,
      currency,
    });
    return {
      success: true,
      id: `re_demo_${Date.now()}`,
      amount,
      currency,
      status: 'succeeded',
    };
  }

  const stripe = getStripe();
  if (!stripe) {
    logger.error('STRIPE_SECRET_KEY is not set');
    return { success: false, errorCode: 'stripe_not_configured' };
  }

  logger.info('Processing refund', { orderId, paymentIntentId, amount, currency });

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100),
      reason: reason || 'requested_by_customer',
      metadata: { orderId },
    });

    if (refund.status === 'succeeded' || refund.status === 'pending') {
      return {
        success: true,
        id: refund.id,
        amount,
        currency,
        status: refund.status,
      };
    }

    return { success: false, errorCode: refund.status };
  } catch (err) {
    logger.error('Stripe refund failed', { orderId, error: err.message });
    return { success: false, errorCode: err.code ?? 'stripe_error' };
  }
}

module.exports = { processRefund };
