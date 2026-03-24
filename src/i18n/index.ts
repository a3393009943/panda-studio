import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// All supported languages
export const languages = [
  { code: 'zh', name: '中文', nativeName: '中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
]

const resources = {
  en: {
    translation: {
      nav: {
        works: 'Works',
        articles: 'Articles',
        tags: 'Tags',
        about: 'About',
      },
      works: {
        portfolio: 'Portfolio',
        title: 'Selected Works',
        subtitle: 'Graphic design, brand visual, typography and digital art. Tell stories through design, perceive the world through color.',
        viewDetail: 'View Detail',
        categories: {
          all: 'All',
          branding: 'Branding',
          poster: 'Poster',
          typography: 'Typography',
          packaging: 'Packaging',
          motion: 'Motion',
          editorial: 'Editorial',
          art: 'Art',
          uiux: 'UI/UX',
        },
      },
      workDetail: {
        back: 'Back',
        gallery: 'Gallery',
        attachments: 'Attachments',
        download: 'Download',
        viewOnline: 'View Online',
        notFound: 'Work not found',
      },
      articles: {
        title: 'Articles',
        subtitle: 'Design thoughts, tutorials and insights.',
        readMore: 'Read More',
        minRead: 'min read',
      },
      tags: {
        title: 'Tags',
        subtitle: 'Explore works and articles by topic.',
        works: 'works',
        articles: 'articles',
      },
      about: {
        title: 'About',
        subtitle: 'The designer behind 色计社.',
        role: '平面设计师 & 创意总监',
        bio: '专注于品牌视觉设计、字体排印与数字艺术。相信设计不仅是视觉呈现，更是传达情感与故事的媒介。',
        skills: 'Skills',
        timeline: 'Timeline',
        currently: 'Currently',
        currentlyWorking: 'Available for freelance projects',
        contact: 'Contact',
      },
      common: {
        featured: 'Featured',
        year: 'Year',
        client: 'Client',
      },
    },
  },
  zh: {
    translation: {
      nav: {
        works: '作品',
        articles: '文章',
        tags: '标签',
        about: '关于',
      },
      works: {
        portfolio: '作品集',
        title: '精选作品',
        subtitle: '平面设计、品牌视觉、字体排印与数字艺术。用设计讲故事，用颜色感知世界。',
        viewDetail: '查看详情',
        categories: {
          all: '全部',
          branding: '品牌设计',
          poster: '海报',
          typography: '字体设计',
          packaging: '包装',
          motion: '动态设计',
          editorial: '编辑设计',
          art: '艺术',
          uiux: 'UI/UX',
        },
      },
      workDetail: {
        back: '返回',
        gallery: '图集',
        attachments: '附件下载',
        download: '下载',
        viewOnline: '查看线上版本',
        notFound: '作品未找到',
      },
      articles: {
        title: '文章',
        subtitle: '设计思考、教程与见解。',
        readMore: '阅读全文',
        minRead: '分钟阅读',
      },
      tags: {
        title: '标签',
        subtitle: '按主题探索作品和文章。',
        works: '个作品',
        articles: '篇文章',
      },
      about: {
        title: '关于',
        subtitle: '色计社背后的设计师。',
        role: '平面设计师 & 创意总监',
        bio: '专注于品牌视觉设计、字体排印与数字艺术。相信设计不仅是视觉呈现，更是传达情感与故事的媒介。',
        skills: '技能',
        timeline: '时间线',
        currently: '当前',
        currentlyWorking: '接受自由项目委托',
        contact: '联系方式',
      },
      common: {
        featured: '精选',
        year: '年份',
        client: '客户',
      },
    },
  },
  ja: {
    translation: {
      nav: {
        works: 'ワークス',
        articles: '記事',
        tags: 'タグ',
        about: 'について',
      },
      works: {
        portfolio: 'ポートフォリオ',
        title: '精选作品',
        subtitle: 'グラフィックデザイン、ブランドビジュアル、タイポグラフィとデジタルアート。デザインを通じて物語を語り、色を通じて世界を感じる。',
        viewDetail: '詳細を見る',
        categories: {
          all: 'すべて',
          branding: 'ブランディング',
          poster: 'ポスター',
          typography: 'タイポグラフィ',
          packaging: 'パッケージ',
          motion: 'モーション',
          editorial: 'エディトリアル',
          art: 'アート',
          uiux: 'UI/UX',
        },
      },
      workDetail: {
        back: '戻る',
        gallery: 'ギャラリー',
        attachments: '添付ファイル',
        download: 'ダウンロード',
        viewOnline: 'オンラインで見る',
        notFound: '作品が見つかりません',
      },
      articles: {
        title: '記事',
        subtitle: 'デザイン思考、チュートリアルと洞察。',
        readMore: '続きを読む',
        minRead: '分',
      },
      tags: {
        title: 'タグ',
        subtitle: 'トピック別でワークスと記事を探索。',
        works: 'ワークス',
        articles: '記事',
      },
      about: {
        title: 'について',
        subtitle: '色計社の背后的デザイナー。',
        role: 'グラフィックデザイナー & クリエイティブディレクター',
        bio: 'ブランドビジュアル、タイポグラフィ、デジタルアートに集中。デザインは単なる視覚表現ではなく、感情とストーリーを伝えるメディアだと信じている。',
        skills: 'スキル',
        timeline: 'タイムライン',
        currently: '現在',
        currentlyWorking: 'フリーランス案件対応可能',
        contact: '連絡先',
      },
      common: {
        featured: '注目',
        year: '年',
        client: 'クライアント',
      },
    },
  },
  // Add more languages as needed...
}

// Get default language or from localStorage
const savedLang = typeof window !== 'undefined' 
  ? localStorage.getItem('i18nextLng') 
  : null

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang || 'zh', // default language
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
