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
