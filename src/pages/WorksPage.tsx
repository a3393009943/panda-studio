import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, ArrowRight, Layers, Grid3X3 } from 'lucide-react'
import type { Work } from '../types'
import { works } from '../data'

type ViewMode = 'slider' | 'grid'

function WorkSlider({ works, onSlideChange }: { works: Work[]; onSlideChange: (work: Work) => void }) {
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

  // Notify parent of slide change
  useEffect(() => {
    onSlideChange(works[current])
  }, [current, works, onSlideChange])

  const prev = () => setCurrent(c => (c - 1 + works.length) % works.length)
  const next = () => setCurrent(c => (c + 1) % works.length)

  return (
    <div 
      className="relative h-[70vh] sm:h-[80vh] w-full overflow-hidden"
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/30">
                  {work.category}
                </span>
                <span className="text-white/60 text-sm">{work.year}</span>
                {work.featured && (
                  <span className="px-3 py-1 rounded-full bg-accent/80 text-white text-xs font-medium">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-5xl sm:text-7xl font-black font-display text-white mb-6 leading-tight">
                {work.title}
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
                {work.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {work.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to={`/works/${work.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-full font-medium hover:bg-white/90 transition-colors"
              >
                查看详情 <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <button
        onClick={prev}
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {works.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current 
                ? 'bg-white w-8' 
                : 'bg-white/40 hover:bg-white/60 w-2'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 right-6 text-white/60 text-sm flex items-center gap-1 animate-bounce">
        <span>向下滚动</span>
        <ChevronRight className="rotate-90" size={16} />
      </div>
    </div>
  )
}

function WorksGrid({ works }: { works: Work[] }) {
  const { t } = useTranslation()
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map(work => (
          <Link
            key={work.id}
            to={`/works/${work.id}`}
            className="group relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">
                  {work.category}
                </span>
                <span className="text-white/30">·</span>
                <span className="text-[10px] text-white/60">{work.year}</span>
              </div>
              <h3 className="text-white font-bold font-display text-lg leading-tight">
                {work.title}
              </h3>
            </div>
            {work.featured && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded-full bg-accent/90 text-white text-[10px] font-medium">
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
  const [view, setView] = useState<ViewMode>('slider')
  const [activeCategory, setActiveCategory] = useState('All')
  
  const categories = ['All', ...Array.from(new Set(works.map(w => w.category)))]
  const filtered = activeCategory === 'All' 
    ? works 
    : works.filter(w => w.category === activeCategory)

  const handleSlideChange = (_work: Work) => {
    // Can be used to update category filter based on current slide
  }

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      {view === 'slider' && (
        <WorkSlider works={filtered.slice(0, 6)} onSlideChange={handleSlideChange} />
      )}

      {/* Controls & Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">
              {t('works.portfolio')}
            </p>
            <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-gradient leading-none mb-4">
              {t('works.title')}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
              {t('works.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-1 glass rounded-xl p-1 self-start">
            <button
              onClick={() => setView('slider')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                view === 'slider'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
              title="Slider view"
            >
              <Layers size={16} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                view === 'grid'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
              title="Grid view"
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`tag-pill ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Works Grid */}
      {view === 'grid' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <WorksGrid works={filtered} />
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-24 text-zinc-400">
          暂无该分类的作品
        </div>
      )}
    </div>
  )
}
