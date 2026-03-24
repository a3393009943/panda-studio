import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import type { Work } from '../types'
import { works } from '../data'

// 轮播图组件 - 大通栏
function HeroSlider({ works, onSlideChange }: { works: Work[]; onSlideChange: (work: Work) => void }) {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCurrent(c => (c + 1) % works.length)
    }, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [works.length])

  useEffect(() => {
    onSlideChange(works[current])
  }, [current, works, onSlideChange])

  const prev = () => setCurrent(c => (c - 1 + works.length) % works.length)
  const next = () => setCurrent(c => (c + 1) % works.length)

  return (
    <div 
      className="relative h-[75vh] w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {works.map((work, index) => (
        <div
          key={work.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={work.image}
              alt={work.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl">
              {/* 分类和年份 */}
              <div className="flex items-center gap-3 mb-5">
                <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/30">
                  {work.category}
                </span>
                <span className="text-white/70 text-sm">{work.year}</span>
                {work.featured && (
                  <span className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>

              {/* 标题 */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-5 leading-tight tracking-tight">
                {work.title}
              </h1>

              {/* 描述 */}
              <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
                {work.description}
              </p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-8">
                {work.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 查看详情按钮 */}
              <Link
                to={`/works/${work.id}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all hover:scale-105"
              >
                查看详情 <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* 左右导航箭头 */}
      <button
        onClick={prev}
        className={`absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronLeft size={26} />
      </button>
      <button
        onClick={next}
        className={`absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronRight size={26} />
      </button>

      {/* 底部指示点 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
        {works.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === current 
                ? 'bg-white w-10' 
                : 'bg-white/40 hover:bg-white/60 w-2'
            }`}
          />
        ))}
      </div>

      {/* 向下滚动提示 */}
      <div className="absolute bottom-8 right-8 text-white/60 text-sm flex items-center gap-2 animate-bounce">
        <span>向下滚动</span>
        <ChevronRight className="rotate-90" size={16} />
      </div>
    </div>
  )
}

// 瀑布流网格组件
function WorksGrid({ works }: { works: Work[] }) {
  const { t } = useTranslation()
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {works.map(work => (
          <Link
            key={work.id}
            to={`/works/${work.id}`}
            className="group relative overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-white/70">
                  {work.category}
                </span>
                <span className="text-white/30">·</span>
                <span className="text-xs text-white/70">{work.year}</span>
              </div>
              <h3 className="text-white font-bold text-xl leading-tight">
                {work.title}
              </h3>
            </div>
            {work.featured && (
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-white text-black text-xs font-medium">
                  {t('common.featured')}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function WorksPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(works.map(w => w.category)))]
  const filtered = activeCategory === 'All'
    ? works
    : works.filter(w => w.category === activeCategory)

  const handleSlideChange = (_work: Work) => {
    // 可以根据当前轮播作品更新分类
  }

  return (
    <div className="min-h-screen">
      {/* 大通栏轮播 - 始终显示 */}
      <HeroSlider works={filtered.slice(0, 6)} onSlideChange={handleSlideChange} />

      {/* 标题和控制区 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">
              {t('works.portfolio')}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              {t('works.title')}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
              {t('works.subtitle')}
            </p>
          </div>
        </div>

        {/* 分类筛选标签 */}
        <div className="flex flex-wrap gap-2.5 mt-7">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 瀑布流网格 - 始终显示 */}
      <WorksGrid works={filtered} />

      {/* 空状态 */}
      {filtered.length === 0 && (
        <div className="text-center py-24 text-zinc-400">
          暂无该分类的作品
        </div>
      )}
    </div>
  )
}
