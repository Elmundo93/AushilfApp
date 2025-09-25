// components/lib/retry.ts
export async function retry<T>(fn: () => Promise<T>, opts?: { retries?: number; baseMs?: number; factor?: number; jitter?: boolean }) {
                const { retries = 5, baseMs = 400, factor = 2, jitter = true } = opts || {};
                let attempt = 0;
                for (;;) {
                  try {
                    return await fn();
                  } catch (e) {
                    if (attempt >= retries) throw e;
                    const delay = baseMs * Math.pow(factor, attempt);
                    const wait = jitter ? delay * (0.5 + Math.random()) : delay;
                    await new Promise(res => setTimeout(res, wait));
                    attempt++;
                  }
                }
              }