import { render, screen } from '@testing-library/react';
import App from './App';

// chart.js renders to <canvas>, which jsdom doesn't implement, so the real
// chart components throw when mounted headless. We stub them with plain elements
// — the smoke test cares about App's own content (headers, disclaimer,
// pipeline), not the chart internals (those are covered by the engine tests
// that feed them).
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart" />,
  Bar: () => <div data-testid="bar-chart" />,
}));

test('renders the honest-quant dashboard header', () => {
  render(<App />);
  expect(screen.getByText(/HONEST QUANT/i)).toBeInTheDocument();
});

test('surfaces the not-financial-advice disclaimer', () => {
  render(<App />);
  expect(screen.getByText(/NOT FINANCIAL ADVICE/i)).toBeInTheDocument();
});

test('shows the six-stage pipeline', () => {
  render(<App />);
  for (const stage of ['Scan', 'Detect', 'Validate', 'Size', 'Fill', 'Settle']) {
    expect(screen.getByText(stage)).toBeInTheDocument();
  }
});

test('shows the honest probability-of-loss headline from Monte Carlo', () => {
  render(<App />);
  expect(screen.getByText(/of paths ended/i)).toBeInTheDocument();
});

test('renders the tilts section with its not-a-forecast framing', () => {
  render(<App />);
  expect(screen.getByText(/Current Tilts/i)).toBeInTheDocument();
  expect(screen.getByText(/not a forecast/i)).toBeInTheDocument();
  // The uncertainty range must be labeled as zero-drift.
  expect(screen.getByText(/no drift/i)).toBeInTheDocument();
});

test('renders the real-data screen with provenance and honesty caveat', () => {
  render(<App />);
  expect(screen.getByText(/Real-Data Screen/i)).toBeInTheDocument();
  expect(screen.getByText(/REAL MARKET DATA/i)).toBeInTheDocument();
  expect(screen.getByText(/does not predict/i)).toBeInTheDocument();
  // The strategy-vs-hold honesty strip must be present.
  expect(screen.getByText(/Strategy beat buy-&-hold on/i)).toBeInTheDocument();
});
