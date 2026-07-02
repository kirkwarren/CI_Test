import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the map home with the CleanQuest HUD', () => {
  render(<App />);
  expect(screen.getByText(/CleanQuest/i)).toBeInTheDocument();
});

test('shows litter spawns and the leaderboard rank button', () => {
  render(<App />);
  expect(screen.getByText(/litter spawns nearby/i)).toBeInTheDocument();
  expect(screen.getByText(/^#\d+$/)).toBeInTheDocument();
});
