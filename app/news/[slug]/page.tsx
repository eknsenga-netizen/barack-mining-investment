import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
} from 'lucide-react'

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
  content: string | null
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  created_at: string
}

const categoryLabels: Record<NewsItem['category'], string> = {
  corporate: 'Corporate',
  operations: 'Opérations',
  projects: 'Projets',
  communities: 'Communautés',
  partnerships: 'Partenariats',
}

function formatDate(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)

  if (isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = await params

  const supabase = await createClient()

  const { data } = await supabase
    .from('news')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (!data) {
    return {
      title: 'Article non trouvé',
    }
  }

  return {
    title: data.title || 'Article',
    description: data.excerpt || '',
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !data) {
    notFound()
  }

  const article = data as NewsItem

  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#0A0C0B]">

      {/* =========================================================
          TOP NAV
      ========================================================= */}
      <section className="border-b border-stone-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 sm:px-8 lg:px-10">
          <Link
            href="/news"
            className="group inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-[#A96F35]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            <span>
              Retour aux actualités
            </span>
          </Link>
        </div>
      </section>

      {/* =========================================================
          ARTICLE HEADER
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#080A09] text-white">

        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#B87333]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-[30rem] w-[30rem] rounded-full bg-[#D0A765]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

          <div className="mx-auto max-w-4xl">

            {/* META */}
            <div className="flex flex-wrap items-center gap-4">

              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#D0A765] backdrop-blur-md">
                {categoryLabels[article.category]}
              </span>

              <span className="h-3 w-px bg-white/15" />

              <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
                <Calendar size={13} />
                {formatDate(
                  article.published_at ?? article.created_at
                )}
              </span>

            </div>

            {/* TITLE */}
            <h1 className="mt-7 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            {/* EXCERPT */}
            {article.excerpt && (
              <p className="mt-7 max-w-3xl text-base leading-8 text-white/55 sm:text-lg">
                {article.excerpt}
              </p>
            )}

            <div className="mt-9 h-px w-16 bg-[#B87333]" />

            <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/25">
              Barack Mining Investment
            </p>

          </div>
        </div>
      </section>

      {/* =========================================================
          ARTICLE
      ========================================================= */}
      <section className="relative py-16 sm:py-20 lg:py-24">

        <div className="mx-auto max-w-5xl px-6 sm:px-8">

          {/* COVER IMAGE */}
          {article.cover_image_url && (
            <div className="relative mb-14 overflow-hidden rounded-[30px] bg-[#0A0C0B] shadow-[0_30px_90px_rgba(15,23,42,0.12)]">

              <div className="relative aspect-[16/9]">

                <Image
                  src={article.cover_image_url}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              </div>

            </div>
          )}

          {/* ARTICLE CARD */}
          <article className="overflow-hidden rounded-[30px] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.05)]">

            {/* Article top bar */}
            <div className="flex items-center justify-between border-b border-stone-100 px-7 py-5 sm:px-10">

              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-300">
                Publication officielle
              </span>

              <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-300">
                {categoryLabels[article.category]}

                <ArrowUpRight
                  size={12}
                  className="text-[#B87333]"
                />
              </span>

            </div>

            {/* Content */}
            <div className="px-7 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">

              <div
                className="
                  prose
                  prose-stone
                  max-w-none

                  prose-headings:font-semibold
                  prose-headings:tracking-[-0.04em]
                  prose-headings:text-[#0A0C0B]

                  prose-h2:mt-12
                  prose-h2:mb-5
                  prose-h2:text-2xl

                  prose-h3:mt-10
                  prose-h3:mb-4
                  prose-h3:text-xl

                  prose-p:my-5
                  prose-p:text-[16px]
                  prose-p:leading-8
                  prose-p:text-stone-600

                  prose-strong:text-[#0A0C0B]

                  prose-a:font-medium
                  prose-a:text-[#A96F35]
                  prose-a:no-underline
                  hover:prose-a:underline

                  prose-ul:my-6
                  prose-ol:my-6

                  prose-li:my-2
                  prose-li:text-stone-600

                  prose-blockquote:border-l-[#B87333]
                  prose-blockquote:bg-[#FBFAF7]
                  prose-blockquote:px-5
                  prose-blockquote:py-3
                  prose-blockquote:text-stone-600

                  prose-img:rounded-2xl
                  prose-img:shadow-lg
                "
                dangerouslySetInnerHTML={{
                  __html: article.content || '',
                }}
              />

            </div>

            {/* Article footer */}
            <div className="border-t border-stone-100 bg-[#FBFAF7] px-7 py-6 sm:px-10">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-stone-300">
                    Barack Mining Investment
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    Actualités & informations officielles
                  </p>
                </div>

                <Link
                  href="/news"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#A96F35] transition-all hover:gap-3"
                >
                  Toutes les actualités

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>

              </div>

            </div>

          </article>

        </div>
      </section>

      {/* =========================================================
          BOTTOM CTA
      ========================================================= */}
      <section className="bg-[#F5F4F0] pb-20 sm:pb-24">

        <div className="mx-auto max-w-5xl px-6 sm:px-8">

          <div className="relative overflow-hidden rounded-[30px] bg-[#0A0C0B] px-7 py-10 text-white sm:px-10 sm:py-12">

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#B87333]/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#D0A765]">
                  Actualités
                </p>

                <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                  Découvrez également nos autres publications.
                </p>
              </div>

              <Link
                href="/news"
                className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#B87333] px-5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#A7662D]"
              >
                Voir les actualités

                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>
          </div>

        </div>
      </section>

    </main>
  )
}