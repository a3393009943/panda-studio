import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Settings, Plus, Edit, Trash2, Save, X, 
  Image, FileText, Tag, Upload, ArrowLeft, Check,
  BarChart3, Globe, Monitor, Smartphone, Tablet, Clock,
  Eye, EyeOff, Link as LinkIcon, Mail, Phone, MapPin,
  Building, Lock, Shield, Database, Palette, Bell,
  ChevronRight, LockOpen, LogOut, LayoutGrid, FileEdit
} from 'lucide-react'
import { works as initialWorks, articles as initialArticles } from '../data'
import type { Work, Article } from '../types'

// ==================== 类型定义 ====================

type Tab = 'dashboard' | 'pages' | 'works' | 'articles' | 'settings' | 'security'

interface Page {
  id: string
  title: string
  slug: string
  content: string
  metaTitle: string
  metaDescription: string
  updated: string
}

interface SiteSettings {
  siteName: string
  siteDescription: string
  siteKeywords: string
  authorName: string
  authorBio: string
  email: string
  phone: string
  location: string
  github: string
  twitter: string
  instagram: string
  behance: string
  dribbble: string
  logoUrl: string
  faviconUrl: string
  defaultLanguage: string
  defaultTheme: 'light' | 'dark' | 'system'
  enableAnalytics: boolean
}

const defaultSettings: SiteSettings = {
  siteName: '色计社 × Panda Studio',
  siteDescription: 'Design is how it works. 一个专注于品牌设计、视觉传达的设计工作室。',
  siteKeywords: '设计,品牌设计,视觉设计,平面设计,插画',
  authorName: 'Panda',
  authorBio: '平面设计师，热爱色彩与形式。',
  email: 'hello@panda.studio',
  phone: '',
  location: '',
  github: '',
  twitter: '',
  instagram: '',
  behance: '',
  dribbble: '',
  logoUrl: '',
  faviconUrl: '',
  defaultLanguage: 'zh',
  defaultTheme: 'dark',
  enableAnalytics: false,
}

// 默认页面内容
const defaultPages: Page[] = [
  {
    id: 'home',
    title: '首页',
    slug: 'home',
    content: '<h1>欢迎访问 Panda Studio</h1><p>这里是首页内容...</p>',
    metaTitle: 'Panda Studio - 品牌设计工作室',
    metaDescription: 'Design is how it works. 一个专注于品牌设计、视觉传达的设计工作室。',
    updated: new Date().toISOString()
  },
  {
    id: 'about',
    title: '关于',
    slug: 'about',
    content: '<h1>关于我们</h1><p>这里是关于页面内容...</p>',
    metaTitle: '关于 - Panda Studio',
    metaDescription: '了解 Panda Studio 的故事和团队',
    updated: new Date().toISOString()
  },
  {
    id: 'contact',
    title: '联系',
    slug: 'contact',
    content: '<h1>联系我们</h1><p>这里是联系页面内容...</p>',
    metaTitle: '联系我们 - Panda Studio',
    metaDescription: '欢迎联系 Panda Studio',
    updated: new Date().toISOString()
  }
]

// 分析数据
const analyticsData = {
  overview: { totalVisitors: 12847, pageViews: 34521, avgDuration: '2:34', bounceRate: '32%' },
  regions: [
    { name: '中国', visitors: 5234, percent: 41 },
    { name: '美国', visitors: 2847, percent: 22 },
    { name: '日本', visitors: 1523, percent: 12 },
    { name: '韩国', visitors: 982, percent: 8 },
    { name: '德国', visitors: 756, percent: 6 },
    { name: '其他', visitors: 505, percent: 11 },
  ],
  devices: [
    { type: 'Desktop', visitors: 6423, percent: 50, icon: Monitor },
    { type: 'Mobile', visitors: 5147, percent: 40, icon: Smartphone },
    { type: 'Tablet', visitors: 1277, percent: 10, icon: Tablet },
  ],
  pages: [
    { path: '/', title: '首页', views: 12453, avgDuration: '1:23' },
    { path: '/works/1', title: '作品详情-A', views: 3241, avgDuration: '3:45' },
    { path: '/works/2', title: '作品详情-B', views: 2891, avgDuration: '2:56' },
    { path: '/articles', title: '文章列表', views: 2134, avgDuration: '2:12' },
    { path: '/about', title: '关于', views: 1876, avgDuration: '1:45' },
  ],
  recentActivity: [
    { time: '2分钟前', region: '中国·北京', device: 'Mobile', page: '首页' },
    { time: '5分钟前', region: '美国·洛杉矶', device: 'Desktop', page: '作品详情-A' },
    { time: '8分钟前', region: '日本·东京', device: 'Mobile', page: '文章列表' },
  ],
}

