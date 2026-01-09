import { useState } from 'react';
import { Search as SearchIcon, Music } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('songs');
  const { t } = useLanguage();

  const tabs = ['songs', 'artists', 'albums', 'playlists'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search.placeholder}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-full text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {t.search[tab as keyof typeof t.search]}
            </button>
          ))}
        </div>

        {!query ? (
          <div className="text-center py-20">
            <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {t.search.noResults}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all cursor-pointer group"
              >
                <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg mb-4 flex items-center justify-center">
                  <Music className="h-12 w-12 text-white opacity-50" />
                </div>
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Result {i + 1}
                </h3>
                <p className="text-gray-400 text-sm">Artist Name</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
