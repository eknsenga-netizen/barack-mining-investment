'use client'

import { FormEvent, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Vérifie si une session existe déjà.
   */
  useEffect(() => {
    let mounted = true

    const checkExistingSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (session) {
          router.replace('/admin')
          router.refresh()
          return
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        if (mounted) {
          setCheckingSession(false)
        }
      }
    }

    checkExistingSession()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (loading) return

    setError(null)
    setLoading(true)

    try {
      const cleanEmail = email.trim().toLowerCase()

      if (!cleanEmail || !password) {
        setError(
          'Veuillez renseigner votre adresse e-mail et votre mot de passe.'
        )
        return
      }

      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (loginError) {
        setError(
          'Adresse e-mail ou mot de passe incorrect. Vérifiez vos identifiants et réessayez.'
        )
        return
      }

      if (!data.session) {
        setError(
          'La session n’a pas pu être établie. Veuillez réessayer.'
        )
        return
      }

      router.replace('/admin')
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)

      setError(
        'Une erreur inattendue est survenue. Veuillez réessayer.'
      )
    } finally {
      setLoading(false)
    }
  }

  /* =========================================================
     VÉRIFICATION SESSION
  ========================================================= */

  if (checkingSession) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070908] text-white">

        {/* ATMOSPHERE */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D7B66C]/[0.05] blur-3xl" />

          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#B8873F]/[0.05] blur-3xl" />

          <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#E1C487]/[0.05] blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center">

          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] border border-[#D7B66C]/25 bg-[#0D100E] shadow-[0_22px_55px_rgba(0,0,0,0.35)]">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.10),transparent_58%)]" />

            <Image
              src="/images/logo-bmi.png"
              alt="Barack Mining Investment"
              width={48}
              height={48}
              priority
              className="relative z-10 h-10 w-auto object-contain"
            />

          </div>

          <div className="mt-6 flex items-center gap-3">

            <span className="h-px w-9 bg-gradient-to-r from-transparent to-[#D7B66C]/60" />

            <span className="text-[9px] font-bold uppercase tracking-[0.30em] text-[#D7B66C]">
              Vérification sécurisée
            </span>

            <span className="h-px w-9 bg-gradient-to-l from-transparent to-[#D7B66C]/60" />

          </div>

          <div className="mt-5 h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-[#D7B66C]" />

        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F2EC] text-[#0A0C0B]">

      {/* =========================================================
          PRIVATE HEADER
      ========================================================= */}

      <header className="relative z-20 border-b border-[#D7B66C]/15 bg-[#080A09] text-white">

        {/* TOP GOLD LINE */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E1C487]/65 to-transparent" />

        <div className="mx-auto flex h-[82px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          {/* BRAND */}
          <div className="flex items-center gap-3.5">

            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[13px] border border-[#D7B66C]/25 bg-[#101310] shadow-[0_8px_25px_rgba(0,0,0,0.22)]">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_58%)]" />

              <Image
                src="/images/logo-bmi.png"
                alt="Barack Mining Investment"
                width={44}
                height={44}
                priority
                className="relative z-10 h-8 w-auto object-contain"
              />

            </div>

            <div>

              <p className="text-[12px] font-bold tracking-[0.16em] text-white">
                BARACK MINING
              </p>

              <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.30em] text-[#E1C487]/65">
                Investment
              </p>

            </div>

          </div>

          {/* PRIVATE AREA */}
          <div className="flex items-center gap-3">

            <div className="hidden h-8 w-px bg-white/10 sm:block" />

            <div className="flex items-center gap-2 rounded-full border border-[#D7B66C]/20 bg-white/[0.04] px-3 py-2 backdrop-blur-md">

              <ShieldCheck
                size={14}
                strokeWidth={1.7}
                className="text-[#E1C487]"
              />

              <span className="text-[9px] font-bold uppercase tracking-[0.20em] text-white/55">
                Espace agents
              </span>

            </div>

          </div>

        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#D7B66C]/35 to-transparent" />

      </header>

      {/* =========================================================
          LOGIN AREA
      ========================================================= */}

      <div className="relative flex min-h-[calc(100vh-83px)] items-center overflow-hidden px-5 py-12 sm:px-8 sm:py-16">

        {/* BACKGROUND */}
        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D7B66C]/[0.045] blur-3xl" />

          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#B8873F]/[0.045] blur-3xl" />

          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#E1C487]/[0.055] blur-3xl" />

          {/* FIN PETIT MOTIF */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,25,15,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,25,15,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

        </div>

        <div className="relative z-10 mx-auto w-full max-w-[470px]">

          {/* =====================================================
              INTRO
          ===================================================== */}

          <div className="mb-8 text-center">

            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#C69B52]/20 bg-white/75 px-4 py-2 shadow-sm backdrop-blur-md">

              <span className="h-1.5 w-1.5 rounded-full bg-[#D7B66C] shadow-[0_0_9px_rgba(215,182,108,0.55)]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#947238]">
                Portail sécurisé
              </span>

            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-[-0.045em] text-[#0A0C0B] sm:text-4xl">
              Espace agents
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/50">
              Connectez-vous pour accéder à l’environnement privé
              d’administration de Barack Mining Investment.
            </p>

            <div className="mx-auto mt-5 flex items-center justify-center gap-3">

              <span className="h-px w-8 bg-[#C69B52]/35" />

              <span className="text-[8px] font-bold uppercase tracking-[0.27em] text-stone-400">
                Authorized personnel only
              </span>

              <span className="h-px w-8 bg-[#C69B52]/35" />

            </div>

          </div>

          {/* =====================================================
              LOGIN CARD
          ===================================================== */}

          <section className="relative overflow-hidden rounded-[30px] border border-[#C69B52]/18 bg-white shadow-[0_35px_90px_rgba(10,12,11,0.10)]">

            {/* GOLD FRAME */}
            <div className="pointer-events-none absolute inset-2 rounded-[25px] border border-[#D7B66C]/[0.08]" />

            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#D7B66C]/75 to-transparent" />

            {/* CARD HEADER */}
            <div className="relative border-b border-stone-100 bg-[#FBFAF7] px-6 py-6 sm:px-8">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0C0B] text-[#E1C487]">
                  <LockKeyhole
                    size={17}
                    strokeWidth={1.7}
                  />
                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#947238]">
                    Authentification
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#0A0C0B]">
                    Connexion à l’administration
                  </p>

                </div>

              </div>

            </div>

            {/* FORM */}
            <div className="relative p-6 sm:p-8">

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* EMAIL */}
                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#0A0C0B]"
                  >
                    Adresse e-mail
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="agent@barackmining.com"
                      required
                      disabled={loading}
                      className="h-14 w-full rounded-2xl border border-stone-200 bg-[#FAFAF8] pl-12 pr-4 text-sm text-[#0A0C0B] outline-none transition-all duration-200 placeholder:text-black/25 hover:border-[#D7B66C]/35 focus:border-[#C69B52] focus:bg-white focus:ring-4 focus:ring-[#D7B66C]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                </div>

                {/* PASSWORD */}
                <div>

                  <div className="mb-2 flex items-center justify-between gap-4">

                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-[#0A0C0B]"
                    >
                      Mot de passe
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        router.push('/forgot-password')
                      }
                      disabled={loading}
                      className="text-xs font-medium text-[#947238] transition-colors hover:text-[#705523] disabled:opacity-50"
                    >
                      Mot de passe oublié ?
                    </button>

                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={18}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Entrez votre mot de passe"
                      required
                      disabled={loading}
                      className="h-14 w-full rounded-2xl border border-stone-200 bg-[#FAFAF8] pl-12 pr-12 text-sm text-[#0A0C0B] outline-none transition-all duration-200 placeholder:text-black/25 hover:border-[#D7B66C]/35 focus:border-[#C69B52] focus:bg-white focus:ring-4 focus:ring-[#D7B66C]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? 'Masquer le mot de passe'
                          : 'Afficher le mot de passe'
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 transition-colors hover:text-[#947238] disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* ERROR */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >

                    <TriangleAlert
                      size={18}
                      className="mt-0.5 shrink-0"
                    />

                    <p className="leading-6">
                      {error}
                    </p>

                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[#D7B66C]/60 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-5 text-sm font-semibold text-[#11100B] shadow-[0_14px_30px_rgba(184,137,63,0.17)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_18px_38px_rgba(184,137,63,0.23)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >

                  {/* HIGHLIGHT */}
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />

                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#11100B]/20 border-t-[#11100B]" />

                      <span className="relative z-10">
                        Connexion en cours...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">
                        Accéder à l’administration
                      </span>

                      <ArrowRight
                        size={18}
                        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}

                </button>

              </form>

              {/* SECURITY INFO */}
              <div className="mt-7 flex items-start gap-3 border-t border-stone-200 pt-6">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2EAD9] text-[#947238]">

                  <ShieldCheck
                    size={18}
                    strokeWidth={1.7}
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold text-[#0A0C0B]">
                    Environnement protégé
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-black/45">
                    Cet espace est exclusivement réservé aux agents
                    autorisés de Barack Mining Investment.
                  </p>

                </div>

              </div>

            </div>
          </section>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <footer className="mt-7">

            <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between">

              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-300">
                Private administration portal
              </span>

              <div className="flex items-center gap-2">

                <span className="h-px w-5 bg-[#C69B52]/30" />

                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#947238]">
                  Barack Mining Investment
                </span>

                <span className="h-px w-5 bg-[#C69B52]/30" />

              </div>

            </div>

            <p className="mt-3 text-center text-[10px] text-black/25">
              Accès strictement réservé au personnel autorisé.
            </p>

          </footer>

        </div>
      </div>

    </main>
  )
}
