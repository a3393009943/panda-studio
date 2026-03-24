// Types
export interface Attachment {
  name: string
  url: string
  type: 'image' | 'pdf' | 'video' | 'file'
}

export interface Work {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  image: string
  images?: string[]  // Additional gallery images
  year: number
  client?: string
  link?: string
  featured?: boolean
  attachments?: Attachment[]  // Downloadable files
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  date: string
  readTime: number
  cover?: string
}

export interface Tag {
  name: string
  count: number
}
