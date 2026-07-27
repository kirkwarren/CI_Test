// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const fs = require('fs');
const path = require('path');

// jsdom lacks ResizeObserver, which the chart containers rely on.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = global.ResizeObserver || ResizeObserverStub;

const dataFile = (name) => path.join(__dirname, '..', 'public', 'data', name);

// Trim the datasets for the component smoke test: the full set is ~5k listings
// against ~14k comps, which is a performance test, not a rendering one. The
// analysis engine is exercised at full scale in analysis.test.js.
const slice = (name, n) =>
  JSON.parse(fs.readFileSync(dataFile(name), 'utf8')).slice(0, n);

// Keep tests offline. External hosts reject (so the MLS client falls back to
// the sample dataset, as it does in the browser when a feed is unreachable),
// while the local static data files resolve from disk.
global.fetch = (url) => {
  const u = String(url);
  const respond = (body) => Promise.resolve({ ok: true, json: () => Promise.resolve(body) });
  if (u.includes('/data/listings.json')) return respond(slice('listings.json', 400));
  if (u.includes('/data/airbnb-comps.json')) return respond(slice('airbnb-comps.json', 3000));
  return Promise.reject(new Error('network disabled in tests'));
};
