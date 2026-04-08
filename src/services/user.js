/**
 * In-memory demo users — no DB. Any non-empty userId resolves for checkout demos.
 */
async function getUser(userId) {
  if (userId == null || userId === '') {
    return null;
  }

  return {
    id: userId,
    email: `${userId}@demo.local`,
  };
}

module.exports = { getUser };
