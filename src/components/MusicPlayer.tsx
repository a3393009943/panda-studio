import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Search, ListMusic, X, ChevronUp, ChevronDown } from 'lucide-react'

interface Song {
  id: number
  name: string
  artist: string
  album: string
  cover: string
  url: string
  duration: number
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // 搜索歌曲
  const searchSongs = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      const response = await fetch(`https://music-api.gdstudio.xyz/search?keywords=${encodeURIComponent(searchQuery)}&limit=20`)
      const data = await response.json()
      if (data.code === 200 && data.result?.songs) {
        const songs = data.result.songs.map((song: any) => ({
          id: song.id,
          name: song.name,
          artist: song.artists?.[0]?.name || '未知歌手',
          album: song.album?.name || '未知专辑',
          cover: song.album?.picUrl || `https://picsum.photos/seed/${song.id}/300/300`,
          url: `https://music-api.gdstudio.xyz/song/url?id=${song.id}`,
          duration: song.duration / 1000
        }))
        setSearchResults(songs)
      }
    } catch (error) {
      console.error('搜索失败:', error)
    }
    setIsSearching(false)
  }

  // 播放歌曲
  const playSong = async (song: Song) => {
    try {
      const response = await fetch(`https://music-api.gdstudio.xyz/song/url?id=${song.id}`)
      const data = await response.json()
      if (data.code === 200 && data.data?.[0]?.url) {
        const songWithUrl = { ...song, url: data.data[0].url }
        setCurrentSong(songWithUrl)
        setIsPlaying(true)
        
        // 添加到播放列表
        if (!playlist.find(s => s.id === song.id)) {
          setPlaylist([...playlist, songWithUrl])
          setCurrentIndex(playlist.length)
        } else {
          setCurrentIndex(playlist.findIndex(s => s.id === song.id))
        }
      }
    } catch (error) {
      console.error('获取播放链接失败:', error)
    }
  }

  // 播放控制
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const playNext = () => {
    if (playlist.length > 0) {
      const nextIndex = (currentIndex + 1) % playlist.length
      setCurrentIndex(nextIndex)
      playSong(playlist[nextIndex])
    }
  }

  const playPrev = () => {
    if (playlist.length > 0) {
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length
      setCurrentIndex(prevIndex)
      playSong(playlist[prevIndex])
    }
  }

  // 进度更新
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    const handleEnded = () => {
      playNext()
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSong, playlist, currentIndex])

  // 音量控制
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        togglePlay()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying])

  return (
    <>
      {/* 音频元素 */}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* 迷你播放器条 */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'
      }`}>
        {/* 展开的全屏播放器 */}
        {isOpen && (
          <div className="bg-black/95 backdrop-blur-xl border-t border-white/10 h-[calc(100vh-80px)] flex flex-col">
            {/* 关闭按钮 */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            <div className="flex-1 flex">
              {/* 左侧：当前播放 */}
              <div className="flex-1 flex flex-col items-center justify-center p-12">
                {currentSong ? (
                  <>
                    <div className="relative w-80 h-80 mb-8">
                      <img
                        src={currentSong.cover}
                        alt={currentSong.name}
                        className={`w-full h-full object-cover rounded-2xl shadow-2xl ${isPlaying ? 'animate-pulse' : ''}`}
                        style={{ animationDuration: '3s' }}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 text-center">{currentSong.name}</h2>
                    <p className="text-white/60 text-lg mb-8">{currentSong.artist}</p>

                    {/* 进度条 */}
                    <div className="w-full max-w-md mb-6">
                      <div className="flex items-center gap-3 text-white/40 text-sm mb-2">
                        <span>{formatTime((progress / 100) * (currentSong.duration || 0))}</span>
                        <span className="flex-1" />
                        <span>{formatTime(currentSong.duration || 0)}</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* 控制按钮 */}
                    <div className="flex items-center gap-8">
                      <button
                        onClick={playPrev}
                        className="p-3 text-white/60 hover:text-white transition-colors"
                      >
                        <SkipBack className="w-8 h-8" />
                      </button>
                      <button
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                      >
                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                      </button>
                      <button
                        onClick={playNext}
                        className="p-3 text-white/60 hover:text-white transition-colors"
                      >
                        <SkipForward className="w-8 h-8" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-white/40">
                    <ListMusic className="w-24 h-24 mx-auto mb-4" />
                    <p className="text-xl">暂无播放歌曲</p>
                    <p className="text-sm mt-2">搜索歌曲开始播放</p>
                  </div>
                )}
              </div>

              {/* 右侧：搜索和播放列表 */}
              <div className="w-96 border-l border-white/10 flex flex-col">
                {/* 搜索 */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex gap-2">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchSongs()}
                      placeholder="搜索歌曲..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                    />
                    <button
                      onClick={searchSongs}
                      disabled={isSearching}
                      className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 搜索结果 / 播放列表 */}
                <div className="flex-1 overflow-y-auto">
                  {/* 切换标签 */}
                  <div className="flex border-b border-white/10">
                    <button
                      onClick={() => setShowPlaylist(false)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        !showPlaylist ? 'text-white border-b-2 border-white' : 'text-white/40'
                      }`}
                    >
                      搜索结果
                    </button>
                    <button
                      onClick={() => setShowPlaylist(true)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        showPlaylist ? 'text-white border-b-2 border-white' : 'text-white/40'
                      }`}
                    >
                      播放列表 ({playlist.length})
                    </button>
                  </div>

                  {/* 列表内容 */}
                  <div className="p-4 space-y-2">
                    {(showPlaylist ? playlist : searchResults).map((song) => (
                      <button
                        key={song.id}
                        onClick={() => playSong(song)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                          currentSong?.id === song.id
                            ? 'bg-white/10'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <img
                          src={song.cover}
                          alt={song.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            currentSong?.id === song.id ? 'text-pink-400' : 'text-white'
                          }`}>
                            {song.name}
                          </p>
                          <p className="text-white/40 text-sm truncate">{song.artist}</p>
                        </div>
                        {currentSong?.id === song.id && isPlaying && (
                          <div className="flex gap-0.5">
                            <div className="w-1 h-4 bg-pink-500 animate-pulse" style={{ animationDelay: '0ms' }} />
                            <div className="w-1 h-4 bg-pink-500 animate-pulse" style={{ animationDelay: '150ms' }} />
                            <div className="w-1 h-4 bg-pink-500 animate-pulse" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </button>
                    ))}
                    {isSearching && (
                      <div className="text-center py-8 text-white/40">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2" />
                        搜索中...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 底部迷你控制条 */}
        <div className="bg-black/90 backdrop-blur-xl border-t border-white/10 h-20 flex items-center px-6 gap-4">
          {/* 展开按钮 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronUp className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 歌曲信息 */}
          {currentSong ? (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={currentSong.cover}
                alt={currentSong.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{currentSong.name}</p>
                <p className="text-white/40 text-sm truncate">{currentSong.artist}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-white/40 text-sm">
              点击展开搜索音乐
            </div>
          )}

          {/* 控制按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={playPrev}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={playNext}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* 音量控制 */}
          <div className="flex items-center gap-2 w-32">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 为底部播放器留出空间 */}
      <div className="h-20" />
    </>
  )
}
