type EnvSource = Record<string, string | undefined>;
interface EnvOpts<T> {
  fallback?: T;
  parse?: (v: string) => T;
}

export const createEnvReader = (source: EnvSource, prefix = '') => {
  function getEnv(key: string): string;
  function getEnv<T>(key: string, opts: { parse: (v: string) => T }): T;
  function getEnv<T>(
    key: string,
    opts: { fallback: T; parse?: (v: string) => T },
  ): T;
  function getEnv<T>(key: string, opts?: EnvOpts<T>): T | string {
    const fullKey = `${prefix}${key}`;
    const value = source[fullKey];
    if (value === undefined) {
      if (opts?.fallback !== undefined) return opts.fallback;
      throw new Error(`Missing required env var: ${fullKey}`);
    }
    return opts?.parse ? opts.parse(value) : (value as unknown as T);
  }
  return getEnv;
};
