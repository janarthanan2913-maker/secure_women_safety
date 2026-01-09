import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'hi', name: 'हिन्दी' },
  ];

  const qualities = [
    { value: 'low', label: t.quality.low },
    { value: 'medium', label: t.quality.medium },
    { value: 'high', label: t.quality.high },
  ];

  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
          {t.settings.title}
        </h1>

        <div className="space-y-8">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-semibold mb-6">Audio Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">{t.settings.quality}</label>
              <div className="space-y-3">
                {qualities.map((quality) => (
                  <label key={quality.value} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="quality"
                      value={quality.value}
                      defaultChecked={quality.value === 'high'}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span>{quality.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-semibold mb-6">Display Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">{t.settings.theme}</label>
              <div className="space-y-3">
                {themes.map((theme) => (
                  <label key={theme.value} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-700 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      defaultChecked={theme.value === 'dark'}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span>{theme.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-semibold mb-6">Language</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">{t.settings.language}</label>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <label
                    key={lang.code}
                    className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <input
                      type="radio"
                      name="language"
                      value={lang.code}
                      checked={language === lang.code}
                      onChange={() => setLanguage(lang.code as any)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span>{lang.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-semibold mb-4">About Rhythm</h2>
            <div className="space-y-3 text-gray-300">
              <p>Version 1.0.0</p>
              <p className="text-sm">Ad-free music streaming platform with support for all languages and offline playback.</p>
              <div className="pt-4 flex gap-4">
                <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
              </div>
            </div>
          </div>

          {user && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-8">
              <p className="text-gray-300">Logged in as: <span className="font-semibold text-white">{user.email}</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
