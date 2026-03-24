import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Menu, X, Globe, Settings } from 'lucide-react'
import { languages } from '../i18n'

const navItems = [
  { to: '/', labelKey: 'nav.works' },
  { to: '/articles', labelKey: 'nav.articles' },
  { to: '/tags', labelKey: 'nav.tags' },
  { to: '/about', labelKey: 'nav.about' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [dark, setDark] = useState(() =>
    typeof window !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  )
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const location = useLocation()
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setLangOpen(false)
  }, [location])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('i18nextLng', code)
    setLangOpen(false)
  }

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'nav-glass shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center transition-transform group-hover:rotate-3">
                <span className="text-white dark:text-zinc-900 text-xs font-bold font-display tracking-tighter">色</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold font-display tracking-tight text-zinc-900 dark:text-white">
                  色计社
                </span>
                <span className="text-[10px] text-zinc-400 tracking-widest uppercase">
                  Panda Studio
                </span>
              </div>
            </NavLink>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Admin Link */}
              <Link
                to="/admin"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
                aria-label="Admin"
                title="后台管理"
              >
                <Settings size={18} />
              </Link>

              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
                  aria-label="Language"
                >
                  <Globe size={18} />
                </button>
                {langOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 max-h-80 overflow-y-auto glass-heavy rounded-xl p-2 shadow-xl animate-fade-in">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                          lang.code === i18n.language
                            ? 'bg-accent text-white'
                            : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span>{lang.nativeName}</span>
                        <span className="text-xs opacity-60">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
                aria-label="Toggle theme"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                aria-label="Menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-16 left-4 right-4 glass-heavy rounded-2xl p-4 shadow-xl transition-all duration-300 ${
            menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}
