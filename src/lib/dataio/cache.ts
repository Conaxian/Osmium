const cache = new Map<string, any>();

export function has(filename: string) {
  return cache.has(filename);
}

export function get(filename: string) {
  return cache.get(filename);
}

export function set(filename: string, data: any) {
  cache.set(filename, data);
}
