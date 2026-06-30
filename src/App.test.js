import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the CleanQuest brand header', () => {
  render(<App />);
  const brand = screen.getAllByText(/CleanQuest/i)[0];
  expect(brand).toBeInTheDocument();
});

test('shows the pilot city tagline', () => {
  render(<App />);
  expect(screen.getByText(/your city is the game board/i)).toBeInTheDocument();
});
