import { Play, Heart, Flame } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onNavigate: (page: string) => void;
  onPlaySong?: (songId: string) => void;
}

export default function Home({ onNavigate, onPlaySong }: HomeProps) {
  const { t } = useLanguage();

  const mockTrending = [
    { id: '1', title: 'Midnight Dreams', artist: 'Luna Echo', plays: 234000 },
    { id: '2', title: 'Ocean Waves', artist: 'Coastal Band', plays: 189000 },
    { id: '3', title: 'Urban Pulse', artist: 'City Lights', plays: 156000 },
  ];

  const mockGenres = [
    { name: 'Regional', icon: '🌍', color: 'from-orange-500 to-red-500' },
    { name: 'Classical', icon: '🎻', color: 'from-purple-500 to-pink-500' },
    { name: 'Devotional', icon: '🙏', color: 'from-green-500 to-emerald-500' },
    { name: 'Modern', icon: '🎵', color: 'from-blue-500 to-cyan-500' },
    { name: 'Pop', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
    { name: 'Rock', icon: '🎸', color: 'from-red-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent mb-4">
              {t.home.welcome}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Ad-free music streaming. High quality audio. All languages. Play offline.
            </p>
            <button
              onClick={() => onNavigate('search')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Start Exploring
            </button>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold">{t.home.trending}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTrending.map((song) => (
              <div
                key={song.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">{song.plays.toLocaleString()} plays</p>
                  </div>
                  <button
                    onClick={() => onPlaySong?.(song.id)}
                    className="p-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="h-5 w-5 text-white fill-white" />
                  </button>
                </div>
                <p className="text-lg font-semibold mb-1">{song.title}</p>
                <p className="text-gray-400">{song.artist}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t.home.genres}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockGenres.map((genre) => (
              <button
                key={genre.name}
                onClick={() => onNavigate('search')}
                className={`bg-gradient-to-br ${genre.color} rounded-lg p-6 text-center font-semibold hover:shadow-lg transition-all hover:scale-105 text-white`}
              >
                <div className="text-3xl mb-2">{genre.icon}</div>
                <p>{genre.name}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 md:p-12 text-center">
          <Heart className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Premium Experience</h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            High-quality audio streams, offline downloads, personalized recommendations, and ad-free listening all in one place.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Create Account
          </button>
        </section>
      </div>
    </div>
  );
}
