/**
 * @param {Request} request
 * @returns {string | null}
 */
export function getBearerFromRequest(request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization;
}
