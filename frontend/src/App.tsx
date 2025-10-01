import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'
import { ThemeToggle } from '@/components/ThemeToggle';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
