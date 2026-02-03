if (typeof window !== 'undefined' && window.parent) {
  try {
    if (typeof TextEncoder === 'undefined' && (window.parent as any).TextEncoder) {
        (window as any).TextEncoder = (window.parent as any).TextEncoder;
    }
    if (typeof TextDecoder === 'undefined' && (window.parent as any).TextDecoder) {
        (window as any).TextDecoder = (window.parent as any).TextDecoder;
    }
  } catch (e) {
    console.warn('[Inline Status Bar] Failed to polyfill TextEncoder:', e);
  }
}
