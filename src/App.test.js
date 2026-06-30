import { render, screen } from '@testing-library/react';
import App from './App';

// Smoke test: the GlowUp map screen renders its hero on first load.
test('renders the GlowUp map with nearby Fade Zones', () => {
  render(<App />);
  expect(screen.getByText(/your city is waiting/i)).toBeInTheDocument();
  expect(screen.getByText(/Fade Zones nearby/i)).toBeInTheDocument();
});

// The live event banner is present on the map.
test('surfaces the live Mayor\'s Cleanup Cup event', () => {
  render(<App />);
  expect(screen.getAllByText(/Mayor's Cleanup Cup/i).length).toBeGreaterThan(0);
});
