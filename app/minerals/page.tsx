import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import PublicHeader from '../(public)/PublicHeader'

import {
  ArrowRight,
  CircleDot,
  Sparkles,
  Diamond,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ressources | Barack Mining Investment',
  description:
    'Domaines d’approvisionnement et d’intérêt commercial : minerais critiques et ressources précieuses.',
}

/* =========================================================
   RESSOURCES
========================================================= */

const minerals = [
  {
    name: 'Cuivre',
    englishName: 'Copper',
    category: 'Minerai critique',
    image: '/images/minerals/copper.jpg',
    icon: CircleDot,
  },
  {
    name: 'Cobalt',
    englishName: 'Cobalt',
    category: 'Minerai critique',
    image: '/images/minerals/cobalt.jpg',
    icon: CircleDot,
  },
  {
    name: 'Lithium',
    englishName: 'Lithium',
    category: 'Minerai critique',
    image: '/images/minerals/lithium.jpg',
    icon: CircleDot,
  },
  {
    name: 'Cassitérite',
    englishName: 'Cassiterite',
    category: 'Minerai critique',
    image: '/images/minerals/cassiterite.jpg',
    icon: CircleDot,
  },
  {
    name: 'Or',
    englishName: 'Gold',
    category: 'Ressource précieuse',
    image: '/images/minerals/gold.jpg',
    icon: Sparkles,
  },
  {
    name: 'Diamant',
    englishName: 'Diamond',
    category: 'Ressource précieuse',
    image: '/images/minerals/diamond.jpg',
    icon: Diamond,
  },
]

