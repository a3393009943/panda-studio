import { useState } from 'react'
import { Music2, X, ChevronUp, ChevronDown } from 'lucide-react'

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNetease, setShowNetease] = useState(false)

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

          {/* 歌曲信息提示 */}
          <div className="flex-1 flex items-center gap-2 text-white/30">
            <Music2 className="w-4 h-4" />
            <span className="text-sm">点击展开播放音乐</span>
          </div>
        </div>

        {/* 展开的全屏播放器 */}
        {isOpen && (
          <div className="bg-gradient-to-b from-gray-900 to-black border-t border-white/10 h-[calc(100vh-80px)] flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
            {/* 顶部栏 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">音乐播放器</h2>
                  <p className="text-white/40 text-sm">网易云音乐</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNetease(true)}
                  className="px-4 py-2 bg-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-2"
                >
                  <Music2 className="w-4 h-4" />
                  打开网易云音乐
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-white/5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  title="收起"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 flex items-center justify-center p-8">
              {!showNetease ? (
                <div className="text-center text-white/30">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                    <Music2 className="w-16 h-16" />
                  </div>
                  <p className="text-xl mb-2">欢迎使用音乐播放器</p>
                  <p className="text-sm mb-6">点击上方按钮打开网易云音乐</p>
                  <p className="text-xs text-white/20">支持搜索、播放、歌词显示等功能</p>
                </div>
              ) : (
                <div className="w-full h-full bg-black/30 rounded-2xl overflow-hidden">
                  <iframe
                    src="https://music.163.com/outchain/player?type=0&id=0&auto=0&height=66&bg=fafafa&text=333&mini=0"
                    className="w-full h-full"
                    allow="autoplay"
                    frameBorder="0"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 为底部播放器留出空间 */}
      <div className="h-20" />
    </>
  )
}
