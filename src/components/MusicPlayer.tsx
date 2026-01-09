import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Download, Share2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  albumCover?: string;
}

interface MusicPlayerProps {
  song: Song | null;
  onNext?: () => void;
  onPrevious?: () => void;
  onFavorite?: (songId: string) => void;
  onDownload?: (songId: string) => void;
}

export default function MusicPlayer({
  song,
  onNext,
  onPrevious,
  onFavorite,
  onDownload,
}: MusicPlayerProps) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      onNext?.();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onNext]);

  useEffect(() => {
    if (!song) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = song.audioUrl;
    if (isPlaying) {
      audio.play().catch((err) => console.error('Play error:', err));
    }
  }, [song, isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error('Play error:', err));
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * song.duration;
  };

  const progress = song ? (currentTime / song.duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 text-white border-t border-gray-700 shadow-2xl">
      <audio ref={audioRef} crossOrigin="anonymous" />

      <div className="max-w-full px-4 py-3 md:py-4">
        {/* Progress Bar */}
        <div className="mb-3">
          <div
            onClick={handleProgressClick}
            className="w-full h-1 bg-gray-700 rounded-full cursor-pointer hover:h-2 transition-all group"
          >
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full group-hover:shadow-lg transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{song ? formatTime(song.duration) : '0:00'}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Song Info */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            {song?.albumCover && (
              <img
                src={song.albumCover}
                alt={song.title}
                className="w-12 h-12 rounded-lg object-cover shadow-lg hidden sm:block"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{song?.title || 'No song selected'}</p>
              <p className="text-xs text-gray-400 truncate">{song?.artist || 'Unknown Artist'}</p>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onPrevious}
              disabled={!song}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              onClick={togglePlayPause}
              disabled={!song}
              className="p-3 bg-gradient-to-r from-blue-500 to-teal-400 hover:shadow-lg rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>

            <button
              onClick={onNext}
              disabled={!song}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-gray-700">
              <Volume2 className="h-4 w-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1 bg-gray-700 rounded-full cursor-pointer accent-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-gray-700">
              <button
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  onFavorite?.(song?.id || '');
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Add to Favorites"
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button
                onClick={() => onDownload?.(song?.id || '')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  if (song) {
                    navigator.share?.({
                      title: song.title,
                      text: `Check out ${song.title} by ${song.artist}`,
                    });
                  }
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
