import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the deal finder and analyzes listings', async () => {
  render(<App />);
  expect(screen.getByText(/STR Deal Finder/i)).toBeInTheDocument();
  // Data loads async (falls back to the bundled sample offline).
  expect(await screen.findByText(/Deals analyzed/i)).toBeInTheDocument();
  expect(await screen.findByText(/Median cap rate/i)).toBeInTheDocument();
});
