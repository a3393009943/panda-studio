import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Tag, FileText, Layers, TrendingUp } from 'lucide-react'
import { allTags, works, articles } from '../data'

export default function TagsPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [visible, setVisible] = useState(false)
  const activeTag = searchParams.get('tag') || ''
  const tags = allTags()

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const filteredWorks = activeTag
    ? works.filter(w => w.tags.includes(activeTag))
    : []
  const filteredArticles = activeTag
    ? articles.filter(a => a.tags.includes(activeTag))
    : []

  const selectTag = (tag: string) => {
    if (tag === activeTag) {
      setSearchParams({})
    } else {
      setSearchParams({ tag })
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div
        className={`mb-12 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">
          Browse
        </p>
        <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-gradient leading-none mb-4">
          Tags
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
          通过标签浏览所有作品和文章，找到你感兴趣的内容。
        </p>
      </div>

      {/* Stats */}
      <div
        className={`grid grid-cols-3 gap-4 mb-10 transition-all duration-700 delay-100 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {[
          { icon: Layers, label: 'Works', value: works.length },
          { icon: FileText, label: 'Articles', value: articles.length },
          { icon: TrendingUp, label: 'Tags', value: tags.length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass rounded-2xl p-5 text-center">
            <Icon size={20} className="mx-auto mb-2 text-zinc-400" />
            <div className="text-2xl font-black font-display text-zinc-900 dark:text-white">{value}</div>
            <div className="text-xs text-zinc-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* All Tags */}
      <div
        className={`mb-12 transition-all duration-700 delay-150 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">
          All Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => selectTag(name)}
              className={`tag-pill cursor-pointer ${activeTag === name ? 'active' : ''}`}
            >
              <Tag size={10} />
              {name}
              <span className={`ml-1 tabular-nums ${activeTag === name ? 'text-accent' : 'text-zinc-400'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Results */}
      {activeTag && (
        <div
          className={`transition-all duration-500 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-lg font-bold font-display text-zinc-900 dark:text-white">
              # {activeTag}
            </h2>
            <span className="text-sm text-zinc-400">
              {filteredWorks.length + filteredArticles.length} 个结果
            </span>
            <button
              onClick={() => setSearchParams({})}
              className="ml-auto text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              清除筛选
            </button>
          </div>

          {filteredWorks.length > 0 && (
            <section className="mb-10">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                Works ({filteredWorks.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorks.map(work => (
                  <div
                    key={work.id}
                    className="group relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">{work.category}</p>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug">{work.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filteredArticles.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                Articles ({filteredArticles.length})
              </h3>
              <div className="space-y-3">
                {filteredArticles.map(article => (
                  <Link
                    key={article.id}
                    to={`/articles/${article.slug}`}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer group"
                  >
                    <FileText size={16} className="text-zinc-300 dark:text-zinc-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-accent transition-colors duration-200 mb-1">
                        {article.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1">{article.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {filteredWorks.length === 0 && filteredArticles.length === 0 && (
            <div className="text-center py-16 text-zinc-400">
              该标签暂无内容
            </div>
          )}
        </div>
      )}
    </div>
  )
}
