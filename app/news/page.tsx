
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

import PublicHeader from '../(public)/PublicHeader'

import {
  ArrowRight,
  CalendarDays,
  Globe2,
  Newspaper,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Actualités | Barack Mining Investment',
  description:
    'Retrouvez toutes les actualités et communiqués de Barack Mining Investment.',
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

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default async function NewsPage() {
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

    if (error) {
      console.error('News loading error:', error)
    } else if (data) {
      news = data as NewsItem[]
    }
  } catch (error) {
    console.error('News loading error:', error)
  }

  const featured = news[0]
  const remainingNews = news.slice(1)

  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#0A0C0B]">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <PublicHeader />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative isolate min-h-[650px] overflow-hidden bg-[#080A09] pt-[78px] text-white">

        {/* HERO IMAGE */}
        <Image
          src="/images/news-hero.png"
          alt="Actualités de Barack Mining Investment"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* DARK TREATMENT */}
        <div className="absolute inset-0 bg-[#050606]/66" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#050606]/20 via-[#050606]/52 to-[#050606]/95" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050606]/78 via-[#050606]/36 to-transparent" />

        {/* GOLD ATMOSPHERE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_23%,rgba(225,196,135,0.16),transparent_31%)]" />

        <div className="absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#C69B52]/[0.07] blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.08] blur-3xl" />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[572px] w-full max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-10">

          <div className="w-full">

            <div className="mx-auto max-w-4xl text-center">

              {/* LABEL */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E1C487]/25 bg-[#E1C487]/[0.07] px-4 py-2 backdrop-blur-md">

                <span className="h-1.5 w-1.5 rounded-full bg-[#E1C487] shadow-[0_0_12px_rgba(225,196,135,0.70)]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E1C487]">
                  Actualités & informations
                </span>

              </div>

              {/* TITLE */}
              <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[72px]">

                Actualités{' '}

                <span className="bg-gradient-to-r from-[#F0D79F] via-[#D8B86D] to-[#B78A3C] bg-clip-text text-transparent">
                  & communiqués
                </span>

              </h1>

              {/* DESCRIPTION */}
              <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                Les dernières informations, projets et communications de
                Barack Mining Investment.
              </p>

              {/* LOGO */}
              <div className="mx-auto mt-10 flex items-center justify-center gap-5">

                <div className="h-px w-14 bg-white/15" />

                <div className="relative h-11 w-11">

                  <Image
                    src="/images/logo-bmi.png"
                    alt="Barack Mining Investment"
                    fill
                    sizes="44px"
                    className="object-contain"
                  />

                </div>

                <div className="h-px w-14 bg-white/15" />

              </div>

              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/30">
                Barack Mining Investment
              </p>

              {/* META */}
              <div className="mt-8 flex items-center justify-center gap-3">

                <Newspaper
                  size={15}
                  className="text-[#E1C487]"
                  strokeWidth={1.7}
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Informations officielles & actualités
                </span>

              </div>

            </div>
          </div>
        </div>

        {/* GOLD EDGE */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/65 to-transparent" />

      </section>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-20 sm:py-24 lg:py-28">

        {/* AMBIENT BACKGROUND */}
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="absolute bottom-10 left-0 h-80 w-80 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          {/* =====================================================
              EMPTY STATE
          ===================================================== */}

          {news.length === 0 ? (
            <div className="flex min-h-[430px] items-center justify-center">

              <div className="relative w-full max-w-2xl overflow-hidden rounded-[30px] border border-[#C69B52]/18 bg-white p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-14">

                <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D7B66C]/55 to-transparent" />

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0A0C0B] text-[#E1C487]">
                  <Globe2
                    size={26}
                    strokeWidth={1.6}
                  />
                </div>

                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.28em] text-[#9B793E]">
                  Actualités
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#0A0C0B] sm:text-3xl">
                  Aucune actualité publiée pour le moment.
                </h2>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-500">
                  Les prochaines publications de Barack Mining Investment
                  apparaîtront ici.
                </p>

              </div>

            </div>
          ) : (
            <>

              {/* =================================================
                  FEATURED ARTICLE
              ================================================= */}

              {featured && (
                <div className="mb-16">

                  {/* SECTION HEADING */}
                  <div className="mb-8 flex items-end justify-between gap-5">

                    <div>

                      <div className="flex items-center gap-3">

                        <span className="h-px w-8 bg-[#B8873F]" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                          À la une
                        </span>

                      </div>

                      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">
                        À la une
                      </h2>

                    </div>

                    <span className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-300 sm:block">
                      Publication la plus récente
                    </span>

                  </div>

                  {/* FEATURED CARD */}
                  <Link
                    href={`/news/${featured.slug}`}
                    className="group relative block overflow-hidden rounded-[30px] border border-[#C69B52]/20 bg-[#0A0C0B] shadow-[0_25px_70px_rgba(15,23,42,0.11)] transition-all duration-500 hover:-translate-y-1 hover:border-[#E1C487]/40 hover:shadow-[0_30px_80px_rgba(184,115,51,0.11)]"
                  >

                    {/* GOLD TOP LINE */}
                    <div className="absolute left-10 right-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#E1C487]/65 to-transparent" />

                    <div className="grid lg:grid-cols-[1.15fr_0.85fr]">

                      {/* IMAGE */}
                      <div className="relative min-h-[340px] overflow-hidden sm:min-h-[440px] lg:min-h-[500px]">

                        {featured.cover_image_url ? (
                          <Image
                            src={featured.cover_image_url}
                            alt={featured.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 65vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                          />
                        ) : (
                          <div className="flex h-full min-h-[340px] items-center justify-center bg-[#111311] sm:min-h-[440px] lg:min-h-[500px]">
                            <Globe2
                              size={52}
                              className="text-[#E1C487]"
                              strokeWidth={1.2}
                            />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                        <div className="absolute inset-0 bg-[#0A0C0B]/10 transition-colors duration-500 group-hover:bg-transparent" />

                        {/* CATEGORY */}
                        <div className="absolute left-6 top-6">

                          <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                            {categoryLabels[featured.category]}
                          </span>

                        </div>

                        {/* DATE */}
                        <div className="absolute bottom-6 left-6 flex items-center gap-2">

                          <CalendarDays
                            size={14}
                            className="text-[#E1C487]"
                          />

                          <span className="text-[10px] font-medium text-white/70">
                            {formatDate(
                              featured.published_at ??
                                featured.created_at
                            )}
                          </span>

                        </div>

                      </div>

                      {/* CONTENT */}
                      <div className="relative flex flex-col justify-between bg-[#0A0C0B] p-7 sm:p-9 lg:p-11">

                        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#D7B66C]/[0.06] blur-3xl" />

                        <div className="relative">

                          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#E1C487]">
                            Dernière publication
                          </p>

                          <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-3xl lg:text-4xl">
                            {featured.title}
                          </h3>

                          {featured.excerpt && (
                            <p className="mt-6 text-sm leading-7 text-white/50">
                              {featured.excerpt}
                            </p>
                          )}

                        </div>

                        <div className="relative mt-10">

                          <div className="mb-6 h-px w-full bg-gradient-to-r from-white/10 via-[#E1C487]/25 to-white/10" />

                          <span className="inline-flex items-center gap-3 text-sm font-semibold text-[#E1C487] transition-all duration-300 group-hover:gap-4">

                            Lire l’article

                            <ArrowRight
                              size={16}
                              className="transition-transform duration-300 group-hover:translate-x-0.5"
                            />

                          </span>

                        </div>

                      </div>

                    </div>
                  </Link>

                </div>
              )}

              {/* =================================================
                  OTHER NEWS
              ================================================= */}

              {remainingNews.length > 0 && (
                <div>

                  {/* HEADING */}
                  <div className="mb-10">

                    <div className="flex items-center gap-3">

                      <span className="h-px w-8 bg-[#B8873F]" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                        Toutes les actualités
                      </span>

                    </div>

                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">
                      Nos dernières publications
                    </h2>

                  </div>

                  {/* NEWS GRID */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {remainingNews.map((item) => (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="group relative block overflow-hidden rounded-[26px] border border-[#C69B52]/18 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-[#C69B52]/48 hover:shadow-[0_22px_60px_rgba(184,115,51,0.09)]"
                      >

                        {/* GOLD INNER FRAME */}
                        <div className="pointer-events-none absolute inset-2 z-10 rounded-[21px] border border-[#E1C487]/0 transition-colors duration-500 group-hover:border-[#E1C487]/15" />

                        {/* GOLD TOP LINE */}
                        <div className="absolute left-8 right-8 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#E1C487]/0 to-transparent transition-all duration-500 group-hover:via-[#E1C487]/60" />

                        {/* IMAGE */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0C0B]">

                          {item.cover_image_url ? (
                            <Image
                              src={item.cover_image_url}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Globe2
                                size={35}
                                className="text-[#E1C487]"
                                strokeWidth={1.4}
                              />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* CATEGORY */}
                          <div className="absolute left-4 top-4">

                            <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
                              {categoryLabels[item.category]}
                            </span>

                          </div>

                        </div>

                        {/* CONTENT */}
                        <div className="p-6">

                          {/* DATE */}
                          <div className="flex items-center gap-2 text-[10px] font-medium text-stone-400">

                            <CalendarDays size={13} />

                            <span>
                              {formatDate(
                                item.published_at ??
                                  item.created_at
                              )}
                            </span>

                          </div>

                          {/* TITLE */}
                          <h3 className="mt-4 line-clamp-3 text-xl font-semibold leading-tight tracking-[-0.035em] text-[#0A0C0B] transition-colors duration-300 group-hover:text-[#9B7334]">
                            {item.title}
                          </h3>

                          {/* EXCERPT */}
                          {item.excerpt && (
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-500">
                              {item.excerpt}
                            </p>
                          )}

                          {/* FOOTER */}
                          <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">

                            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-300">
                              Actualité
                            </span>

                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#9B7334] transition-all duration-300 group-hover:gap-3">

                              Lire

                              <ArrowRight
                                size={14}
                                className="transition-transform duration-300 group-hover:translate-x-0.5"
                              />

                            </span>

                          </div>

                        </div>

                      </Link>
                    ))}

                  </div>
                </div>
              )}

            </>
          )}

        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="bg-[#F5F3EE] pb-20 sm:pb-24">

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="relative overflow-hidden rounded-[30px] border border-[#C69B52]/15 bg-[#0A0C0B] px-7 py-12 text-white shadow-[0_30px_80px_rgba(10,12,11,0.10)] sm:px-10 sm:py-14 lg:px-14">

            {/* DECORATION */}
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#D7B66C]/[0.08] blur-3xl" />

            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#B8873F]/[0.06] blur-3xl" />

            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/35 to-transparent" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              <div className="max-w-2xl">

                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E1C487]">
                  Barack Mining Investment
                </p>

                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
                  Restez informé de nos projets et opportunités.
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/45">
                  Retrouvez régulièrement nos actualités, projets,
                  partenariats et initiatives.
                </p>

              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E1C487]/20 bg-white/[0.04] backdrop-blur-md">

                <Newspaper
                  size={17}
                  className="text-[#E1C487]"
                  strokeWidth={1.6}
                />

              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  )
}