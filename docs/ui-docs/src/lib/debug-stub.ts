// Stub for the debug npm package — micromark imports it for dev logging.
// CJS `module.exports` breaks in Cloudflare Workers runtime (workerd).
const noop = () => noop;
noop.enabled = false;
export default noop;
