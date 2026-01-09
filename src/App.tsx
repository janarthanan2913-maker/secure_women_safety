import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Auth from './components/Auth';
import Search from './components/Search';
import Library from './components/Library';
import Playlists from './components/Playlists';
import Downloads from './components/Downloads';
import Settings from './components/Settings';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentSong, setCurrentSong] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} onPlaySong={setCurrentSong} />;
      case 'auth':
        return <Auth onNavigate={setCurrentPage} />;
      case 'search':
        return <Search />;
      case 'library':
        return <Library />;
      case 'playlists':
        return <Playlists />;
      case 'downloads':
        return <Downloads />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onNavigate={setCurrentPage} onPlaySong={setCurrentSong} />;
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col bg-gray-950">
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
          <main className="flex-1">{renderPage()}</main>
          <MusicPlayer song={currentSong} onNext={() => {}} onPrevious={() => {}} />
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
