'use client'

import {
  useMemo,
  useRef,
} from 'react'

import Image from 'next/image'
import Link from 'next/link'

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleDot,
  Compass,
  Factory,
  Globe2,
  Handshake,
  Mountain,
  Pickaxe,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'

/* ============================================================
   TYPES
============================================================ */

type NewsCategory =
  | 'corporate'
  | 'operations'
  | 'projects'
  | 'communities'
  | 'partnerships'

type NewsItem = {
  id: string
  title: string
  slug: string
  category: NewsCategory
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  created_at: string
}

type HomeClientProps = {
  news: NewsItem[]
}

/* ============================================================
   DATA
============================================================ */

const activities = [
  {
    number: '01',
    title: 'Prospection',
    description:
      "Identifier des opportunités potentielles et des zones d'intérêt minéral.",
    href: '/activities/prospecting',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Exploration',
    description:
      'Approfondir la compréhension géologique et technique des ressources et des projets.',
    href: '/activities/exploration',
    icon: Mountain,
  },
  {
    number: '03',
    title: 'Opérations minières',
    description:
      "Coordonner les activités critiques, les chaînes d'approvisionnement et les interfaces opérationnelles.",
    href: '/activities/operations',
    icon: Factory,
  },
  {
    number: '04',
    title: 'Approvisionnement minéral',
    description:
      'Faciliter des opportunités responsables d’approvisionnement et de commercialisation.',
    href: '/activities/supply',
    icon: Zap,
  },
  {
    number: '05',
    title: 'Support projets & investisseurs',
    description:
      "Accompagner les projets, investisseurs et partenaires dans leur coordination et leur exécution locale.",
    href: '/activities/support',
    icon: Handshake,
  },
]

const minerals = [
  {
    name: 'Cuivre',
    englishName: 'Copper',
    category: 'Minerai critique',
    icon: CircleDot,
  },
  {
    name: 'Cobalt',
    englishName: 'Cobalt',
    category: 'Minerai critique',
    icon: CircleDot,
  },
  {
    name: 'Lithium',
    englishName: 'Lithium',
    category: 'Minerai critique',
    icon: CircleDot,
  },
  {
    name: 'Cassitérite',
    englishName: 'Cassiterite',
    category: 'Minerai critique',
    icon: CircleDot,
  },
  {
    name: 'Or',
    englishName: 'Gold',
    category: 'Ressource précieuse',
    icon: Sparkles,
  },
  {
    name: 'Diamant',
    englishName: 'Diamond',
    category: 'Ressource précieuse',
    icon: Sparkles,
  },
]

const partnershipProfiles = [
  {
    label: 'Investisseur',
    description: 'Explorer une opportunité d’investissement.',
    slug: 'investor',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Détenteur d’un actif minier',
    description: 'Présenter un actif ou une opportunité.',
    slug: 'concession',
    icon: Mountain,
  },
  {
    label: 'Fournisseur de minerais',
    description: 'Discuter d’une opportunité commerciale.',
    slug: 'supplier',
    icon: Pickaxe,
  },
  {
    label: 'Entreprise minière',
    description: 'Discuter d’un accompagnement ou d’un projet.',
    slug: 'company',
    icon: Factory,
  },
  {
    label: 'Partenaire stratégique',
    description: 'Explorer une collaboration stratégique.',
    slug: 'partner',
    icon: Handshake,
  },
]

const categoryLabels: Record<NewsCategory, string> = {
  corporate: 'Corporate',
  operations: 'Opérations',
  projects: 'Projets',
  communities: 'Communautés',
  partnerships: 'Partenariats',
}

/* ============================================================
   HELPERS
============================================================ */

