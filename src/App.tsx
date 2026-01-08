import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/landing/LandingPage';

export function App() {
  return (
    <ThemeProvider>
      <LandingPage />
    </ThemeProvider>
  );
}

export default App;