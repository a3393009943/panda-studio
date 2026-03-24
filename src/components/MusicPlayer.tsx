import { useState } from 'react'
import { Music2, ExternalLink, X, ChevronUp, ChevronDown, Play, Pause } from 'lucide-react'

// 精选歌单数据
const PLAYLISTS = [
  {
    id: '19723756',
    name: '飙升榜',
    description: '网易云音乐飙升榜',
    url: 'https://music.163.com/#/playlist?id=19723756'
  },
  {
    id: '3778678',
    name: '热歌榜',
    description: '网易云音乐热歌榜',
    url: 'https://music.163.com/#/playlist?id=3778678'
  },
  {
    id: '3779629',
    name: '新歌榜',
    description: '网易云音乐新歌榜',
    url: 'https://music.163.com/#/playlist?id=3779629'
  },
  {
    id: '2884035',
    name: '原创榜',
    description: '网易云音乐原创榜',
    url: 'https://music.163.com/#/playlist?id=2884035'
  }
]

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlaylist, setCurrentPlaylist] = useState(PLAYLISTS[0])

  return (
    <>
      {/* 底部迷你控制条 */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-black/80 backdrop-blur-xl border-t border-white/5 h-20 flex items-center px-6 gap-4">
          {/* 展开按钮 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white/40 hover:text-white transition-all hover:scale-110"
            title="展开播放器"
          >
            <ChevronUp className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 歌曲信息 */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium truncate">{currentPlaylist.name}</p>
              <p className="text-white/40 text-sm truncate">{currentPlaylist.description}</p>
            </div>
          </div>

          {/* 播放控制 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-pink-500/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* 展开的全屏播放器 */}
        {isOpen && (
          <div className="bg-gradient-to-b from-gray-900 to-black border-t border-white/10 h-[calc(100vh-80px)] flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
            {/* 顶部栏 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-lg">音乐播放器</h2>
                  <p className="text-white/40 text-sm">精选歌单</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://music.163.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  打开网易云音乐
                </a>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {/* 当前播放 */}
                <div className="mb-8">
                  <h3 className="text-white/60 text-sm mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full" />
                    当前播放
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-6 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Music2 className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-xl font-semibold mb-2">{currentPlaylist.name}</h4>
                      <p className="text-white/40 mb-4">{currentPlaylist.description}</p>
                      <div className="flex items-center gap-3">
                        <a
                          href={currentPlaylist.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          前往播放
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 歌单列表 */}
                <div>
                  <h3 className="text-white/60 text-sm mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full" />
                    推荐歌单
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PLAYLISTS.map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={() => setCurrentPlaylist(playlist)}
                        className={`p-4 rounded-xl transition-all text-left group ${
                          currentPlaylist.id === playlist.id
                            ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Music2 className={`w-8 h-8 ${currentPlaylist.id === playlist.id ? 'text-pink-400' : 'text-white/40'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium truncate ${currentPlaylist.id === playlist.id ? 'text-pink-400' : 'text-white'}`}>
                              {playlist.name}
                            </h4>
                            <p className="text-white/40 text-sm truncate">{playlist.description}</p>
                          </div>
                          {currentPlaylist.id === playlist.id && (
                            <div className="flex gap-0.5">
                              <div className="w-1 h-4 bg-pink-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                              <div className="w-1 h-4 bg-pink-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                              <div className="w-1 h-4 bg-pink-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 提示 */}
                <div className="mt-8 p-4 bg-white/5 rounded-xl">
                  <p className="text-white/40 text-sm text-center">
                    点击歌单后，点击"前往播放"按钮会在新标签页打开网易云音乐进行播放
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 为底部播放器留出空间 */}
      <div className="h-20" />
    </>
  )
}
