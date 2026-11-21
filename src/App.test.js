import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('opens on the real land listings, underwritten against market benchmarks', async () => {
  render(<App />);
  expect(screen.getByText(/STR Deal Finder/i)).toBeInTheDocument();
  expect(await screen.findByText(/Real listings ·/i)).toBeInTheDocument();
  expect(await screen.findByText(/Deals analyzed/i)).toBeInTheDocument();
  expect(screen.getByText(/Market benchmarks behind these numbers/i)).toBeInTheDocument();
  expect(screen.getByText(/Management decides these deals/i)).toBeInTheDocument();
});

test('can switch to the sample market model', async () => {
  render(<App />);
  await screen.findByText(/Real listings ·/i);
  fireEvent.click(screen.getByRole('button', { name: /Sample market model/i }));
  // Data loads async (the MLS client falls back to the bundled sample offline).
  expect(await screen.findByText(/Bundled sample data/i)).toBeInTheDocument();
  expect(await screen.findByText(/Median cap rate/i)).toBeInTheDocument();
});
