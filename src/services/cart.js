/**
 * In-memory carts for local / demo — no Postgres.
 *
 * `CHECKOUT_DEMO_BUG_CART_ID` (default `cart-null-items`) simulates mobile v2.4.0:
 * initialise-cart without line items → `items` stays null in storage.
 */
const DEMO_BUG_CART_ID = process.env.CHECKOUT_DEMO_BUG_CART_ID || 'cart-null-items';

const carts = new Map([
  [
    DEMO_BUG_CART_ID,
    {
      id: DEMO_BUG_CART_ID,
      userId: 'demo-user',
      items: null,
    },
  ],
  [
    'cart-with-items',
    {
      id: 'cart-with-items',
      userId: 'demo-user',
      items: [{ price: 10, quantity: 1, sku: 'demo-sku' }],
    },
  ],
]);

async function getCart(cartId) {
  return carts.get(cartId) ?? null;
}

async function createCart(userId) {
  const id = `cart-${Date.now()}`;
  const cart = { id, userId, items: null };
  carts.set(id, cart);
  return cart;
}

async function addItemToCart(cartId, item) {
  const cart = await getCart(cartId);
  if (!cart) return null;
  const items = cart.items ?? [];
  const updated = [...items, item];
  carts.set(cartId, { ...cart, items: updated });
  return { ...cart, items: updated };
}

module.exports = { getCart, createCart, addItemToCart };
