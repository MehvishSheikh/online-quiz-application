import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'
import { ThemeProvider } from '@/components/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="quiz-ui-theme">
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
