import { useState, useEffect } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'

interface Work {
  id: string
  title: string
  description: string
  image: string
  category: string
  year: string
  tags: string[]
  link?: string
}

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 加载作品数据
    const loadWorks = async () => {
      setIsLoading(true)
      try {
        // 这里可以替换为你的实际API或数据源
        const response = await fetch('/api/works.json')
        const data = await response.json()
        setWorks(data)
      } catch (error) {
        console.error('加载作品失败:', error)
        // 使用默认数据
        setWorks([
          {
            id: '1',
            title: '品牌设计',
            description: '为科技初创公司打造的品牌视觉系统',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
            category: '品牌',
            year: '2024',
            tags: ['品牌', 'Logo', 'VI']
          },
          {
            id: '2',
            title: 'UI/UX设计',
            description: '移动端金融App的用户体验优化',
            image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
            category: 'UI',
            year: '2024',
            tags: ['UI', 'UX', '移动端']
          },
          {
            id: '3',
            title: '包装设计',
            description: '高端化妆品系列的包装创新设计',
            image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=600&fit=crop',
            category: '包装',
            year: '2023',
            tags: ['包装', '印刷', '产品']
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadWorks()
  }, [])

  const categories = ['全部', ...Array.from(new Set(works.map(w => w.category)))]
  const filteredWorks = selectedCategory === '全部' 
    ? works 
    : works.filter(w => w.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* 顶部标题区 */}
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">
            作品集
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
            探索我的设计作品，涵盖品牌、UI/UX、包装等多个领域
          </p>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="sticky top-16 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${selectedCategory === category
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 作品网格 */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">暂无作品</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorks.map(work => (
              <a
                key={work.id}
                href={work.link || '#'}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-zinc-200/50 dark:group-hover:shadow-white/5">
                  {/* 图片 */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* 内容 */}
                  <div className="p-6">
                    {/* 分类标签 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium rounded-full">
                        {work.category}
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {work.year}
                      </span>
                    </div>

                    {/* 标题 */}
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                      {work.title}
                    </h2>

                    {/* 描述 */}
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {work.description}
                    </p>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 悬浮箭头 */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center shadow-lg">
                      <ArrowRight className="w-5 h-5 text-white dark:text-zinc-900" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* 底部 */}
      <div className="py-16 text-center">
        <a
          href="mailto:hello@panda-studio.com"
          className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <span>开始合作</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
