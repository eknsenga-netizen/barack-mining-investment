import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import PublicHeader from '../(public)/PublicHeader'

import {
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'À propos | Barack Mining Investment',
  description:
    'Découvrez la vision, la mission et les valeurs de Barack Mining Investment.',
}

export default function AboutPage() {
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
          src="/images/about-hero.jpg"
          alt="À propos de Barack Mining Investment"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-[#050606]/65" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#050606]/25 via-[#050606]/55 to-[#050606]/92" />

        {/* GOLD ATMOSPHERE */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(225,196,135,0.16),transparent_30%)]" />

        <div className="absolute -left-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#C69B52]/[0.07] blur-3xl" />

        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#E1C487]/[0.08] blur-3xl" />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-4xl text-center">

            {/* EYEBROW */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E1C487]/25 bg-[#E1C487]/[0.07] px-4 py-2 backdrop-blur-md">

              <span className="h-1.5 w-1.5 rounded-full bg-[#E1C487] shadow-[0_0_12px_rgba(225,196,135,0.70)]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E1C487]">
                À propos de nous
              </span>

            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-semibold leading-[1.03] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[72px]">

              À propos de{' '}

              <span className="bg-gradient-to-r from-[#F0D79F] via-[#D8B86D] to-[#B78A3C] bg-clip-text text-transparent">
                Barack Mining Investment
              </span>

            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
              Un partenaire stratégique et opérationnel dans l’écosystème
              minier.
            </p>

            {/* GOLD LINE */}
            <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#E1C487] to-transparent" />

          </div>
        </div>

        {/* BOTTOM GOLD EDGE */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/65 to-transparent" />

      </section>

      {/* =========================================================
          QUI SOMMES-NOUS
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-24 sm:py-28 lg:py-32">

        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">

            {/* TEXT */}
            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-[#B8873F]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                  Qui sommes-nous
                </p>

              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                Construire des opportunités.
                <br />

                <span className="text-stone-400">
                  Créer une valeur durable.
                </span>

              </h2>

              <div className="mt-8 max-w-xl space-y-5">

                <p className="text-base leading-8 text-stone-600">
                  Barack Mining Investment est une entreprise stratégique et
                  opérationnelle dans le secteur minier, intervenant sur toute
                  la chaîne de valeur : de l’identification des opportunités à
                  l’accompagnement des investisseurs et des communautés.
                </p>

                <p className="text-base leading-8 text-stone-600">
                  Notre approche combine expertise technique, connaissance du
                  terrain et vision à long terme pour créer des partenariats
                  solides et durables.
                </p>

              </div>

              {/* SIGNATURE */}
              <div className="mt-10 flex items-center gap-4">

                <div className="h-10 w-px bg-gradient-to-b from-[#B8873F] to-[#E1C487]/20" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                  Expertise • Terrain • Vision
                </span>

              </div>

            </div>

            {/* IMAGE */}
            <div className="relative">

              <div className="absolute -inset-4 rounded-[30px] border border-[#C69B52]/15" />

              <div className="absolute -inset-1 rounded-[27px] border border-[#E1C487]/10" />

              <div className="relative h-[360px] overflow-hidden rounded-[24px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:h-[430px] lg:h-[520px]">

                <Image
                  src="/images/about-team.jpg"
                  alt="Équipe de Barack Mining Investment"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/70 via-transparent to-transparent" />

                {/* GOLD EDGE */}
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#E1C487]/65 to-transparent" />

                {/* SIGNATURE */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-5">

                  <div className="flex items-end gap-4">

                    {/* LOGO */}
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">

                      <Image
                        src="/images/logo-bmi.png"
                        alt="Barack Mining Investment"
                        width={48}
                        height={48}
                        className="h-10 w-auto object-contain"
                      />

                    </div>

                    <div>

                      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/60">
                        Barack Mining Investment
                      </p>

                      <p className="mt-1 text-sm font-medium text-white">
                        Une vision tournée vers l'avenir.
                      </p>

                    </div>

                  </div>

                  <span className="hidden h-10 w-10 rounded-full border border-[#E1C487]/20 bg-white/10 backdrop-blur-md sm:block" />

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          VISION / MISSION / VALEURS
      ========================================================= */}

      <section className="relative overflow-hidden border-y border-stone-200/70 bg-white py-24 sm:py-28">

        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="mx-auto mb-14 max-w-2xl text-center">

            <div className="mx-auto mb-5 flex items-center justify-center gap-3">

              <span className="h-px w-8 bg-[#B8873F]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                Notre identité
              </span>

              <span className="h-px w-8 bg-[#B8873F]" />

            </div>

            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">

              Une vision claire,

              <span className="bg-gradient-to-r from-[#B8873F] via-[#D0AA61] to-[#9B7334] bg-clip-text text-transparent">
                {' '}des engagements solides.
              </span>

            </h2>

          </div>

          <div className="grid gap-5 lg:grid-cols-3">

            {/* VISION */}
            <div className="group relative overflow-hidden rounded-[24px] border border-stone-200 bg-[#FBFAF7] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#C69B52]/35 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">

              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#C69B52]/[0.05] blur-2xl transition-transform duration-500 group-hover:scale-150" />

              <div className="relative">

                <div className="mb-8 flex items-center justify-between">

                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A0C0B] text-sm font-bold text-[#E1C487]">
                    01
                  </span>

                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-stone-300">
                    Vision
                  </span>

                </div>

                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#0A0C0B]">
                  Notre Vision
                </h3>

                <p className="mt-5 text-sm leading-7 text-stone-600">
                  Devenir un acteur de référence dans l’accompagnement des
                  projets miniers en Afrique, en alliant performance économique
                  et responsabilité sociale.
                </p>

              </div>
            </div>

            {/* MISSION */}
            <div className="group relative overflow-hidden rounded-[24px] border border-[#C69B52]/20 bg-[#0A0C0B] p-7 text-white shadow-[0_20px_50px_rgba(10,12,11,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D7B66C]/45 hover:shadow-[0_25px_60px_rgba(10,12,11,0.16)] sm:p-8">

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#D7B66C]/[0.08] blur-2xl transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">

                <div className="mb-8 flex items-center justify-between">

                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#B8873F] via-[#D7B66C] to-[#9D7230] text-sm font-bold text-[#15120C] shadow-[0_10px_25px_rgba(199,156,77,0.16)]">
                    02
                  </span>

                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E1C487]/45">
                    Mission
                  </span>

                </div>

                <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">
                  Notre Mission
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/60">
                  Identifier, développer et accompagner des projets miniers en
                  créant de la valeur pour les partenaires, les investisseurs
                  et les communautés.
                </p>

              </div>
            </div>

            {/* VALEURS */}
            <div className="group relative overflow-hidden rounded-[24px] border border-stone-200 bg-[#FBFAF7] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#C69B52]/35 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">

              <div className="absolute bottom-0 right-0 h-28 w-28 rounded-full bg-[#E1C487]/[0.07] blur-2xl transition-transform duration-500 group-hover:scale-125" />

              <div className="relative">

                <div className="mb-8 flex items-center justify-between">

                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E1C487]/15 text-sm font-bold text-[#9B793E]">
                    03
                  </span>

                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-stone-300">
                    Valeurs
                  </span>

                </div>

                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#0A0C0B]">
                  Nos Valeurs
                </h3>

                <ul className="mt-5 space-y-3 text-sm text-stone-600">

                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />
                    <span>
                      Intégrité et transparence
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />
                    <span>
                      Responsabilité sociétale
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />
                    <span>
                      Partenariat durable
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#B8873F] to-[#E1C487]" />
                    <span>
                      Excellence opérationnelle
                    </span>
                  </li>

                </ul>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="bg-[#F5F3EE] px-6 py-20 sm:px-8 sm:py-24 lg:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-[30px] border border-[#C69B52]/15 bg-[#0A0C0B] px-7 py-12 text-white shadow-[0_30px_80px_rgba(10,12,11,0.10)] sm:px-10 sm:py-14 lg:px-14">

            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#D7B66C]/[0.08] blur-3xl" />

            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#B8873F]/[0.06] blur-3xl" />

            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/35 to-transparent" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              <div className="max-w-2xl">

                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E1C487]">
                  Construisons ensemble
                </p>

                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
                  Découvrez les opportunités de Barack Mining Investment.
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/45">
                  Explorez notre écosystème, nos activités et les différentes
                  possibilités de collaboration.
                </p>

              </div>

              <Link
                href="/partnerships"
                className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full border border-[#D7B66C]/70 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-6 text-sm font-semibold text-[#0B0B08] shadow-[0_12px_30px_rgba(199,156,77,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
              >
                Découvrir nos partenariats

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
