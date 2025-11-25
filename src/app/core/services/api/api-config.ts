export const API_BASE = 'http://localhost:9090';

// Optional: override from runtime by setting `window['__API_BASE__']` before bootstrapping.
export function getApiBase(): string {
  // runtime override
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w: any = window as any;
  return (w && w.__API_BASE__) || API_BASE;
}
