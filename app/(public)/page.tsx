import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Barack Mining Investment | Construire des opportunités, créer une valeur durable',
  description:
    'Barack Mining Investment accompagne les opportunités minières, les projets, les investisseurs et les partenaires dans une démarche responsable et durable.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Barack Mining Investment',
    description:
      'Expertise minière stratégique, partenariats et développement responsable.',
    type: 'website',
    locale: 'fr_FR',
  },
}

type NewsItem = {
  id: string
  title: string
  slug: string
  category:
    | 'corporate'
    | 'operations'
    | 'projects'
    | 'communities'
    | 'partnerships'
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  created_at: string
}

export default async function HomePage() {
  const supabase = await createClient()

  let news: NewsItem[] = []

  try {
    const { data, error } = await supabase
      .from('news')
      .select(
        'id,title,slug,category,excerpt,cover_image_url,published_at,created_at'
      )
      .eq('status', 'published')
      .order('published_at', {
        ascending: false,
        nullsFirst: false,
      })
      .limit(3)

    if (!error && data) {
      news = data as NewsItem[]
    }
  } catch (error) {
    console.error(
      'Erreur lors du chargement des actualités de la page d’accueil :',
      error
    )
  }

  return <HomeClient news={news} />
}