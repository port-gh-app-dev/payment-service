const logger = require('../middleware/logger');

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return require('stripe')(key);
}

async function processPayment({ userId, amount, currency, paymentMethodId, reservationId }) {
  const mock =
    process.env.DEMO_MOCK_STRIPE === '1' || process.env.DEMO_MOCK_STRIPE === 'true';
  if (mock) {
    logger.info('Processing payment (DEMO_MOCK_STRIPE)', { userId, amount, currency });
    return {
      success: true,
      id: 'pi_demo_mock',
      orderId: `ORD-${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  const stripe = getStripe();
  if (!stripe) {
    logger.error('STRIPE_SECRET_KEY is not set');
    return { success: false, errorCode: 'stripe_not_configured' };
  }

  logger.info('Processing payment', { userId, amount, currency });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      metadata: { userId, reservationId },
    });

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        id: paymentIntent.id,
        orderId: `ORD-${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    return { success: false, errorCode: paymentIntent.status };

  } catch (err) {
    logger.error('Stripe payment failed', { userId, error: err.message });
    return { success: false, errorCode: err.code ?? 'stripe_error' };
  }
}

module.exports = { processPayment };
