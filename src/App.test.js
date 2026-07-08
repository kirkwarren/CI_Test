import { render, screen } from '@testing-library/react';
import App from './App';

// jsdom has no camera, so the AR world renders its camera-fallback state —
// the HUD, PiP map, and buttons must still be present around it.

test('renders the AR HUD with the CleanQuest brand', () => {
  render(<App />);
  expect(screen.getAllByText(/CleanQuest/i).length).toBeGreaterThan(0);
});

test('shows the leaderboard rank button', () => {
  render(<App />);
  expect(screen.getByText(/^#\d+$/)).toBeInTheDocument();
});
