import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import PublicHeader from '../(public)/PublicHeader'

import {
  ArrowRight,
  Droplets,
  GraduationCap,
  ShieldCheck,
  Users,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Impact & Communautés | Barack Mining Investment',
  description:
    'Découvrez l’engagement de Barack Mining Investment envers les communautés et le développement responsable.',
}

export default function ImpactPage() {
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

        <Image
          src="/images/impact-hero.jpg"
          alt="Engagement communautaire de Barack Mining Investment"
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
        <div className="relative z-10 mx-auto flex min-h-[572px] w-full max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-10">

          <div className="w-full">
            <div className="mx-auto max-w-4xl text-center">

              {/* LABEL */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E1C487]/25 bg-[#E1C487]/[0.07] px-4 py-2 backdrop-blur-md">

                <span className="h-1.5 w-1.5 rounded-full bg-[#E1C487] shadow-[0_0_12px_rgba(225,196,135,0.70)]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E1C487]">
                  Notre impact
                </span>

              </div>

              {/* TITLE */}
              <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl md:text-6xl lg:text-[72px]">

                Impact &{' '}

                <span className="bg-gradient-to-r from-[#F0D79F] via-[#D8B86D] to-[#B78A3C] bg-clip-text text-transparent">
                  Communautés
                </span>

              </h1>

              {/* DESCRIPTION */}
              <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                Notre engagement envers les communautés et le développement
                responsable.
              </p>

              {/* LOGO SIGNATURE */}
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

            </div>
          </div>
        </div>

        {/* GOLD EDGE */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/65 to-transparent" />

      </section>

      {/* =========================================================
          ENGAGEMENT
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-24 sm:py-28 lg:py-32">

        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">

            {/* TEXT */}
            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-9 bg-[#B8873F]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                  Notre engagement
                </p>

              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl lg:text-5xl">

                Des projets réels.
                <br />
                Des personnes réelles.
                <br />

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                  Une action responsable.
                </span>

              </h2>

              <div className="mt-8 max-w-xl space-y-5">

                <p className="text-base leading-8 text-stone-600">
                  Barack Mining Investment considère que le développement
                  responsable doit prendre en compte les communautés liées aux
                  projets dans lesquels nous intervenons.
                </p>

                <p className="text-base leading-8 text-stone-600">
                  Notre communication publique privilégie les actions qui
                  peuvent être documentées, vérifiées et présentées avec
                  honnêteté.
                </p>

              </div>

              {/* TRUST CARD */}
              <div className="mt-10 flex max-w-xl items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.04)]">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2EAD9] text-[#9B793E]">

                  <ShieldCheck
                    size={20}
                    strokeWidth={1.7}
                  />

                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-stone-400">
                    Transparence
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#0A0C0B]">
                    Communication fondée sur des actions documentées
                  </p>

                </div>

              </div>

            </div>

            {/* IMAGE */}
            <div className="relative">

              <div className="absolute -inset-4 rounded-[32px] border border-[#C69B52]/15" />

              <div className="absolute -inset-1 rounded-[29px] border border-[#E1C487]/10" />

              <div className="relative h-[380px] overflow-hidden rounded-[26px] bg-[#0A0C0B] shadow-[0_30px_80px_rgba(15,23,42,0.13)] sm:h-[470px] lg:h-[540px]">

                <Image
                  src="/images/impact-community.jpg"
                  alt="Communauté accompagnée par Barack Mining Investment"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/80 via-[#080A09]/15 to-transparent" />

                {/* GOLD EDGE */}
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#E1C487]/65 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">

                  <div className="flex items-end justify-between gap-5">

                    <div>

                      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50">
                        Engagement communautaire
                      </p>

                      <p className="mt-1 text-lg font-medium tracking-[-0.02em] text-white">
                        Créer une valeur qui dépasse le projet.
                      </p>

                    </div>

                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E1C487]/25 bg-white/10 backdrop-blur-md sm:flex">

                      <Users
                        size={17}
                        className="text-[#E1C487]"
                        strokeWidth={1.7}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          PROJETS & HISTOIRES
      ========================================================= */}

      <section className="relative overflow-hidden border-y border-stone-200/70 bg-white py-24 sm:py-28 lg:py-32">

        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          {/* HEADER */}
          <div className="mb-14 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

            <div className="max-w-2xl">

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#B8873F]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                  Projets & histoires
                </span>

              </div>

              <h3 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">

                Des initiatives concrètes,
                <br />

                <span className="bg-gradient-to-r from-[#B8873F] via-[#D1AB60] to-[#9B7334] bg-clip-text text-transparent">
                  un impact visible.
                </span>

              </h3>

            </div>

            <p className="max-w-sm text-sm leading-7 text-stone-500">
              Découvrez les initiatives concrètes que nous soutenons et les
              projets destinés à produire un impact durable.
            </p>

          </div>

          {/* PROJECTS */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* PROJECT 01 */}
            <article className="group overflow-hidden rounded-[28px] border border-stone-200 bg-[#FBFAF7] transition-all duration-500 hover:-translate-y-1 hover:border-[#C69B52]/25 hover:shadow-[0_28px_70px_rgba(15,23,42,0.09)]">

              {/* IMAGE */}
              <div className="relative h-[270px] overflow-hidden bg-[#111311]">

                <Image
                  src="/images/impact-school.jpg"
                  alt="Projet éducatif de Barack Mining Investment"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/80 via-[#080A09]/10 to-transparent" />

                <div className="absolute left-5 top-5">

                  <span className="inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                    Éducation
                  </span>

                </div>

                <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#E1C487]/25 bg-black/20 text-[#E1C487] backdrop-blur-md">

                  <GraduationCap
                    size={19}
                    strokeWidth={1.7}
                  />

                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/50">
                      Projet 01
                    </p>

                    <h4 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
                      Projet éducatif
                    </h4>

                  </div>

                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    01
                  </span>

                </div>

              </div>

              {/* CONTENT */}
              <div className="p-7 sm:p-8">

                <div className="flex items-center justify-between gap-5">

                  <h5 className="text-xl font-semibold tracking-[-0.03em] text-[#0A0C0B]">
                    Projet éducatif
                  </h5>

                  <span className="shrink-0 rounded-full bg-[#F1E8D6] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#947238]">
                    En cours
                  </span>

                </div>

                <p className="mt-4 max-w-lg text-sm leading-7 text-stone-500">
                  Construction d’une école primaire dans la province du
                  Katanga.
                </p>

                <div className="mt-7 h-px w-full bg-stone-200 transition-colors duration-300 group-hover:bg-[#C69B52]/30" />

                <div className="mt-5 flex items-center justify-between">

                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-300">
                    Éducation
                  </span>

                  <ArrowRight
                    size={16}
                    className="text-[#B8873F] transition-transform duration-300 group-hover:translate-x-1"
                  />

                </div>

              </div>

            </article>

            {/* PROJECT 02 */}
            <article className="group overflow-hidden rounded-[28px] border border-[#1A1E1B] bg-[#0A0C0B] text-white shadow-[0_24px_60px_rgba(10,12,11,0.12)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_75px_rgba(10,12,11,0.18)]">

              {/* IMAGE */}
              <div className="relative h-[270px] overflow-hidden bg-[#111311]">

                <Image
                  src="/images/impact-water.jpg"
                  alt="Forage d’eau communautaire"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/90 via-[#080A09]/15 to-transparent" />

                <div className="absolute left-5 top-5">

                  <span className="inline-flex items-center rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                    Accès à l’eau
                  </span>

                </div>

                <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#E1C487]/25 bg-black/20 text-[#E1C487] backdrop-blur-md">

                  <Droplets
                    size={19}
                    strokeWidth={1.7}
                  />

                </div>

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/50">
                      Projet 02
                    </p>

                    <h4 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">
                      Accès à l’eau
                    </h4>

                  </div>

                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    02
                  </span>

                </div>

              </div>

              {/* CONTENT */}
              <div className="p-7 sm:p-8">

                <div className="flex items-center justify-between gap-5">

                  <h5 className="text-xl font-semibold tracking-[-0.03em] text-white">
                    Accès à l’eau
                  </h5>

                  <span className="shrink-0 rounded-full border border-[#E1C487]/15 bg-[#E1C487]/[0.05] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#E1C487]">
                    Terminé
                  </span>

                </div>

                <p className="mt-4 max-w-lg text-sm leading-7 text-white/50">
                  Forage de puits dans trois villages de la région de Kolwezi.
                </p>

                <div className="mt-7 h-px w-full bg-white/10 transition-colors duration-300 group-hover:bg-[#E1C487]/30" />

                <div className="mt-5 flex items-center justify-between">

                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                    Accès à l’eau
                  </span>

                  <ArrowRight
                    size={16}
                    className="text-[#E1C487] transition-transform duration-300 group-hover:translate-x-1"
                  />

                </div>

              </div>

            </article>

          </div>

          {/* NOTE */}
          <div className="mt-8 rounded-2xl border border-dashed border-stone-200 bg-[#FBFAF7] px-6 py-5 sm:px-7">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-300">
                Note
              </span>

              <p className="text-xs italic leading-6 text-stone-400">
                * Ces exemples sont des placeholders. Seuls les projets
                réellement documentés seront affichés.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          PRINCIPES
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#F5F3EE] py-24 sm:py-28 lg:py-32">

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#C69B52]/[0.05] blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#E1C487]/[0.07] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-2xl text-center">

            <div className="mx-auto mb-5 flex items-center justify-center gap-3">

              <span className="h-px w-8 bg-[#B8873F]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9B793E]">
                Notre approche
              </span>

              <span className="h-px w-8 bg-[#B8873F]" />

            </div>

            <h3 className="text-3xl font-semibold tracking-[-0.05em] text-[#0A0C0B] sm:text-4xl">
              Un impact pensé dans la durée.
            </h3>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-500 sm:text-base">
              Notre ambition est de contribuer à des initiatives utiles,
              documentées et cohérentes avec les réalités des communautés.
            </p>

          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {/* CARD 01 */}
            <div className="rounded-[24px] border border-stone-200 bg-white p-7 shadow-[0_16px_45px_rgba(15,23,42,0.04)] sm:p-8">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A0C0B] text-[#E1C487]">

                <Users
                  size={19}
                  strokeWidth={1.7}
                />

              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9B793E]">
                Communautés
              </p>

              <h4 className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                Écouter les réalités locales
              </h4>

              <p className="mt-3 text-sm leading-7 text-stone-500">
                Prendre en compte les besoins et les réalités des populations
                concernées par les projets.
              </p>

            </div>

            {/* CARD 02 */}
            <div className="rounded-[24px] border border-stone-200 bg-white p-7 shadow-[0_16px_45px_rgba(15,23,42,0.04)] sm:p-8">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2EAD9] text-[#9B793E]">

                <ShieldCheck
                  size={19}
                  strokeWidth={1.7}
                />

              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9B793E]">
                Responsabilité
              </p>

              <h4 className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                Agir avec transparence
              </h4>

              <p className="mt-3 text-sm leading-7 text-stone-500">
                Présenter les actions réalisées avec une communication claire,
                honnête et documentée.
              </p>

            </div>

            {/* CARD 03 */}
            <div className="rounded-[24px] border border-stone-200 bg-white p-7 shadow-[0_16px_45px_rgba(15,23,42,0.04)] sm:p-8">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A0C0B] text-[#E1C487]">

                <Droplets
                  size={19}
                  strokeWidth={1.7}
                />

              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9B793E]">
                Durabilité
              </p>

              <h4 className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                Construire au-delà du projet
              </h4>

              <p className="mt-3 text-sm leading-7 text-stone-500">
                Favoriser des initiatives dont la valeur peut continuer à
                bénéficier aux communautés dans le temps.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="bg-[#F5F3EE] pb-20 sm:pb-24">

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="relative overflow-hidden rounded-[30px] border border-[#C69B52]/15 bg-[#0A0C0B] px-7 py-12 text-white shadow-[0_30px_80px_rgba(10,12,11,0.10)] sm:px-10 sm:py-14 lg:px-14">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D7B66C]/[0.08] blur-3xl" />

            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#B8873F]/[0.06] blur-3xl" />

            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/35 to-transparent" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

              <div className="max-w-2xl">

                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E1C487]">
                  Développement responsable
                </p>

                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  Construire des projets qui créent de la valeur pour tous.
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">
                  Vous avez un projet à impact, une initiative communautaire
                  ou une opportunité de partenariat ?
                </p>

              </div>

              <Link
                href="/contact"
                className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full border border-[#D7B66C]/70 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-6 text-sm font-semibold text-[#0B0B08] shadow-[0_12px_30px_rgba(199,156,77,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
              >
                Parlons de votre projet

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
