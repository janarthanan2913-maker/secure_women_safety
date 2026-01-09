import { useState } from 'react';
import { Plus, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Playlists() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-400 mb-4">Sign in to create playlists</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
            {t.playlists.title}
          </h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            {t.playlists.create}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowCreateForm(false);
                setName('');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.playlists.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  {t.playlists.save}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:shadow-lg transition-all hover:scale-105 cursor-pointer group"
            >
              <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg mb-4 flex items-center justify-center">
                <List className="h-12 w-12 text-white opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                Playlist {i + 1}
              </h3>
              <p className="text-gray-400">0 songs</p>
            </div>
          ))}
        </div>

        {false && (
          <div className="text-center py-20">
            <List className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">{t.playlists.noPlaylists}</p>
          </div>
        )}
      </div>
    </div>
  );
}