// ==================== 组件：侧边栏 ====================

function Sidebar({ 
  activeTab, 
  onTabChange,
  onLogout 
}: { 
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  onLogout: () => void
}) {
  const menuGroups = [
    {
      title: '内容管理',
      items: [
        { id: 'dashboard' as Tab, label: '数据概览', icon: LayoutGrid },
        { id: 'pages' as Tab, label: '页面管理', icon: FileText },
        { id: 'works' as Tab, label: '作品管理', icon: Image },
        { id: 'articles' as Tab, label: '文章管理', icon: FileEdit },
      ]
    },
    {
      title: '系统设置',
      items: [
        { id: 'settings' as Tab, label: '网站设置', icon: Settings },
        { id: 'security' as Tab, label: '安全设置', icon: Shield },
      ]
    }
  ]

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      {/* Logo 区域 */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-zinc-900 font-bold">P</span>
          </div>
          <div>
            <h1 className="font-bold text-sm">后台管理</h1>
            <p className="text-xs text-zinc-400">Panda Studio</p>
          </div>
        </div>
      </div>

      {/* 菜单 */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuGroups.map(group => (
          <div key={group.title}>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 px-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-accent/10 text-accent'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                  {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* 底部 */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={18} />
          退出登录
        </button>
      </div>
    </aside>
  )
}

// ==================== 组件：登录页面 ====================

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    await new Promise(r => setTimeout(r, 500))
    
    const storedPassword = localStorage.getItem('admin_password') || 'panda2026'
    if (password === storedPassword) {
      localStorage.setItem('admin_logged_in', 'true')
      onLogin()
    } else {
      setError('密码错误，请重试')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-200 flex items-center justify-center">
              <Lock size={32} className="text-white dark:text-zinc-900" />
            </div>
            <h1 className="text-2xl font-bold mb-2">后台管理</h1>
            <p className="text-zinc-500">请输入访问密码</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入访问密码"
                className="w-full px-4 py-3 pr-12 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:bg-accent transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? '验证中...' : '进入后台'}
            </button>
          </form>
        </div>
        
        <p className="mt-6 text-center text-sm text-zinc-500">
          默认密码：panda2026
        </p>
      </div>
    </div>
  )
}

// ==================== 组件：图片上传 ====================

function ImageUploader({ 
  images, 
  onChange, 
  multiple = false,
  maxImages = 10,
  recommendSize = '1920x1080'
}: { 
  images: string[]
  onChange: (images: string[]) => void
  multiple?: boolean
  maxImages?: number
  recommendSize?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newImages: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= maxImages) break
      
      const file = files[i]
      const reader = new FileReader()
      
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      
      newImages.push(base64)
    }
    
    if (multiple) {
      onChange([...images, ...newImages].slice(0, maxImages))
    } else {
      onChange(newImages.slice(0, 1))
    }
    
    setIsUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">推荐尺寸：{recommendSize}</span>
        {multiple && (
          <span className="text-xs text-zinc-400">{images.length}/{maxImages} 张</span>
        )}
      </div>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div 
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl p-6 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all"
      >
        {isUploading ? (
          <div className="flex items-center justify-center gap-2 text-zinc-500">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span>上传中...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <Upload size={24} />
            <span className="text-sm">点击上传图片</span>
          </div>
        )}
      </div>
      
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-zinc-100">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== 组件：富文本编辑器 ====================

function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null)

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  const handleBlur = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  const tools = [
    { command: 'bold', label: 'B', title: '粗体', className: 'font-bold' },
    { command: 'italic', label: 'I', title: '斜体', className: 'italic' },
    { command: 'underline', label: 'U', title: '下划线', className: 'underline' },
    { type: 'divider' },
    { command: 'formatBlock', value: 'h2', label: 'H1', title: '标题1' },
    { command: 'formatBlock', value: 'h3', label: 'H2', title: '标题2' },
    { command: 'formatBlock', value: 'p', label: 'P', title: '段落' },
    { type: 'divider' },
    { command: 'insertUnorderedList', label: '•', title: '无序列表' },
    { command: 'insertOrderedList', label: '1.', title: '有序列表' },
    { type: 'divider' },
    { command: 'createLink', label: '🔗', title: '插入链接', action: () => {
      const url = prompt('请输入链接地址:')
      if (url) execCommand('createLink', url)
    }},
    { command: 'justifyLeft', label: '⬅', title: '左对齐' },
    { command: 'justifyCenter', label: '⬌', title: '居中' },
    { command: 'justifyRight', label: '➡', title: '右对齐' },
  ]

  return (
    <div className="border border-zinc-300 dark:border-zinc-600 rounded-xl overflow-hidden">
      <div className="flex items-center gap-1 p-2 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex-wrap">
        {tools.map((tool, i) => (
          tool.type === 'divider' ? (
            <span key={i} className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => tool.action ? tool.action() : execCommand(tool.command!, tool.value)}
              className={`p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-sm min-w-[32px] ${tool.className || ''}`}
              title={tool.title}
            >
              {tool.label}
            </button>
          )
        ))}
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        onBlur={handleBlur}
        className="min-h-[300px] p-4 bg-white dark:bg-zinc-900 focus:outline-none prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  )
}

