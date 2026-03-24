import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Calendar, Tag, Download, Image } from 'lucide-react'
import { works } from '../data'

export default function WorkDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [visible, setVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const work = works.find(w => w.id === id)

  useEffect(() => {
    if (!work) return
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [work])

  if (!work) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">作品未找到</h1>
          <Link to="/" className="text-accent hover:underline">返回首页</Link>
        </div>
      </div>
    )
  }

  const galleryImages = work.images && work.images.length > 0 
    ? [work.image, ...work.images] 
    : [work.image]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div 
        className="relative h-[60vh] overflow-hidden"
      >
        <img
          src={work.image}
          alt={work.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-8 left-4 sm:left-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={18} /> 返回
        </Link>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium border border-white/30">
                {work.category}
              </span>
              <span className="text-white/80 text-sm flex items-center gap-1">
                <Calendar size={14} /> {work.year}
              </span>
              {work.client && (
                <span className="text-white/60 text-sm">Client: {work.client}</span>
              )}
              {work.featured && (
                <span className="px-3 py-1 rounded-full bg-accent text-white text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black font-display text-white mb-4 leading-tight">
              {work.title}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
              {work.description}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Image size={20} /> 项目图集
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {galleryImages.map((img, index) => (
              <div 
                key={index}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img}
                  alt={`${work.title} - ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap gap-2">
          {work.tags.map(tag => (
            <Link
              key={tag}
              to={`/tags?tag=${encodeURIComponent(tag)}`}
              className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-accent hover:text-white transition-colors flex items-center gap-1"
            >
              <Tag size={12} /> {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Attachments */}
      {work.attachments && work.attachments.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Download size={20} /> 附件下载
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {work.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                download
                className="flex items-center gap-3 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Download size={18} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-zinc-500 uppercase">{attachment.type}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* External Link */}
      {work.link && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-zinc-200 dark:border-zinc-800">
          <a
            href={work.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:bg-accent transition-colors"
          >
            查看线上版本 <ExternalLink size={18} />
          </a>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  )
}
