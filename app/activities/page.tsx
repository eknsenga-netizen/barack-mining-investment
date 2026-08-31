import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import PublicHeader from '../(public)/PublicHeader'

import {
  ArrowRight,
  Compass,
  Factory,
  Handshake,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Activités | Barack Mining Investment',
  description:
    'Découvrez nos domaines d’expertise : prospection et exploration, opérations minières, approvisionnement minéral et accompagnement des projets et investisseurs.',
}

const activities = [
  {
    title: 'Prospection & Exploration',
    description:
      'Identifier les zones à potentiel minéral, approfondir leur étude et recueillir progressivement les données nécessaires à leur caractérisation et à leur quantification.',
    href: '/activities/prospecting',
    icon: Compass,
    number: '01',
  },
  {
    title: 'Opérations minières',
    description:
      'Coordonner les activités opérationnelles, les flux et les informations nécessaires au suivi des opérations minières.',
    href: '/activities/operations',
    icon: Factory,
    number: '02',
  },
  {
    title: 'Approvisionnement minéral',
    description:
      'Faciliter les connexions entre les ressources disponibles, les fournisseurs et les opportunités commerciales.',
    href: '/activities/supply',
    icon: Zap,
    number: '03',
  },
  {
    title: 'Accompagnement des projets & investisseurs',
    description:
      'Accompagner les projets, les investisseurs et les partenaires stratégiques dans leurs démarches et leurs opportunités.',
    href: '/activities/support',
    icon: Handshake,
    number: '04',
  },
]

