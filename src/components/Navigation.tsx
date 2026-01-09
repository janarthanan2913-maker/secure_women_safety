import { Music, Search, Library, List, Download, Settings, LogOut, LogIn, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'hi', name: 'हिन्दी' },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-2 rounded-lg">
              <Music className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
              Rhythm
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                currentPage === 'home' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Music className="h-4 w-4" />
              Home
            </button>
            <button
              onClick={() => onNavigate('search')}
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                currentPage === 'search' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Search className="h-4 w-4" />
              {t.nav.search}
            </button>
            {user && (
              <>
                <button
                  onClick={() => onNavigate('library')}
                  className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                    currentPage === 'library' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Library className="h-4 w-4" />
                  {t.nav.library}
                </button>
                <button
                  onClick={() => onNavigate('playlists')}
                  className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                    currentPage === 'playlists' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <List className="h-4 w-4" />
                  {t.nav.playlists}
                </button>
                <button
                  onClick={() => onNavigate('downloads')}
                  className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                    currentPage === 'downloads' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Download className="h-4 w-4" />
                  {t.nav.downloads}
                </button>
              </>
            )}

            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4" />
                {language.toUpperCase()}
              </button>
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                        language === lang.code ? 'text-blue-400 font-medium' : 'text-gray-300'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('settings')}
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                currentPage === 'settings' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4" />
            </button>

            {user ? (
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t.nav.signOut}
              </button>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
              >
                {t.nav.signIn}
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('search');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white"
            >
              {t.nav.search}
            </button>
            {user && (
              <>
                <button
                  onClick={() => {
                    onNavigate('library');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white"
                >
                  {t.nav.library}
                </button>
                <button
                  onClick={() => {
                    onNavigate('playlists');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white"
                >
                  {t.nav.playlists}
                </button>
                <button
                  onClick={() => {
                    onNavigate('downloads');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white"
                >
                  {t.nav.downloads}
                </button>
              </>
            )}
            <div className="pt-3 border-t border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Language</span>
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm rounded ${
                    language === lang.code
                      ? 'bg-blue-500 text-white font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-sm font-medium text-gray-300 hover:text-white pt-3 border-t border-gray-700"
              >
                {t.nav.signOut}
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-sm font-medium rounded-lg mt-3"
              >
                {t.nav.signIn}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
