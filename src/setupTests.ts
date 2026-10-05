import "@testing-library/jest-dom";
Object.defineProperty(globalThis, "crypto", {
  value: require("crypto").webcrypto,
  configurable: true,
});
