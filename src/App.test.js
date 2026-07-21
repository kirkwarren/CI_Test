import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the identifier heading', () => {
  render(<App />);
  expect(screen.getByText(/rock & mineral identifier/i)).toBeInTheDocument();
});

test('offers camera and upload options', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /open camera/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /upload a photo/i })).toBeInTheDocument();
});
