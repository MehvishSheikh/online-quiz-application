import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'
import { ThemeProvider } from '@/components/theme-provider'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="quiz-ui-theme">
      <BrowserRouter>
        <div className="min-h-screen ai-gradient-bg text-foreground flex flex-col">
          <div className="flex-1">
            <AppRoutes />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