export default function ActivitiesPage() {
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

        {/* HERO IMAGE */}

        <Image
          src="/images/activities-hero.png"
          alt="Activités de Barack Mining Investment"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* DARK TREATMENT */}

        <div className="absolute inset-0 bg-[#050606]/66" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#050606]/20 via-[#050606]/55 to-[#050606]/95" />

        {/* GOLD ATMOSPHERE */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_22%,rgba(225,196,135,0.16),transparent_31%)]" />

        <div className="absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#C69B52]/[0.07] blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.08] blur-3xl" />

        {/* SUBTLE GRID */}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

        {/* HERO CONTENT */}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-4xl text-center">

            {/* EYEBROW */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E1C487]/25 bg-[#E1C487]/[0.07] px-4 py-2 backdrop-blur-md">

              <span className="h-1.5 w-1.5 rounded-full bg-[#E1C487] shadow-[0_0_12px_rgba(225,196,135,0.70)]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E1C487]">
                Notre expertise
              </span>

            </div>

            {/* TITLE */}

            <h1 className="text-4xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[72px]">

              Nos{' '}

              <span className="bg-gradient-to-r from-[#F0D79F] via-[#D8B86D] to-[#B78A3C] bg-clip-text text-transparent">
                activités
              </span>

            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
              Quatre domaines d’expertise pour intervenir à différents
              niveaux de la chaîne de valeur minière, de l’identification
              des ressources à l’accompagnement des projets.
            </p>

            {/* SIGNATURE */}

            <div className="mx-auto mt-10 flex items-center justify-center gap-5">

              <div className="h-px w-16 bg-white/15" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/30">
                Barack Mining Investment
              </span>

              <div className="h-px w-16 bg-white/15" />

            </div>

          </div>
        </div>

        {/* GOLD EDGE */}

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/65 to-transparent" />

      </section>

      {/* =========================================================
          ACTIVITIES
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-24 sm:py-28 lg:py-32">

        {/* ATMOSPHERE */}

        <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="absolute bottom-10 left-0 h-72 w-72 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          {/* INTRO */}

          <div className="mb-14 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

            <div className="max-w-3xl">

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                  Ce que nous faisons
                </span>

              </div>

              <h2 className="mt-5 text-3xl font-semibold leading-[1.06] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                Des compétences pensées pour{' '}

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                  différents niveaux de la chaîne minière.
                </span>

              </h2>

            </div>

            <div className="max-w-sm">

              <p className="text-sm leading-7 text-stone-500">
                Une approche structurée couvrant l’identification et
                l’évaluation du potentiel minéral, les opérations,
                l’approvisionnement et l’accompagnement des projets.
              </p>

            </div>

          </div>

          {/* GRID */}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {activities.map((activity, index) => {

              const Icon = activity.icon

              /*
               * La première activité est mise en avant car elle constitue
               * le point d’entrée technique du parcours minier.
               */
              const isFeatured = index === 0

              return (
                <Link
                  key={activity.href}
                  href={activity.href}
                  className={`group relative flex min-h-[350px] flex-col overflow-hidden rounded-[26px] border p-7 transition-all duration-500 sm:p-8 ${
                    isFeatured
                      ? 'border-[#D7B66C]/35 bg-[#0A0C0B] text-white shadow-[0_28px_75px_rgba(10,12,11,0.14)]'
                      : 'border-stone-200 bg-white hover:-translate-y-1 hover:border-[#C69B52]/30 hover:shadow-[0_22px_60px_rgba(15,23,42,0.08)]'
                  }`}
                >

                  {/* DECORATION */}

                  <div
                    className={`absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150 ${
                      isFeatured
                        ? 'bg-[#D7B66C]/[0.09]'
                        : 'bg-[#C69B52]/[0.05]'
                    }`}
                  />

                  {/* TOP GOLD LINE */}

                  <div
                    className={`absolute left-7 right-7 top-0 h-px transition-opacity duration-500 ${
                      isFeatured
                        ? 'bg-gradient-to-r from-transparent via-[#E1C487]/70 to-transparent opacity-90'
                        : 'bg-gradient-to-r from-transparent via-[#C69B52]/55 to-transparent opacity-0 group-hover:opacity-100'
                    }`}
                  />

                  {/* TOP */}

                  <div className="relative flex items-center justify-between">

                    <div
                      className={`flex h-13 w-13 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                        isFeatured
                          ? 'bg-gradient-to-br from-[#B8873F] via-[#D7B66C] to-[#9D7230] text-[#15120C] shadow-[0_10px_25px_rgba(199,156,77,0.16)]'
                          : 'bg-[#0A0C0B] text-[#E1C487]'
                      }`}
                    >

                      <Icon
                        size={22}
                        strokeWidth={1.8}
                      />

                    </div>

                    <span
                      className={`text-[10px] font-bold tracking-[0.22em] ${
                        isFeatured
                          ? 'text-[#E1C487]/30'
                          : 'text-stone-300'
                      }`}
                    >
                      {activity.number}
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="relative mt-auto">

                    <h3
                      className={`max-w-sm text-xl font-semibold leading-tight tracking-[-0.03em] ${
                        isFeatured
                          ? 'text-white'
                          : 'text-[#0A0C0B]'
                      }`}
                    >
                      {activity.title}
                    </h3>

                    <p
                      className={`mt-4 max-w-sm text-sm leading-7 ${
                        isFeatured
                          ? 'text-white/55'
                          : 'text-stone-500'
                      }`}
                    >
                      {activity.description}
                    </p>

                    <div
                      className={`mt-7 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3 ${
                        isFeatured
                          ? 'text-[#E1C487]'
                          : 'text-[#9B7334]'
                      }`}
                    >

                      <span>
                        Découvrir l’activité
                      </span>

                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />

                    </div>

                  </div>

                </Link>
              )
            })}

          </div>

          {/* =====================================================
              BOTTOM STRIP
          ===================================================== */}

          <div className="mt-14 overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.04)]">

            <div className="relative flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">

              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B66C]/45 to-transparent" />

              <div>

                <div className="flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#B8873F]" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#9B793E]">
                    Une approche intégrée
                  </p>

                </div>

                <p className="mt-2 text-sm text-stone-500">
                  De l’identification du potentiel minéral aux opérations,
                  à l’approvisionnement et à l’accompagnement des projets.
                </p>

              </div>

              <div className="flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-[#B8873F]" />

                <span className="h-1.5 w-1.5 rounded-full bg-[#D7B66C]" />

                <span className="h-1.5 w-1.5 rounded-full bg-[#0A0C0B]" />

              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  )
}