function formatNewsDate(value: string | null) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/* ============================================================
   REVEAL
============================================================ */

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  const inView = useInView(ref, {
    once: true,
    margin: '-90px',
  })

  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: 24,
            }
      }
      animate={
        prefersReducedMotion || inView
          ? {
              opacity: 1,
              y: 0,
            }
          : undefined
      }
      transition={{
        duration: prefersReducedMotion ? 0 : 0.75,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ============================================================
   SECTION LABEL
============================================================ */

function SectionLabel({
  children,
  dark = false,
}: {
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <div className="inline-flex items-center gap-3">
      <span
        className={`h-px w-8 ${
          dark ? 'bg-[#D0A765]' : 'bg-[#B87333]'
        }`}
      />

      <span
        className={`text-[10px] font-bold uppercase tracking-[0.3em] ${
          dark ? 'text-[#D0A765]' : 'text-[#A98B4F]'
        }`}
      >
        {children}
      </span>
    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function HomeClient({
  news,
}: HomeClientProps) {
  const heroRef = useRef<HTMLElement | null>(null)

  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroImageY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '15%']
  )

  const heroContentY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '10%']
  )

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.75],
    [1, 0]
  )

  const latestNews = useMemo(
    () => news.slice(0, 3),
    [news]
  )

  return (
    <div className="overflow-x-hidden bg-[#F5F4F0]">

      {/* ======================================================
          HERO
      ====================================================== */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] overflow-hidden bg-[#080A09] text-white"
      >
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : {
                  y: heroImageY,
                }
          }
          className="absolute inset-[-7%]"
        >
          <Image
            src="/images/hero-mining.jpg"
            alt="Opérations minières de Barack Mining Investment"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[#080A09]/45" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(184,115,51,0.18),transparent_32%)]" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#080A09]/20 via-[#080A09]/40 to-[#080A09]" />

        <div className="pointer-events-none absolute inset-5 rounded-[28px] border border-white/10 sm:inset-7 lg:inset-9" />

        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : {
                  y: heroContentY,
                  opacity: heroOpacity,
                }
          }
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-6 pb-10 pt-32 sm:px-10 sm:pb-14 lg:px-14 xl:pb-20"
        >
          <div className="max-w-6xl">

            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 18,
                    }
              }
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-10 bg-[#B87333]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-white/60 sm:text-[10px]">
                Barack Mining Investment
              </span>
            </motion.div>

            <motion.h1
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 28,
                    }
              }
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={{
                duration: 0.95,
                delay: 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-7 max-w-6xl text-[3.25rem] font-semibold leading-[0.91] tracking-[-0.07em] sm:text-6xl lg:text-[6.2rem] xl:text-[7.1rem]"
            >
              Construire des
              <br />

              <span className="text-[#D0A765]">
                opportunités.
              </span>

              <br />

              <span className="text-white/95">
                Créer une valeur durable.
              </span>
            </motion.h1>

            <motion.p
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 18,
                    }
              }
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={{
                duration: 0.75,
                delay: 0.2,
              }}
              className="mt-7 max-w-2xl text-sm leading-7 text-white/60 sm:text-base"
            >
              Expertise minière stratégique, accompagnement des projets,
              partenariats responsables et création de valeur durable.
            </motion.p>

            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 18,
                    }
              }
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              transition={{
                duration: 0.75,
                delay: 0.28,
              }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/opportunity"
                className="group inline-flex h-13 items-center justify-center gap-3 rounded-full bg-[#B87333] px-7 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(184,115,51,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#A7662D]"
              >
                Présenter une opportunité

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#expertise"
                className="group inline-flex h-13 items-center justify-center gap-3 rounded-full border border-white/20 bg-white/[0.05] px-7 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:bg-white/10"
              >
                Découvrir notre expertise

                <ArrowDown
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </a>
            </motion.div>
          </div>

          {/* HERO SIGNATURE */}
          <div className="mt-16 border-t border-white/10 pt-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">

              {[
                ['01', 'Comprendre', 'le terrain'],
                ['02', 'Identifier', 'les opportunités'],
                ['03', 'Connecter', 'les partenaires'],
                ['04', 'Construire', 'dans la durée'],
              ].map(
                ([number, title, caption], index) => (
                  <motion.div
                    key={number}
                    initial={
                      prefersReducedMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 12,
                          }
                    }
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : {
                            opacity: 1,
                            y: 0,
                          }
                    }
                    transition={{
                      duration: 0.6,
                      delay:
                        0.38 +
                        index * 0.05,
                    }}
                    className={`${
                      index > 0
                        ? 'border-l border-white/10 pl-4 sm:pl-5'
                        : ''
                    }`}
                  >
                    <p className="text-[10px] font-bold tracking-[0.18em] text-[#D0A765]">
                      {number}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-white/75">
                      {title}
                    </p>

                    <p className="mt-1 text-[10px] text-white/30">
                      {caption}
                    </p>
                  </motion.div>
                )
              )}

            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-7 right-8 hidden lg:block">
          <motion.a
            href="#positioning"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, 6, 0],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center gap-2 text-white/30 transition hover:text-white/60"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.28em]">
              Explorer
            </span>

            <ArrowDown size={16} />
          </motion.a>
        </div>
      </section>

      {/* ======================================================
          POSITIONNEMENT
      ====================================================== */}
      <section
        id="positioning"
        className="bg-[#F5F4F0] py-24 sm:py-32 lg:py-36"
      >
        <div className="mx-auto max-w-[1380px] px-6 sm:px-10 lg:px-14">

          <div className="grid gap-14 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">

            <Reveal>
              <div>
                <SectionLabel>
                  Notre positionnement
                </SectionLabel>

                <p className="mt-6 max-w-xs text-sm leading-7 text-stone-500">
                  Un rôle à l’intersection du terrain, des projets,
                  des investisseurs et des partenaires.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div>

                <h2 className="max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-[#0A0C0B] sm:text-5xl lg:text-[4.3rem]">
                  Relier les opportunités
                  <br />
                  aux bonnes
                  <span className="text-stone-400">
                    {' '}compétences et relations.
                  </span>
                </h2>

                <div className="mt-9 grid gap-8 sm:grid-cols-3">

                  <div className="border-t border-stone-200 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A98B4F]">
                      Terrain
                    </p>

                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      Comprendre les réalités locales et opérationnelles.
                    </p>
                  </div>

                  <div className="border-t border-stone-200 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A98B4F]">
                      Expertise
                    </p>

                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      Structurer la compréhension des projets et ressources.
                    </p>
                  </div>

                  <div className="border-t border-stone-200 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A98B4F]">
                      Relations
                    </p>

                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      Faciliter les connexions entre les parties prenantes.
                    </p>
                  </div>

                </div>

              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ======================================================
          EXPERTISE
      ====================================================== */}
      <section
        id="expertise"
        className="bg-white py-24 sm:py-32 lg:py-36"
      >
        <div className="mx-auto max-w-[1380px] px-6 sm:px-10 lg:px-14">

          <Reveal>
            <div className="flex flex-col justify-between gap-8 border-b border-stone-200 pb-9 lg:flex-row lg:items-end">

              <div>
                <SectionLabel>
                  Notre expertise
                </SectionLabel>

                <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-[#0A0C0B] sm:text-5xl lg:text-[4.2rem]">
                  Cinq domaines.
                  <br />
                  <span className="text-stone-400">
                    Une même approche.
                  </span>
                </h2>
              </div>

              <Link
                href="/activities"
                className="group inline-flex items-center gap-3 text-sm font-semibold text-[#A96F35]"
              >
                Voir toutes nos activités

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>
          </Reveal>

          <div className="mt-8">
            {activities.map(
              (activity, index) => {
                const Icon = activity.icon

                return (
                  <Reveal
                    key={activity.number}
                    delay={index * 0.04}
                  >
                    <Link
                      href={activity.href}
                      className="group relative grid overflow-hidden border-b border-stone-200 py-7 transition sm:grid-cols-[65px_52px_1fr_auto] sm:items-center sm:gap-5 lg:grid-cols-[75px_55px_1fr_370px_auto]"
                    >
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-[#F7F3EC] transition-all duration-500 group-hover:w-full" />

                      <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] text-stone-300">
                        {activity.number}
                      </span>

                      <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#F3EFE8] text-[#A96F35] transition-all duration-300 group-hover:bg-[#0A0C0B] group-hover:text-[#D0A765]">
                        <Icon size={18} />
                      </div>

                      <div className="relative z-10 mt-5 sm:mt-0">
                        <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#0A0C0B] sm:text-xl">
                          {activity.title}
                        </h3>
                      </div>

                      <p className="relative z-10 mt-3 hidden text-sm leading-6 text-stone-500 lg:mt-0 lg:block">
                        {activity.description}
                      </p>

                      <div className="relative z-10 mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 transition-all duration-300 group-hover:border-[#B87333] group-hover:bg-[#B87333] group-hover:text-white sm:mt-0">
                        <ArrowRight size={15} />
                      </div>
                    </Link>
                  </Reveal>
                )
              }
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          RESSOURCES
      ====================================================== */}
      <section className="bg-[#ECE9E2] py-24 sm:py-32 lg:py-36">
        <div className="mx-auto max-w-[1380px] px-6 sm:px-10 lg:px-14">

          <div className="grid items-start gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">

            <Reveal>
              <div>

                <SectionLabel>
                  Ressources
                </SectionLabel>

                <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-[#0A0C0B] sm:text-5xl">
                  Des ressources
                  <br />
                  au cœur des
                  <span className="text-stone-400">
                    {' '}opportunités.
                  </span>
                </h2>

                <p className="mt-7 max-w-md text-sm leading-7 text-stone-600">
                  Nous intervenons autour d’opportunités liées à certaines
                  ressources critiques et précieuses, selon les projets,
                  les conditions d’approvisionnement et le contexte commercial.
                </p>

                <Link
                  href="/minerals"
                  className="group mt-8 inline-flex items-center gap-3 text-sm font-semibold text-[#A96F35]"
                >
                  Explorer les ressources

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="grid grid-cols-2 overflow-hidden rounded-[28px] border border-stone-300 bg-stone-300 sm:grid-cols-3">

                {minerals.map(
                  (mineral, index) => {
                    const Icon = mineral.icon

                    return (
                      <Link
                        key={mineral.name}
                        href="/minerals"
                        className="group relative min-h-[170px] bg-[#F5F3EE] p-5 transition duration-500 hover:bg-white sm:min-h-[190px] sm:p-6"
                      >
                        <div className="flex items-start justify-between">

                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400">
                            {mineral.category}
                          </p>

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#A98B4F] transition duration-300 group-hover:bg-[#0A0C0B] group-hover:text-[#D0A765]">
                            <Icon size={15} />
                          </div>

                        </div>

                        <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">

                          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-300">
                            {mineral.englishName}
                          </p>

                          <h3 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[#0A0C0B]">
                            {mineral.name}
                          </h3>

                        </div>
                      </Link>
                    )
                  }
                )}

              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ======================================================
          IMPACT + PARTENARIAT
      ====================================================== */}
      <section className="bg-[#F5F4F0] py-24 sm:py-32 lg:py-36">
        <div className="mx-auto max-w-[1380px] px-6 sm:px-10 lg:px-14">

          <div className="grid gap-8 lg:grid-cols-2">

            {/* IMPACT */}
            <Reveal>
              <div className="group relative min-h-[540px] overflow-hidden rounded-[30px] bg-[#0A0C0B]">

                <Image
                  src="/images/impact-community.jpg"
                  alt="Impact et communautés"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/95 via-[#080A09]/30 to-transparent" />

                <div className="absolute left-7 right-7 top-7">
                  <SectionLabel dark>
                    Impact & communautés
                  </SectionLabel>
                </div>

                <div className="absolute bottom-7 left-7 right-7">

                  <h2 className="max-w-lg text-3xl font-semibold leading-[1.03] tracking-[-0.05em] text-white sm:text-4xl">
                    Des projets réels.
                    <br />
                    Une action responsable.
                  </h2>

                  <p className="mt-4 max-w-lg text-sm leading-6 text-white/50">
                    Le développement responsable doit prendre en compte
                    les communautés liées aux projets.
                  </p>

                  <Link
                    href="/impact"
                    className="group/link mt-7 inline-flex items-center gap-3 text-sm font-semibold text-[#D0A765]"
                  >
                    Découvrir notre engagement

                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover/link:translate-x-1"
                    />
                  </Link>

                </div>
              </div>
            </Reveal>

            {/* PARTNERSHIPS */}
            <Reveal delay={0.08}>
              <div className="flex min-h-[540px] flex-col justify-between rounded-[30px] bg-[#0A0C0B] p-7 text-white sm:p-9">

                <div>
                  <SectionLabel dark>
                    Partenariats
                  </SectionLabel>

                  <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-[1.03] tracking-[-0.05em] sm:text-4xl">
                    Les bonnes opportunités
                    <br />
                    commencent par les
                    <span className="text-[#D0A765]">
                      {' '}bonnes connexions.
                    </span>
                  </h2>

                  <p className="mt-5 max-w-lg text-sm leading-7 text-white/45">
                    Investisseurs, détenteurs d’actifs, fournisseurs,
                    entreprises minières et partenaires stratégiques :
                    choisissez votre parcours.
                  </p>
                </div>

                <div className="mt-10">

                  <div className="space-y-2">
                    {partnershipProfiles.map(
                      (profile) => {
                        const Icon = profile.icon

                        return (
                          <Link
                            key={profile.slug}
                            href={`/opportunity?profile=${profile.slug}`}
                            className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 transition duration-300 hover:border-[#D0A765]/25 hover:bg-white/[0.05]"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-[#D0A765]">
                              <Icon size={17} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-white/85">
                                {profile.label}
                              </p>

                              <p className="mt-0.5 hidden text-xs text-white/30 sm:block">
                                {profile.description}
                              </p>
                            </div>

                            <ArrowUpRight
                              size={15}
                              className="shrink-0 text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#D0A765]"
                            />
                          </Link>
                        )
                      }
                    )}
                  </div>

                  <Link
                    href="/partnerships"
                    className="group mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[#D0A765]"
                  >
                    Voir tous les partenariats

                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ======================================================
          ACTUALITÉS
      ====================================================== */}
      <section className="bg-white py-24 sm:py-32 lg:py-36">
        <div className="mx-auto max-w-[1380px] px-6 sm:px-10 lg:px-14">

          <Reveal>
            <div className="flex flex-col justify-between gap-6 border-b border-stone-200 pb-9 sm:flex-row sm:items-end">

              <div>
                <SectionLabel>
                  Actualités
                </SectionLabel>

                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-[#0A0C0B] sm:text-5xl">
                  Les dernières nouvelles.
                </h2>
              </div>

              <Link
                href="/news"
                className="group inline-flex items-center gap-3 text-sm font-semibold text-[#A96F35]"
              >
                Toutes les actualités

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>
          </Reveal>

          {latestNews.length > 0 ? (
            <div className="mt-10 grid gap-8 lg:grid-cols-3">

              {latestNews.map(
                (item, index) => (
                  <Reveal
                    key={item.id}
                    delay={index * 0.05}
                  >
                    <Link
                      href={`/news/${item.slug}`}
                      className="group block"
                    >

                      <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-[#0A0C0B]">

                        {item.cover_image_url ? (
                          <img
                            src={item.cover_image_url}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Globe2
                              size={30}
                              className="text-[#D0A765]"
                              strokeWidth={1.3}
                            />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 backdrop-blur-md">
                          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/75">
                            {categoryLabels[item.category]}
                          </span>
                        </div>

                        <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0A0C0B] opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
                          <ArrowUpRight size={15} />
                        </div>

                      </div>

                      <div className="pt-5">

                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                          {formatNewsDate(
                            item.published_at ??
                              item.created_at
                          )}
                        </p>

                        <h3 className="mt-3 text-xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#0A0C0B] transition-colors duration-300 group-hover:text-[#A96F35]">
                          {item.title}
                        </h3>

                        {item.excerpt && (
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-500">
                            {item.excerpt}
                          </p>
                        )}

                        <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A96F35]">
                          Lire l’article

                          <ArrowRight
                            size={13}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </span>

                      </div>
                    </Link>
                  </Reveal>
                )
              )}

            </div>
          ) : (
            <Reveal>
              <div className="mt-10 rounded-[26px] border border-stone-200 bg-[#FBFAF7] p-14 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3EFE8] text-[#A98B4F]">
                  <Globe2
                    size={22}
                    strokeWidth={1.5}
                  />
                </div>

                <p className="mt-5 text-sm text-stone-500">
                  Aucune actualité publiée pour le moment.
                </p>

              </div>
            </Reveal>
          )}

        </div>
      </section>

      {/* ======================================================
          FINAL CTA
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#080A09] py-28 text-white sm:py-36 lg:py-40">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(184,115,51,0.13),transparent_35%)]" />

        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#D0A765]/10" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center sm:px-10">

          <Reveal>

            <SectionLabel dark>
              Opportunity Center
            </SectionLabel>

            <h2 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-5xl lg:text-[5.2rem]">
              Votre prochaine
              <br />
              opportunité commence ici.
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
              Projet minier, investissement, ressource, accompagnement
              opérationnel ou partenariat stratégique : présentez-nous
              votre opportunité.
            </p>

            <div className="mt-10">
              <Link
                href="/opportunity"
                className="group inline-flex h-13 items-center justify-center gap-3 rounded-full bg-[#B87333] px-8 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(184,115,51,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#A7662D]"
              >
                Présenter une opportunité

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="mt-9 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-white/25">
              <ShieldCheck size={13} />
              Un parcours structuré et sécurisé
            </div>

          </Reveal>

        </div>
      </section>

    </div>
  )
}