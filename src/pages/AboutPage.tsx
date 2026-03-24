import { useEffect, useState } from 'react'
import { MapPin, Briefcase, Sparkles, ArrowUpRight, Heart } from 'lucide-react'

const skills = [
  '品牌视觉设计', '字体排印', '平面设计', '包装设计',
  '运动图形', 'UI/UX', '插画', '编辑设计',
  '数字艺术', '图像处理', 'Figma', 'Adobe CC',
]

const timeline = [
  {
    year: '2025',
    title: '自由设计师',
    desc: '专注品牌视觉与字体设计，服务多家国内外品牌客户。',
  },
  {
    year: '2023',
    title: '色计社创始人',
    desc: '创立设计教育内容账号，聚焦设计教程与创作分享。',
  },
  {
    year: '2021',
    title: '高级平面设计师',
    desc: '在某知名创意设计机构担任高级设计师，主导多个国际品牌项目。',
  },
  {
    year: '2018',
    title: '视觉传达设计学士',
    desc: '毕业于某艺术设计院校，获视觉传达设计学士学位。',
  },
]

export default function AboutPage() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero section */}
      <div
        className={`mb-20 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-36 h-36 rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-200 to-zinc-400 dark:from-zinc-700 dark:to-zinc-900">
                <img
                  src="https://picsum.photos/seed/panda/400/400"
                  alt="Panda"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-lg">
                <Sparkles size={14} className="text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">
              About
            </p>
            <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-gradient leading-none mb-6">
              派大星 / Panda
            </h1>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                China
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase size={14} />
                Freelance Designer
              </span>
              <span className="flex items-center gap-1.5">
                <Heart size={14} />
                色计社创始人
              </span>
            </div>

            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                Hi，我是大星，一个在颜色和字体之间游走的平面设计师。
                主要方向是品牌视觉、字体排印和数字艺术，偶尔也做 UI 和动态设计。
              </p>
              <p>
                我相信好设计从不解释自己——它直接打中你，让你心跳加速半拍。
                我一直在追求那种感觉：有质感、有温度，同时又绝对精准。
              </p>
              <p>
                2023 年创立了<strong className="text-zinc-900 dark:text-white">色计社</strong>，
                开始在小红书分享设计教程和创作过程。
                如果你也是设计爱好者，欢迎来找我聊聊。
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="mailto:hello@pandastudio.design"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity duration-200 cursor-pointer"
              >
                Get in Touch
                <ArrowUpRight size={14} />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:text-zinc-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
              >
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <section
        className={`mb-16 transition-all duration-700 delay-150 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-5">
          Skills & Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="tag-pill">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section
        className={`mb-16 transition-all duration-700 delay-200 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-8">
          Experience
        </h2>
        <div className="relative">
          <div className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-zinc-100 dark:bg-zinc-800" />
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="w-16 text-right flex-shrink-0 pt-0.5">
                  <span className="text-xs font-mono font-medium text-zinc-400">
                    {item.year}
                  </span>
                </div>
                <div className="relative flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 group-hover:border-accent transition-colors duration-200" />
                </div>
                <div className="flex-1 pb-2">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Currently */}
      <section
        className={`transition-all duration-700 delay-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">
            Currently
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { label: 'Working on', value: '一个新的字体项目 + 品牌视觉合集' },
              { label: 'Learning', value: '3D 建模 & 动态设计进阶' },
              { label: 'Listening to', value: '周杰伦 / Daft Punk / Max Richter' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-zinc-400 mb-1">{label}</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-snug">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
