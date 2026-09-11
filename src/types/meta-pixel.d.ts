declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
  function fbq(...args: any[]): void;
}

export {};
