/** VITE_ROUTER=memory builds a version for embedded previews, where the URL can't carry routes. */
export const EMBEDDED = import.meta.env.VITE_ROUTER === 'memory';
