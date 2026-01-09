import { Shield, Menu, X, Globe } from 'lucide-react';
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
    { code: 'fr', name: 'Français' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-teal-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">SafeSpace</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => onNavigate('resources')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'resources' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              {t.nav.resources}
            </button>
            <button
              onClick={() => onNavigate('report')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'report' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              {t.nav.report}
            </button>
            <button
              onClick={() => onNavigate('sos')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'sos' ? 'text-red-600' : 'text-gray-700 hover:text-red-600'
              }`}
            >
              {t.nav.sos}
            </button>
            {user && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'dashboard' ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'
                }`}
              >
                {t.nav.dashboard}
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
              >
                <Globe className="h-4 w-4" />
                {language.toUpperCase()}
              </button>
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        language === lang.code ? 'text-teal-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
              >
                {t.nav.signOut}
              </button>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
              >
                {t.nav.signIn}
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-teal-600"
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => {
                onNavigate('resources');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-teal-600"
            >
              {t.nav.resources}
            </button>
            <button
              onClick={() => {
                onNavigate('report');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-teal-600"
            >
              {t.nav.report}
            </button>
            <button
              onClick={() => {
                onNavigate('sos');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-medium text-red-600 hover:text-red-700"
            >
              {t.nav.sos}
            </button>
            {user && (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-sm font-medium text-gray-700 hover:text-teal-600"
              >
                {t.nav.dashboard}
              </button>
            )}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Language</span>
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
                      ? 'bg-teal-50 text-teal-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
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
                className="block w-full text-left text-sm font-medium text-gray-700 hover:text-teal-600 pt-3 border-t border-gray-200"
              >
                {t.nav.signOut}
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700"
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