export default function MineralsPage() {
  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#0A0C0B]">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <PublicHeader />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative isolate flex min-h-[650px] items-center overflow-hidden bg-[#080A09] pt-[78px] text-white">

        <Image
          src="/images/minerals-hero.jpg"
          alt="Ressources minières de Barack Mining Investment"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* DARK TREATMENT */}
        <div className="absolute inset-0 bg-[#050606]/66" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#050606]/20 via-[#050606]/52 to-[#050606]/95" />

        {/* GOLD ATMOSPHERE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_22%,rgba(225,196,135,0.16),transparent_31%)]" />

        <div className="absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#C69B52]/[0.07] blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.08] blur-3xl" />

        {/* CONTENT */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-4xl text-center">

            {/* LABEL */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E1C487]/25 bg-[#E1C487]/[0.07] px-4 py-2 backdrop-blur-md">

              <span className="h-1.5 w-1.5 rounded-full bg-[#E1C487] shadow-[0_0_12px_rgba(225,196,135,0.70)]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E1C487]">
                Ressources & opportunités
              </span>

            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[72px]">

              Ressources &{' '}

              <span className="bg-gradient-to-r from-[#F0D79F] via-[#D8B86D] to-[#B78A3C] bg-clip-text text-transparent">
                Opportunités
              </span>

            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
              Domaines d’approvisionnement et d’intérêt commercial.
            </p>

            {/* LOGO SIGNATURE */}
            <div className="mx-auto mt-10 flex items-center justify-center gap-5">

              <div className="h-px w-14 bg-white/15" />

              <div className="relative h-10 w-10">
                <Image
                  src="/images/logo-bmi.png"
                  alt="Barack Mining Investment"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>

              <div className="h-px w-14 bg-white/15" />

            </div>

            <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/30">
              Barack Mining Investment
            </p>

          </div>
        </div>

        {/* GOLD EDGE */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/65 to-transparent" />

      </section>

      {/* =========================================================
          INTRODUCTION
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-24 sm:py-28 lg:py-32">

        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-20">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-9 bg-[#B8873F]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                  Notre portefeuille
                </span>

              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-[1.06] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                Des ressources au cœur des{' '}

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                  opportunités minières.
                </span>

              </h2>

            </div>

            <div className="max-w-xl lg:pb-1">

              <p className="text-sm leading-7 text-stone-500 sm:text-base">
                Nous intervenons autour d’opportunités liées à ces ressources,
                selon les projets, les conditions d’approvisionnement et le
                contexte commercial.
              </p>

              <div className="mt-6 flex items-center gap-3">

                <span className="h-1.5 w-1.5 rounded-full bg-[#C69B52]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-stone-400">
                  Ressources critiques & précieuses
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          MINERAL GRID
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] pb-24 sm:pb-28 lg:pb-32">

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {minerals.map((mineral, index) => {
              const Icon = mineral.icon

              return (
                <article
                  key={mineral.name}
                  className={`group overflow-hidden rounded-[28px] border bg-white transition-all duration-500 hover:-translate-y-1 ${
                    index === 4
                      ? 'border-[#C69B52]/30 shadow-[0_28px_75px_rgba(184,115,51,0.10)]'
                      : 'border-stone-200 hover:border-[#C69B52]/25 hover:shadow-[0_24px_65px_rgba(15,23,42,0.09)]'
                  }`}
                >

                  {/* IMAGE */}
                  <div className="relative h-[255px] overflow-hidden bg-[#111311]">

                    <Image
                      src={mineral.image}
                      alt={mineral.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="absolute inset-0 bg-[#0A0C0B]/10 transition-colors duration-500 group-hover:bg-transparent" />

                    {/* CATEGORY */}
                    <div className="absolute left-5 top-5">

                      <span className="inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                        {mineral.category}
                      </span>

                    </div>

                    {/* ICON */}
                    <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#E1C487]/25 bg-black/20 text-[#E1C487] backdrop-blur-md transition-transform duration-300 group-hover:scale-105">

                      <Icon
                        size={18}
                        strokeWidth={1.7}
                      />

                    </div>

                    {/* IMAGE FOOTER */}
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">

                      <div>

                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/55">
                          Ressource
                        </p>

                        <h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
                          {mineral.name}
                        </h3>

                      </div>

                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                    </div>

                  </div>

                  {/* CONTENT */}
                  <div className="p-6 sm:p-7">

                    <div className="flex items-center justify-between gap-4">

                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-300">
                        {mineral.englishName}
                      </span>

                      <span className="h-px flex-1 bg-stone-200 transition-all duration-300 group-hover:bg-[#C69B52]" />

                    </div>

                    <Link
                      href="/opportunity"
                      className="group/link mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#9B7334] transition-all duration-300 hover:gap-3"
                    >

                      <span>
                        Discuter d’une opportunité
                      </span>

                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover/link:translate-x-0.5"
                      />

                    </Link>

                  </div>

                </article>
              )
            })}

          </div>

        </div>
      </section>

      {/* =========================================================
          POSITIONNEMENT
      ========================================================= */}

      <section className="border-y border-stone-200/70 bg-white py-24 sm:py-28">

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#B8873F]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                  Notre positionnement
                </span>

              </div>

              <h2 className="mt-5 text-3xl font-semibold leading-[1.06] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">

                Comprendre la ressource.
                <br />

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                  Comprendre l’opportunité.
                </span>

              </h2>

            </div>

            <div className="max-w-3xl">

              <p className="text-base leading-8 text-stone-600">
                Notre intervention autour de ces ressources dépend de la
                nature des projets, des conditions d’approvisionnement, des
                partenaires concernés et du contexte commercial.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">

                {/* RESSOURCES */}
                <div className="rounded-[20px] border border-stone-200 bg-[#FBFAF7] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C69B52]/30">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">
                    <CircleDot size={17} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.17em] text-[#0A0C0B]">
                    Ressources
                  </p>

                  <p className="mt-2 text-xs leading-5 text-stone-400">
                    Des ressources au cœur des enjeux miniers.
                  </p>

                </div>

                {/* OPPORTUNITÉS */}
                <div className="rounded-[20px] border border-stone-200 bg-[#FBFAF7] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C69B52]/30">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3EEE3] text-[#9B793E]">
                    <Sparkles size={17} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.17em] text-[#0A0C0B]">
                    Opportunités
                  </p>

                  <p className="mt-2 text-xs leading-5 text-stone-400">
                    Des possibilités étudiées selon leur contexte.
                  </p>

                </div>

                {/* VALEUR */}
                <div className="rounded-[20px] border border-stone-200 bg-[#FBFAF7] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C69B52]/30">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">
                    <Diamond size={17} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.17em] text-[#0A0C0B]">
                    Valeur
                  </p>

                  <p className="mt-2 text-xs leading-5 text-stone-400">
                    Construire des relations commerciales durables.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="bg-[#F5F3EE] py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="relative overflow-hidden rounded-[30px] bg-[#0A0C0B] px-7 py-12 text-white shadow-[0_30px_80px_rgba(10,12,11,0.10)] sm:px-10 sm:py-14 lg:px-14">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D7B66C]/[0.08] blur-3xl" />

            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#B8873F]/[0.06] blur-3xl" />

            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/35 to-transparent" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              <div className="max-w-2xl">

                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E1C487]">
                  Une opportunité ?
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  Parlons de votre ressource ou de votre projet.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/45">
                  Présentez-nous votre opportunité et choisissez le parcours
                  correspondant à votre démarche.
                </p>

              </div>

              <Link
                href="/opportunity"
                className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full border border-[#D7B66C]/70 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-6 text-sm font-semibold text-[#0B0B08] shadow-[0_12px_30px_rgba(199,156,77,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
              >
                Présenter une opportunité

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