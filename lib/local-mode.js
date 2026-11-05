export const LOCAL_SESSION_COOKIE = 'fritz-local-session';
export const LOCAL_SESSION_SECONDS = 12 * 60 * 60;

export function localMemoryEnabled(env = process.env) {
  return env.NODE_ENV === 'development' && env.FRITZ_LOCAL_MEMORY === '1';
}

export function isLoopbackRequest(request) {
  return ['localhost', '127.0.0.1', '[::1]'].includes(new URL(request.url).hostname);
}
