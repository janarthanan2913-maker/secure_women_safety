import { Heart, Download, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Library() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-400 mb-4">Sign in to access your library</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
          {t.library.title}
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 hover:shadow-lg transition-all">
            <Heart className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t.library.favorites}</h2>
            <p className="text-gray-400">0 songs</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 hover:shadow-lg transition-all">
            <Download className="h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t.library.downloaded}</h2>
            <p className="text-gray-400">0 songs</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 hover:shadow-lg transition-all">
            <Clock className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t.library.history}</h2>
            <p className="text-gray-400">0 songs</p>
          </div>
        </div>

        <div className="mt-12 bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
          <p className="text-gray-400 mb-4">Start exploring and building your music library!</p>
        </div>
      </div>
    </div>
  );
}