// ==================== 组件：数据概览 ====================

function Dashboard({ data }: { data: typeof analyticsData }) {
  const stats = [
    { label: '总访客', value: data.overview.totalVisitors.toLocaleString(), icon: Globe, color: 'bg-blue-500' },
    { label: '页面浏览', value: data.overview.pageViews.toLocaleString(), icon: Eye, color: 'bg-green-500' },
    { label: '平均停留', value: data.overview.avgDuration, icon: Clock, color: 'bg-purple-500' },
    { label: '跳出率', value: data.overview.bounceRate, icon: LogOut, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">数据概览</h2>
        <span className="text-sm text-zinc-500">数据更新于 2 分钟前</span>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 地区分布 */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
          <h3 className="font-bold mb-4">地区分布</h3>
          <div className="space-y-3">
            {data.regions.map((region) => (
              <div key={region.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{region.name}</span>
                  <span className="text-zinc-500">{region.visitors.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${region.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 设备分布 */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
          <h3 className="font-bold mb-4">设备分布</h3>
          <div className="grid grid-cols-3 gap-4">
            {data.devices.map((device) => (
              <div key={device.type} className="text-center p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                <device.icon size={24} className="mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{device.percent}%</p>
                <p className="text-sm text-zinc-500">{device.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 页面分析 */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-bold mb-4">页面分析</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-zinc-200 dark:border-zinc-700">
                <th className="pb-3 font-medium">页面</th>
                <th className="pb-3 font-medium">浏览量</th>
                <th className="pb-3 font-medium">平均停留</th>
              </tr>
            </thead>
            <tbody>
              {data.pages.map((page) => (
                <tr key={page.path} className="border-b border-zinc-100 dark:border-zinc-700/50">
                  <td className="py-3">
                    <span className="font-medium">{page.title}</span>
                    <span className="text-xs text-zinc-400 ml-2">{page.path}</span>
                  </td>
                  <td className="py-3">{page.views.toLocaleString()}</td>
                  <td className="py-3">{page.avgDuration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ==================== 组件：作品编辑器 ====================

function WorkEditor({ work, isCreating, onSave, onCancel }: { 
  work: Work; isCreating: boolean; onSave: (work: Work) => void; onCancel: () => void 
}) {
  const [form, setForm] = useState(work)
  const [tagsInput, setTagsInput] = useState(work.tags.join(', '))
  const [images, setImages] = useState<string[]>(work.image ? [work.image] : [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...form, image: images[0] || '', tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) })
  }

  const categories = [
    { value: 'Branding', label: 'Branding 品牌设计' },
    { value: 'Poster', label: 'Poster 海报' },
    { value: 'Typography', label: 'Typography 字体设计' },
    { value: 'Packaging', label: 'Packaging 包装设计' },
    { value: 'Motion', label: 'Motion 动态设计' },
    { value: 'Editorial', label: 'Editorial 出版设计' },
    { value: 'Art', label: 'Art 艺术创作' },
    { value: 'UI/UX', label: 'UI/UX 用户界面' },
  ]

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">{isCreating ? '添加新作品' : '编辑作品'}</h3>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">封面图片</label>
          <ImageUploader images={images} onChange={setImages} multiple={false} recommendSize="1920x1080 (16:9)" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">标题 *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">分类</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900">
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">描述</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">年份</label>
            <input type="number" value={form.year} onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">客户</label>
            <input type="text" value={form.client || ''} onChange={e => setForm({ ...form, client: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">项目链接</label>
            <input type="url" value={form.link || ''} onChange={e => setForm({ ...form, link: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" placeholder="https://" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">标签（逗号分隔）</label>
            <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" placeholder="品牌设计, 包装" />
          </div>
          <div className="md:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="featured" checked={form.featured || false} onChange={e => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4" />
            <label htmlFor="featured" className="text-sm">设为精选作品（显示在首页轮播）</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-zinc-500 hover:text-zinc-900">取消</button>
        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90">
          <Save size={18} /> 保存
        </button>
      </div>
    </form>
  )
}

// ==================== 组件：文章编辑器 ====================

function ArticleEditor({ article, isCreating, onSave, onCancel }: { 
  article: Article; isCreating: boolean; onSave: (article: Article) => void; onCancel: () => void 
}) {
  const [form, setForm] = useState(article)
  const [tagsInput, setTagsInput] = useState(article.tags.join(', '))
  const [coverImage, setCoverImage] = useState<string[]>(article.cover ? [article.cover] : [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...form,
      cover: coverImage[0] || '',
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">{isCreating ? '添加新文章' : '编辑文章'}</h3>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">封面图片</label>
          <ImageUploader images={coverImage} onChange={setCoverImage} multiple={false} recommendSize="1200x630" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">标题 *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" placeholder="my-article" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">摘要</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" rows={2} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">文章内容</label>
            <RichTextEditor value={form.content} onChange={v => setForm({ ...form, content: v })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">发布日期</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">阅读时长（分钟）</label>
            <input type="number" value={form.readTime} onChange={e => setForm({ ...form, readTime: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">标签（逗号分隔）</label>
            <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-zinc-500 hover:text-zinc-900">取消</button>
        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90">
          <Save size={18} /> 保存
        </button>
      </div>
    </form>
  )
}

// ==================== 组件：网站设置 ====================

function SettingsPage({ settings, onSave }: { settings: SiteSettings; onSave: (s: SiteSettings) => void }) {
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const SettingSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <Icon size={18} className="text-accent" /> {title}
      </h3>
      {children}
    </div>
  )

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">网站设置</h2>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90">
          {saved ? <><Check size={18} /> 已保存</> : <><Save size={18} /> 保存设置</>}
        </button>
      </div>

      <SettingSection title="基本信息" icon={Building}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">网站名称</label>
            <input type="text" value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" /></div>
          <div><label className="block text-sm font-medium mb-1">网站描述</label>
            <textarea value={form.siteDescription} onChange={e => setForm({ ...form, siteDescription: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" rows={3} /></div>
          <div><label className="block text-sm font-medium mb-1">SEO 关键词</label>
            <input type="text" value={form.siteKeywords} onChange={e => setForm({ ...form, siteKeywords: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" placeholder="用逗号分隔" /></div>
        </div>
      </SettingSection>

      <SettingSection title="Logo 与图标" icon={Image}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-2">网站 Logo</label>
            <ImageUploader images={form.logoUrl ? [form.logoUrl] : []} onChange={imgs => setForm({ ...form, logoUrl: imgs[0] || '' })} multiple={false} recommendSize="400x400" /></div>
          <div><label className="block text-sm font-medium mb-2">Favicon</label>
            <ImageUploader images={form.faviconUrl ? [form.faviconUrl] : []} onChange={imgs => setForm({ ...form, faviconUrl: imgs[0] || '' })} multiple={false} recommendSize="64x64" /></div>
        </div>
      </SettingSection>

      <SettingSection title="作者信息" icon={Settings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">作者名称</label>
            <input type="text" value={form.authorName} onChange={e => setForm({ ...form, authorName: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">个人简介</label>
            <textarea value={form.authorBio} onChange={e => setForm({ ...form, authorBio: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" rows={3} /></div>
        </div>
      </SettingSection>

      <SettingSection title="联系方式" icon={Mail}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">邮箱</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" /></div>
          <div><label className="block text-sm font-medium mb-1">电话</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">地址</label>
            <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" /></div>
        </div>
      </SettingSection>

      <SettingSection title="社交媒体" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['github', 'twitter', 'instagram', 'behance', 'dribbble'].map(site => (
            <div key={site}><label className="block text-sm font-medium mb-1 capitalize">{site}</label>
              <input type="url" value={form[site as keyof SiteSettings] as string || ''} onChange={e => setForm({ ...form, [site]: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900" placeholder={`https://${site}.com/username`} /></div>
          ))}
        </div>
      </SettingSection>

      <SettingSection title="偏好设置" icon={Palette}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-2">默认语言</label>
            <select value={form.defaultLanguage} onChange={e => setForm({ ...form, defaultLanguage: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900">
              <option value="zh">中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </select></div>
          <div><label className="block text-sm font-medium mb-2">默认主题</label>
            <div className="flex gap-3">
              {(['light', 'dark', 'system'] as const).map(theme => (
                <button key={theme} type="button" onClick={() => setForm({ ...form, defaultTheme: theme })}
                  className={`flex-1 p-3 border-2 rounded-lg transition-colors ${
                    form.defaultTheme === theme ? 'border-accent bg-accent/10' : 'border-zinc-200 dark:border-zinc-700 hover:border-accent'
                  }`}>
                  {theme === 'light' && '☀️ 浅色'}
                  {theme === 'dark' && '🌙 深色'}
                  {theme === 'system' && '💻 跟随系统'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingSection>

      {saved && <p className="text-green-600 text-center">✓ 设置已保存</p>}
    </div>
  )
}

// ==================== 组件：页面管理 ====================

function PagesEditor({ pages, onSave }: { pages: Page[]; onSave: (pages: Page[]) => void }) {
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSavePage = (page: Page) => {
    if (isCreating) {
      onSave([...pages, { ...page, id: Date.now().toString(), updated: new Date().toISOString() }])
    } else {
      onSave(pages.map(p => p.id === page.id ? { ...page, updated: new Date().toISOString() } : p))
    }
    setEditingPage(null)
    setIsCreating(false)
  }

  const handleDeletePage = (id: string) => {
    if (confirm('确定删除这个页面吗？')) {
      onSave(pages.filter(p => p.id !== id))
    }
  }

  if (editingPage) {
    return (
      <form onSubmit={(e) => {
        e.preventDefault()
        handleSavePage(editingPage)
      }} className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{isCreating ? '添加新页面' : '编辑页面'}</h2>
          <button
            type="button"
            onClick={() => { setEditingPage(null); setIsCreating(false) }}
            className="px-4 py-2 text-zinc-500 hover:text-zinc-900"
          >
            取消
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">页面标题</label>
            <input
              type="text"
              value={editingPage.title}
              onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug (URL路径)</label>
            <input
              type="text"
              value={editingPage.slug}
              onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900"
              placeholder="about"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">页面内容</label>
            <RichTextEditor value={editingPage.content} onChange={v => setEditingPage({ ...editingPage, content: v })} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta 标题</label>
            <input
              type="text"
              value={editingPage.metaTitle}
              onChange={e => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900"
              placeholder="页面标题 - 网站名称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta 描述</label>
            <textarea
              value={editingPage.metaDescription}
              onChange={e => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900"
              rows={3}
              placeholder="页面描述，用于SEO"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => { setEditingPage(null); setIsCreating(false) }}
            className="px-4 py-2 text-zinc-500 hover:text-zinc-900"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90"
          >
            <Save size={18} /> 保存
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">页面管理 ({pages.length})</h2>
        <button
          onClick={() => {
            setEditingPage({
              id: '',
              title: '',
              slug: '',
              content: '',
              metaTitle: '',
              metaDescription: '',
              updated: new Date().toISOString()
            })
            setIsCreating(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-accent"
        >
          <Plus size={18} /> 添加页面
        </button>
      </div>

      <div className="space-y-3">
        {pages.map(page => (
          <div
            key={page.id}
            className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-bold">{page.title}</h3>
              <p className="text-sm text-zinc-500">/{page.slug}</p>
              <p className="text-xs text-zinc-400 mt-1">更新于: {new Date(page.updated).toLocaleDateString('zh-CN')}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingPage(page); setIsCreating(false) }}
                className="p-2 text-zinc-500 hover:text-accent"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDeletePage(page.id)}
                className="p-2 text-zinc-500 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== 组件：安全设置 ====================

function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const storedPassword = localStorage.getItem('admin_password') || '123456'
    
    if (currentPassword !== storedPassword) {
      setMessage({ type: 'error', text: '当前密码错误' })
      return
    }

    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: '新密码至少4位' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '两次密码不一致' })
      return
    }

    localStorage.setItem('admin_password', newPassword)
    setMessage({ type: 'success', text: '密码修改成功！' })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold">安全设置</h2>

      {/* 修改密码 */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Lock size={18} className="text-accent" /> 修改管理员密码
        </h3>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">当前密码</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900"
                required
              />
              <button type="button" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">新密码</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900"
                required
              />
              <button type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-zinc-400 mt-1">至少 4 位字符</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">确认新密码</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900"
                required
              />
              <button type="button" onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
              {message.text}
            </p>
          )}

          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90">
            <LockOpen size={18} /> 修改密码
          </button>
        </form>
      </div>

      {/* 安全提示 */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Shield size={18} className="text-yellow-600" /> 安全建议
        </h3>
        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
          <li>• 建议使用强密码，包含字母、数字和特殊字符</li>
          <li>• 定期更换密码，避免使用简单或重复的密码</li>
          <li>• 不要在公共场合或不安全的网络下登录后台</li>
          <li>• 记住修改后的密码，忘记需要重新部署才能重置</li>
        </ul>
      </div>

      {/* 登出所有设备 */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <LogOut size={18} className="text-accent" /> 设备管理
        </h3>
        <p className="text-sm text-zinc-500 mb-4">
          当前登录状态保存在浏览器本地存储中。在其他设备登录后，建议清除浏览器缓存以确保安全。
        </p>
        <button
          onClick={() => {
            localStorage.removeItem('admin_logged_in')
            window.location.reload()
          }}
          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-500 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={18} /> 退出当前登录
        </button>
      </div>
    </div>
  )
}

// ==================== 主组件 ====================

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('admin_logged_in') === 'true')
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [works, setWorks] = useState<Work[]>(initialWorks)
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [pages, setPages] = useState<Page[]>(() => {
    const saved = localStorage.getItem('site_pages')
    return saved ? JSON.parse(saved) : defaultPages
  })
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('site_settings')
    return saved ? JSON.parse(saved) : defaultSettings
  })
  const [editingWork, setEditingWork] = useState<Work | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleSaveSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings)
    localStorage.setItem('site_settings', JSON.stringify(newSettings))
  }

  const handleSaveWork = (work: Work) => {
    if (isCreating) setWorks([...works, { ...work, id: Date.now().toString() }])
    else setWorks(works.map(w => w.id === work.id ? work : w))
    setEditingWork(null)
    setIsCreating(false)
  }

  const handleDeleteWork = (id: string) => {
    if (confirm('确定删除这个作品吗？')) setWorks(works.filter(w => w.id !== id))
  }

  const handleSaveArticle = (article: Article) => {
    if (isCreating) setArticles([...articles, { ...article, id: Date.now().toString() }])
    else setArticles(articles.map(a => a.id === article.id ? article : a))
    setEditingArticle(null)
    setIsCreating(false)
  }

  const handleDeleteArticle = (id: string) => {
    if (confirm('确定删除这篇文章吗？')) setArticles(articles.filter(a => a.id !== id))
  }

  const handleSavePages = (newPages: Page[]) => {
    setPages(newPages)
    localStorage.setItem('site_pages', JSON.stringify(newPages))
  }

  const exportData = () => {
    const data = { works, articles, settings, pages }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `panda-studio-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={analyticsData} />

      case 'pages':
        return <PagesEditor pages={pages} onSave={handleSavePages} />

      case 'works':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">作品管理 ({works.length})</h2>
              <button onClick={() => {
                setEditingWork({ id: '', title: '', description: '', category: 'Branding', tags: [], image: '', year: 2025, featured: false })
                setIsCreating(true)
              }} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-accent">
                <Plus size={18} /> 添加作品
              </button>
            </div>
            {editingWork && <WorkEditor work={editingWork} isCreating={isCreating} onSave={handleSaveWork} onCancel={() => { setEditingWork(null); setIsCreating(false) }} />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {works.map(work => (
                <div key={work.id} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden group">
                  <div className="aspect-video bg-zinc-100 relative">
                    <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
                    {work.featured && <span className="absolute top-2 right-2 px-2 py-1 bg-accent text-white text-xs rounded">精选</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold truncate">{work.title}</h3>
                    <p className="text-sm text-zinc-500">{work.category} · {work.year}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {work.tags.slice(0, 2).map(tag => <span key={tag} className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 rounded">{tag}</span>)}
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-700">
                      <button onClick={() => { setEditingWork(work); setIsCreating(false) }} className="flex-1 py-1.5 text-sm text-zinc-500 hover:text-accent hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded">编辑</button>
                      <button onClick={() => handleDeleteWork(work.id)} className="flex-1 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">删除</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'articles':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">文章管理 ({articles.length})</h2>
              <button onClick={() => {
                setEditingArticle({ id: '', title: '', slug: '', excerpt: '', content: '', tags: [], date: new Date().toISOString().split('T')[0], readTime: 5, cover: '' })
                setIsCreating(true)
              }} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-accent">
                <Plus size={18} /> 添加文章
              </button>
            </div>
            {editingArticle && <ArticleEditor article={editingArticle} isCreating={isCreating} onSave={handleSaveArticle} onCancel={() => { setEditingArticle(null); setIsCreating(false) }} />}
            <div className="space-y-3">
              {articles.map(article => (
                <div key={article.id} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  {article.cover && <img src={article.cover} alt={article.title} className="w-16 h-16 object-cover rounded-lg bg-zinc-100" />}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{article.title}</h3>
                    <p className="text-sm text-zinc-500">{article.date} · {article.readTime} 分钟阅读</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingArticle(article); setIsCreating(false) }} className="p-2 text-zinc-500 hover:text-accent"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteArticle(article.id)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'settings':
        return <SettingsPage settings={settings} onSave={handleSaveSettings} />
      
      case 'security':
        return <SecurityPage />
      
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
