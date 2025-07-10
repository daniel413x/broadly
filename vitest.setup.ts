import "@testing-library/jest-dom";

// shadcn components use ResizeObserver
// and they crash tests if ResizeObserver is not mocked
global.ResizeObserver = class ResizeObserver {
  constructor() {
  }
  observe() { }
  unobserve() { }
  disconnect() { }
};
