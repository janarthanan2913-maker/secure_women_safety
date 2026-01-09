import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Auth from './components/Auth';
import Report from './components/Report';
import SOS from './components/SOS';
import Resources from './components/Resources';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'auth':
        return <Auth onNavigate={setCurrentPage} />;
      case 'report':
        return <Report />;
      case 'sos':
        return <SOS onNavigate={setCurrentPage} />;
      case 'resources':
        return <Resources />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col">
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
          <main className="flex-1">{renderPage()}</main>
          <Footer />
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
