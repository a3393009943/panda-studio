import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Clock, Tag, Calendar } from 'lucide-react'
import { articles } from '../data'

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  const article = articles.find(a => a.slug === slug)

  useEffect(() => {
    if (!article) return navigate('/articles', { replace: true })
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [article, navigate])

  if (!article) return null

  const related = articles
    .filter(a => a.id !== article.id && a.tags.some(t => article.tags.includes(t)))
    .slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex gap-12 lg:gap-16 relative">
        {/* Main Content */}
        <div
          className={`flex-1 min-w-0 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Back */}
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200 mb-8 cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Articles
          </Link>

          {/* Cover */}
          {article.cover && (
            <div className="w-full overflow-hidden rounded-2xl mb-10 bg-zinc-100 dark:bg-zinc-800">
              <img
                src={article.cover}
                alt={article.title}
                className="w-full h-56 sm:h-80 object-cover"
              />
            </div>
          )}

          {/* Meta */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar size={12} />
              {new Date(article.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock size={12} />
              {article.readTime} 分钟阅读
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-10 pb-10 border-b border-zinc-100 dark:border-zinc-800">
            {article.tags.map(tag => (
              <Link
                key={tag}
                to={`/tags?tag=${encodeURIComponent(tag)}`}
                className="tag-pill"
              >
                <Tag size={10} />
                {tag}
              </Link>
            ))}
          </div>

          {/* Markdown Content */}
          <div className="prose prose-zinc dark:prose-invert prose-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={`hidden lg:block w-72 flex-shrink-0 transition-all duration-700 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="sticky top-24 space-y-6">
            {/* TOC placeholder */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/tags?tag=${encodeURIComponent(tag)}`}
                    className="tag-pill"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {related.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                  Related Articles
                </h3>
                <div className="space-y-4">
                  {related.map(r => (
                    <Link
                      key={r.id}
                      to={`/articles/${r.slug}`}
                      className="block group cursor-pointer"
                    >
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-accent transition-colors duration-200 leading-snug mb-1">
                        {r.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Clock size={10} />
                        {r.readTime} 分钟
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
