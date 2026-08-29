import type { Metadata } from 'next'
import Image from 'next/image'

import PublicHeader from '../../(public)/PublicHeader'
import ActivityDetailClient from './ActivityDetailClient'

export const metadata: Metadata = {
  title: 'Prospection minière | Barack Mining Investment',
  description:
    'La prospection minière : identification des opportunités, recherche de zones potentielles et évaluation initiale des ressources.',
}

export default function ProspectingPage() {
  return (
    <>
      {/* =========================================================
          HEADER
      ========================================================= */}

      <PublicHeader />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative isolate overflow-hidden bg-[#080A09] pt-[78px] text-white">

        {/* HERO IMAGE */}
        <Image
          src="/images/prospecting-hero.jpeg"
          alt="Équipe de prospection minière de Barack Mining Investment"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#050606]/68" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050606]/85 via-[#050606]/58 to-[#050606]/20" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#050606]/15 via-[#050606]/45 to-[#050606]/96" />

        {/* GOLD ATMOSPHERE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,rgba(225,196,135,0.16),transparent_30%)]" />

        <div className="absolute -left-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#C69B52]/[0.07] blur-3xl" />

        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.08] blur-3xl" />

        {/* SUBTLE GRID */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-25" />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto flex min-h-[610px] w-full max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-10">

          <div className="w-full">

            <div className="max-w-4xl">

              {/* EYEBROW */}
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#E1C487]/25 bg-[#E1C487]/[0.07] px-4 py-2.5 backdrop-blur-md">

                <span className="h-1.5 w-1.5 rounded-full bg-[#E1C487] shadow-[0_0_12px_rgba(225,196,135,0.70)]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E1C487]">
                  Activité • Prospection
                </span>

              </div>

              {/* TITLE */}
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.01] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[72px]">

                Prospection{' '}

                <span className="bg-gradient-to-r from-[#F0D79F] via-[#D8B86D] to-[#B78A3C] bg-clip-text text-transparent">
                  minière
                </span>

              </h1>

              {/* DESCRIPTION */}
              <p className="mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                Identifier les opportunités et les zones à potentiel minéral
                à travers une évaluation rigoureuse du terrain, des données
                géologiques et des analyses techniques.
              </p>

              {/* TAGS */}
              <div className="mt-9 flex flex-wrap gap-2.5">

                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/65 backdrop-blur-md">
                  Identification
                </span>

                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/65 backdrop-blur-md">
                  Échantillonnage
                </span>

                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/65 backdrop-blur-md">
                  Analyse géochimique
                </span>

                <span className="inline-flex items-center rounded-full border border-[#E1C487]/20 bg-[#E1C487]/[0.06] px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E1C487] backdrop-blur-md">
                  Évaluation initiale
                </span>

              </div>

              {/* SIGNATURE */}
              <div className="mt-12 flex items-center gap-5">

                <div className="h-px w-14 bg-white/15" />

                <div className="relative h-10 w-10 shrink-0">

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
        </div>

        {/* GOLD EDGE */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/65 to-transparent" />

      </section>

      {/* =========================================================
          CONTENU
      ========================================================= */}

      <ActivityDetailClient />
    </>
  )
}