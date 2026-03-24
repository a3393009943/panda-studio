import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Search, ListMusic, X, ChevronUp, ChevronDown, Music, Radio, Disc } from 'lucide-react'

interface Song {
  id: string
  name: string
  artist: string
  album: string
  cover: string
  url: string
  duration: number
  platform: string
}

interface LyricsLine {
  time: number
  text: string
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
  const [lyrics, setLyrics] = useState<LyricsLine[]>([])
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0)
  const [showLyrics, setShowLyrics] = useState(false)
  const [coverRotation, setCoverRotation] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const animationRef = useRef<number>()

  // 多平台搜索 - 使用多个可用API
  const searchSongs = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setSearchResults([])
    
    const query = encodeURIComponent(searchQuery)
    const results: Song[] = []

    // 尝试多个API源
    const apis = [
      // API 1: 小鱼音乐
      async () => {
        const res = await fetch(`https://api.xywm.ltd/163/music/search?key=${query}&limit=20`)
        const data = await res.json()
        if (data.code === 200 && data.data?.songs) {
          return data.data.songs.map((s: any) => ({
            id: `netease-${s.id}`,
            name: s.name,
            artist: s.ar?.map((a: any) => a.name).join(', ') || '未知歌手',
            album: s.al?.name || '未知专辑',
            cover: s.al?.picUrl || '',
            url: '',
            duration: Math.floor(s.dt / 1000) || 180,
            platform: '网易云'
          }))
        }
        return []
      },
      // API 2: 备用接口
      async () => {
        const res = await fetch(`https://api.wuxianxian.com/music/search?keywords=${query}&limit=15`)
        const data = await res.json()
        if (data.result?.songs) {
          return data.result.songs.map((s: any) => ({
            id: `netease-${s.id}`,
            name: s.name,
            artist: s.artists?.[0]?.name || '未知歌手',
            album: s.album?.name || '未知专辑',
            cover: s.album?.picUrl || '',
            url: '',
            duration: Math.floor(s.duration / 1000) || 180,
            platform: '网易云'
          }))
        }
        return []
      }
    ]

    // 依次尝试API，直到有一个成功
    for (const api of apis) {
      try {
        const songs = await api()
        if (songs.length > 0) {
          results.push(...songs)
          break
        }
      } catch (error) {
        console.log('API尝试失败，切换下一个:', error)
        continue
      }
    }

    setSearchResults(results)
    setIsSearching(false)
  }

  // 获取播放链接
  const getPlayUrl = async (song: Song): Promise<string> => {
    // 如果已有URL直接返回
    if (song.url) return song.url
    
    if (song.platform === '网易云') {
      const neteaseId = song.id.replace('netease-', '')
      
      // 尝试多个API获取播放链接
      const apis = [
        async () => {
          const res = await fetch(`https://api.xywm.ltd/163/music/url?id=${neteaseId}`)
          const data = await res.json()
          return data.data?.[0]?.url || ''
        },
        async () => {
          const res = await fetch(`https://api.wuxianxian.com/music/url?id=${neteaseId}`)
          const data = await res.json()
          return data.data?.[0]?.url || ''
        }
      ]
      
      for (const api of apis) {
        try {
          const url = await api()
          if (url) return url
        } catch (error) {
          continue
        }
      }
    }
    return ''
  }

  // 获取歌词
  const fetchLyrics = async (song: Song) => {
    if (song.platform === '网易云') {
      const neteaseId = song.id.replace('netease-', '')
      
      const apis = [
        async () => {
          const res = await fetch(`https://api.xywm.ltd/163/music/lyric?id=${neteaseId}`)
          const data = await res.json()
          return data.lrc?.lyric || data.lyric || ''
        },
        async () => {
          const res = await fetch(`https://api.wuxianxian.com/music/lyric?id=${neteaseId}`)
          const data = await res.json()
          return data.lrc?.lyric || ''
        }
      ]
      
      for (const api of apis) {
        try {
          const lyric = await api()
          if (lyric) {
            const parsed = parseLyrics(lyric)
            setLyrics(parsed)
            return
          }
        } catch (error) {
          continue
        }
      }
    }
    setLyrics([{ time: 0, text: '暂无歌词' }])
  }

  // 解析歌词
  const parseLyrics = (lyricText: string): LyricsLine[] => {
    const lines = lyricText.split('\n')
    const lyrics: LyricsLine[] = []
    
    for (const line of lines) {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/)
      if (match) {
        const minutes = parseInt(match[1])
        const seconds = parseInt(match[2])
        const ms = parseInt(match[3].padEnd(3, '0'))
        const time = minutes * 60 + seconds + ms / 1000
        const text = match[4].trim()
        if (text) {
          lyrics.push({ time, text })
        }
      }
    }
    
    return lyrics.length > 0 ? lyrics : [{ time: 0, text: '纯音乐，请欣赏' }]
  }

  // 播放歌曲
  const playSong = async (song: Song) => {
    const url = await getPlayUrl(song)
    if (url) {
      const songWithUrl = { ...song, url }
      setCurrentSong(songWithUrl)
      setIsPlaying(true)
      fetchLyrics(song)
      
      if (!playlist.find(s => s.id === song.id)) {
        setPlaylist([...playlist, songWithUrl])
        setCurrentIndex(playlist.length)
      } else {
        setCurrentIndex(playlist.findIndex(s => s.id === song.id))
      }
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

  // 更新歌词位置
  const updateLyricIndex = useCallback((currentTime: number) => {
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        setCurrentLyricIndex(i)
        break
      }
    }
  }, [lyrics])

  // 进度更新
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      const progress = (audio.currentTime / audio.duration) * 100 || 0
      setProgress(progress)
      updateLyricIndex(audio.currentTime)
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
  }, [currentSong, playlist, currentIndex, updateLyricIndex])

  // 封面旋转动画
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCoverRotation(prev => (prev + 0.5) % 360)
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  // 音量控制
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // 歌词滚动
  useEffect(() => {
    if (lyricsRef.current && showLyrics) {
      const activeLine = lyricsRef.current.children[currentLyricIndex] as HTMLElement
      if (activeLine) {
        activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentLyricIndex, showLyrics])

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
          <div className="bg-gradient-to-b from-gray-900 to-black backdrop-blur-xl border-t border-white/10 h-[calc(100vh-80px)] flex flex-col">
            {/* 顶部搜索栏 */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
              <div className="flex items-center gap-4 flex-1 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchSongs()}
                    placeholder="搜索歌曲、歌手、专辑..."
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  />
                </div>
                <button
                  onClick={searchSongs}
                  disabled={isSearching}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSearching ? '搜索中...' : '搜索'}
                </button>
              </div>
              
              {/* 关闭按钮 */}
              <button
                onClick={() => setIsOpen(false)}
                className="ml-6 p-3 bg-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* 左侧：当前播放 */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                {currentSong ? (
                  <>
                    {/* 黑胶唱片效果 */}
                    <div className="relative mb-8">
                      {/* 外圈光晕 */}
                      <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-500 ${isPlaying ? 'opacity-40' : 'opacity-20'}`}
                        style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
                      />
                      
                      {/* 唱片 */}
                      <div 
                        className="relative w-72 h-72 rounded-full overflow-hidden shadow-2xl"
                        style={{ transform: `rotate(${coverRotation}deg)` }}
                      >
                        {/* 唱片纹理 */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 to-black" />
                        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-700 to-gray-900" />
                        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800" />
                        
                        {/* 封面 */}
                        <div className="absolute inset-12 rounded-full overflow-hidden">
                          <img
                            src={currentSong.cover}
                            alt={currentSong.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* 中心孔 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-black border-4 border-gray-700" />
                        </div>
                      </div>
                      
                      {/* 平台标识 */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs text-white/60">
                        {currentSong.platform}
                      </div>
                    </div>

                    {/* 歌曲信息 */}
                    <h2 className="text-3xl font-bold text-white mb-2 text-center">{currentSong.name}</h2>
                    <p className="text-white/50 text-lg mb-2">{currentSong.artist}</p>
                    <p className="text-white/30 text-sm mb-8">{currentSong.album}</p>

                    {/* 进度条 */}
                    <div className="w-full max-w-md mb-8">
                      <div className="flex items-center gap-3 text-white/40 text-sm mb-3">
                        <span className="w-12 text-right">{formatTime((progress / 100) * (currentSong.duration || 0))}</span>
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const percent = (e.clientX - rect.left) / rect.width
                            if (audioRef.current) {
                              audioRef.current.currentTime = percent * (currentSong.duration || 0)
                            }
                          }}
                        >
                          <div
                            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full transition-all duration-100 group-hover:shadow-lg group-hover:shadow-pink-500/30"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="w-12">{formatTime(currentSong.duration || 0)}</span>
                      </div>
                    </div>

                    {/* 控制按钮 */}
                    <div className="flex items-center gap-6">
                      <button
                        onClick={playPrev}
                        className="p-4 text-white/40 hover:text-white transition-all hover:scale-110"
                      >
                        <SkipBack className="w-8 h-8" />
                      </button>
                      <button
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-pink-500/30"
                      >
                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                      </button>
                      <button
                        onClick={playNext}
                        className="p-4 text-white/40 hover:text-white transition-all hover:scale-110"
                      >
                        <SkipForward className="w-8 h-8" />
                      </button>
                    </div>

                    {/* 歌词切换 */}
                    <button
                      onClick={() => setShowLyrics(!showLyrics)}
                      className="mt-8 px-6 py-2 bg-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    >
                      {showLyrics ? '隐藏歌词' : '显示歌词'}
                    </button>
                  </>
                ) : (
                  <div className="text-center text-white/30">
                    <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                      <Music className="w-20 h-20" />
                    </div>
                    <p className="text-xl">暂无播放歌曲</p>
                    <p className="text-sm mt-2">在上方搜索歌曲开始播放</p>
                  </div>
                )}

                {/* 歌词浮层 */}
                {showLyrics && currentSong && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black via-black/98 to-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-12 z-10 animate-in fade-in duration-500">
                    {/* 背景光效 */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div 
                        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] animate-pulse"
                        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)' }}
                      />
                    </div>
                    
                    <button
                      onClick={() => setShowLyrics(false)}
                      className="absolute top-6 right-6 p-3 bg-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all hover:rotate-90 duration-300 z-20"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    
                    {/* 歌曲信息头部 */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20">
                      <p className="text-white/80 text-lg font-medium tracking-wide">{currentSong.name}</p>
                      <p className="text-white/40 text-sm">{currentSong.artist}</p>
                    </div>
                    
                    <div 
                      ref={lyricsRef}
                      className="flex-1 overflow-y-auto w-full max-w-2xl space-y-8 py-32 scrollbar-hide mask-gradient"
                      style={{ 
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none',
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                      }}
                    >
                      {lyrics.map((line, index) => {
                        const distance = Math.abs(index - currentLyricIndex)
                        const isActive = index === currentLyricIndex
                        const isNear = distance === 1
                        
                        return (
                          <p
                            key={index}
                            className={`text-center transition-all duration-700 ease-out cursor-pointer hover:text-white transform ${
                              isActive
                                ? 'text-3xl font-bold text-white scale-110 drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]'
                                : isNear
                                ? 'text-xl text-white/60 scale-100'
                                : distance === 2
                                ? 'text-lg text-white/30 scale-95'
                                : 'text-base text-white/15 scale-90'
                            }`}
                            style={{
                              opacity: isActive ? 1 : isNear ? 0.7 : distance === 2 ? 0.4 : 0.2,
                              transform: `translateY(${isActive ? 0 : isNear ? 5 : distance * 3}px) scale(${isActive ? 1.1 : isNear ? 1 : 0.95})`,
                              textShadow: isActive ? '0 0 40px rgba(236,72,153,0.6), 0 0 80px rgba(139,92,246,0.3)' : 'none',
                              filter: isActive ? 'blur(0px)' : `blur(${Math.min(distance * 0.5, 2)}px)`
                            }}
                            onClick={() => {
                              if (audioRef.current) {
                                audioRef.current.currentTime = line.time
                              }
                            }}
                          >
                            {line.text}
                          </p>
                        )
                      })}
                    </div>
                    
                    {/* 底部提示 */}
                    <div className="absolute bottom-6 text-white/20 text-xs flex items-center gap-2 animate-pulse">
                      <span>点击歌词跳转</span>
                      <span className="w-1 h-1 rounded-full bg-white/30" />
                      <span>空格键播放/暂停</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 右侧：搜索结果和播放列表 */}
              <div className="w-96 border-l border-white/5 flex flex-col bg-black/20">
                {/* 切换标签 */}
                <div className="flex border-b border-white/5">
                  <button
                    onClick={() => setShowPlaylist(false)}
                    className={`flex-1 py-4 text-sm font-medium transition-all relative ${
                      !showPlaylist ? 'text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Search className="w-4 h-4" />
                      搜索结果
                    </span>
                    {!showPlaylist && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowPlaylist(true)}
                    className={`flex-1 py-4 text-sm font-medium transition-all relative ${
                      showPlaylist ? 'text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ListMusic className="w-4 h-4" />
                      播放列表 ({playlist.length})
                    </span>
                    {showPlaylist && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500" />
                    )}
                  </button>
                </div>

                {/* 列表内容 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center py-12 text-white/40">
                      <div className="w-10 h-10 border-3 border-white/20 border-t-pink-500 rounded-full animate-spin mb-4" />
                      <p>正在搜索...</p>
                    </div>
                  ) : (showPlaylist ? playlist : searchResults).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-white/30">
                      <Disc className="w-16 h-16 mb-4" />
                      <p>{showPlaylist ? '播放列表为空' : '搜索歌曲开始播放'}</p>
                    </div>
                  ) : (
                    (showPlaylist ? playlist : searchResults).map((song) => (
                      <button
                        key={song.id}
                        onClick={() => playSong(song)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${
                          currentSong?.id === song.id
                            ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={song.cover}
                            alt={song.name}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                          {currentSong?.id === song.id && isPlaying && (
                            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                              <div className="flex gap-0.5">
                                <div className="w-1 h-4 bg-pink-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                                <div className="w-1 h-4 bg-pink-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                                <div className="w-1 h-4 bg-pink-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            currentSong?.id === song.id ? 'text-pink-400' : 'text-white group-hover:text-white'
                          }`}>
                            {song.name}
                          </p>
                          <p className="text-white/40 text-sm truncate">{song.artist}</p>
                        </div>
                        <span className="text-xs text-white/30 px-2 py-1 bg-white/5 rounded">
                          {song.platform}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 底部迷你控制条 */}
        <div className="bg-black/80 backdrop-blur-xl border-t border-white/5 h-20 flex items-center px-6 gap-4">
          {/* 展开按钮 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white/40 hover:text-white transition-all hover:scale-110"
          >
            <ChevronUp className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 歌曲信息 */}
          {currentSong ? (
            <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => setIsOpen(true)}>
              <div className="relative">
                <img
                  src={currentSong.cover}
                  alt={currentSong.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-3 bg-white animate-pulse" style={{ animationDelay: '0ms' }} />
                      <div className="w-0.5 h-3 bg-white animate-pulse" style={{ animationDelay: '100ms' }} />
                      <div className="w-0.5 h-3 bg-white animate-pulse" style={{ animationDelay: '200ms' }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{currentSong.name}</p>
                <p className="text-white/40 text-sm truncate">{currentSong.artist}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-white/30 text-sm flex items-center gap-2">
              <Radio className="w-4 h-4" />
              点击展开搜索音乐
            </div>
          )}

          {/* 控制按钮 */}
          <div className="flex items-center gap-1">
            <button
              onClick={playPrev}
              className="p-2 text-white/40 hover:text-white transition-all hover:scale-110"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-pink-500/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={playNext}
              className="p-2 text-white/40 hover:text-white transition-all hover:scale-110"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* 音量控制 */}
          <div className="flex items-center gap-2 w-28 group">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const newVolume = (e.clientX - rect.left) / rect.width
                setVolume(Math.max(0, Math.min(1, newVolume)))
                setIsMuted(false)
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all group-hover:shadow-lg group-hover:shadow-pink-500/30"
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
