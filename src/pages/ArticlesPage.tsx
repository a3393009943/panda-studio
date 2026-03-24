import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, Tag, ArrowRight } from 'lucide-react'
import { articles } from '../data'

export default function ArticlesPage() {
  const { t, i18n } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  const formatDate = (dateStr: string) => {
    const locale = i18n.language === 'zh' ? 'zh-CN' : i18n.language
    return new Date(dateStr).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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
          Writing
        </p>
        <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-gradient leading-none mb-4">
          {t('articles.title')}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
          {t('articles.subtitle')}
        </p>
      </div>

      {/* Article List */}
      <div className="space-y-0">
        {articles.map((article, i) => (
          <Link
            key={article.id}
            to={`/articles/${article.slug}`}
            className={`group block border-b border-zinc-100 dark:border-zinc-800/50 py-8 transition-all duration-700 cursor-pointer ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${i * 80 + 100}ms` }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {article.cover && (
                <div className="w-full md:w-48 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <time className="text-xs text-zinc-400 font-medium">
                    {formatDate(article.date)}
                  </time>
                  <span className="flex items-center gap-1 text-xs text-zinc-400">
                    <Clock size={11} />
                    {article.readTime} {t('articles.minRead')}
                  </span>
                </div>

                <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-white mb-2 group-hover:text-accent transition-colors duration-200 leading-snug">
                  {article.title}
                </h2>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map(tag => (
                      <span key={tag} className="tag-pill py-0.5 text-[10px]">
                        <Tag size={9} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-zinc-300 dark:text-zinc-600 group-hover:text-accent group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
