/**
 * Strips a single outer ```json fence (and any text after the closing fence) from model
 * output before JSON.parse. Unfenced text is returned unchanged, so invalid JSON still
 * fails closed at the caller's parse.
 */
export function stripJsonFence(text) {
  const match = /^\s*```(?:json)?[ \t]*\r?\n([\s\S]*?)\r?\n```/i.exec(text);
  return match ? match[1] : text;
}
