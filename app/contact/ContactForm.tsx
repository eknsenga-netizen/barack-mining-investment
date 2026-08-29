'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  X,
  UserRound,
  Mail,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)

  const [success, setSuccess] = useState(false)

  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setLoading(true)
    setError(null)

    const form = e.currentTarget

    const formData = new FormData(form)

    const data = {
      name: String(
        formData.get('name') || ''
      ).trim(),

      email: String(
        formData.get('email') || ''
      ).trim(),

      message: String(
        formData.get('message') || ''
      ).trim(),
    }

    try {
      const res = await fetch(
        '/api/contact',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (!res.ok) {
        let message =
          'Erreur lors de l’envoi'

        try {
          const err =
            await res.json()

          if (
            err &&
            typeof err.message ===
              'string'
          ) {
            message = err.message
          }
        } catch {
          // Réponse non JSON
        }

        throw new Error(message)
      }

      setSuccess(true)

      form.reset()

      window.setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* =====================================================
          MESSAGE SUCCÈS
      ===================================================== */}

      {success && (
        <div className="relative overflow-hidden rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4">

          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl" />

          <div className="relative flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2
                size={19}
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Message envoyé
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-700/75">
                Nous vous répondrons
                dans les plus brefs délais.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          MESSAGE ERREUR
      ===================================================== */}

      {error && (
        <div className="relative overflow-hidden rounded-[20px] border border-red-200 bg-red-50 px-5 py-4">

          <div className="relative flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <X
                size={19}
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold text-red-800">
                Impossible d’envoyer le message
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700/75">
                {error}
              </p>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          NOM
      ===================================================== */}

      <div>

        <label
          htmlFor="name"
          className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400"
        >
          Nom complet

          <span className="ml-1 text-[#B8873F]">
            *
          </span>
        </label>

        <div className="relative">

          <UserRound
            size={16}
            strokeWidth={1.7}
            className="field-icon"
          />

          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Votre nom complet"
            className="form-input pl-11"
          />

        </div>
      </div>

      {/* =====================================================
          EMAIL
      ===================================================== */}

      <div>

        <label
          htmlFor="email"
          className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400"
        >
          Adresse email

          <span className="ml-1 text-[#B8873F]">
            *
          </span>
        </label>

        <div className="relative">

          <Mail
            size={16}
            strokeWidth={1.7}
            className="field-icon"
          />

          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="form-input pl-11"
          />

        </div>
      </div>

      {/* =====================================================
          MESSAGE
      ===================================================== */}

      <div>

        <label
          htmlFor="message"
          className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-stone-400"
        >
          Votre message

          <span className="ml-1 text-[#B8873F]">
            *
          </span>
        </label>

        <div className="relative">

          <MessageSquare
            size={16}
            strokeWidth={1.7}
            className="absolute left-4 top-4 text-stone-400"
          />

          <textarea
            id="message"
            name="message"
            required
            rows={7}
            placeholder="Décrivez votre demande, votre projet ou votre besoin..."
            className="form-input min-h-[180px] resize-y py-4 pl-11"
          />

        </div>

        <p className="mt-2 text-[9px] leading-5 text-stone-300">
          Présentez les informations essentielles
          permettant de comprendre votre demande.
        </p>

      </div>

      {/* =====================================================
          CONFIDENTIALITÉ
      ===================================================== */}

      <div className="relative flex items-start gap-3 overflow-hidden rounded-[18px] border border-stone-200 bg-[#FBFAF7] px-4 py-3.5">

        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#D7B66C]/60 to-transparent" />

        <ShieldCheck
          size={15}
          className="mt-0.5 shrink-0 text-[#9B793E]"
          strokeWidth={1.7}
        />

        <p className="text-[10px] leading-5 text-stone-400">
          Votre message est transmis à Barack Mining
          Investment afin de traiter votre demande.
        </p>

      </div>

      {/* =====================================================
          BOUTON
      ===================================================== */}

      <button
        type="submit"
        disabled={loading}
        className="group relative flex h-13 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-[#D7B66C]/60 bg-gradient-to-r from-[#B8873F] via-[#D7B66C] to-[#9D7230] px-6 text-sm font-semibold text-[#11100B] shadow-[0_12px_30px_rgba(184,137,63,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_16px_34px_rgba(184,137,63,0.24)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
      >

        {/* REFLET */}
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />

        <span className="relative z-10 flex items-center gap-3">

          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#11100B]/25 border-t-[#11100B]" />

              Envoi en cours...
            </>
          ) : (
            <>
              Envoyer le message

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}

        </span>

      </button>

      {/* =====================================================
          NOTE
      ===================================================== */}

      <div className="flex items-center justify-center gap-2 pt-1">

        <span className="h-1 w-1 rounded-full bg-[#B8873F]" />

        <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-stone-300">
          Barack Mining Investment
        </span>

        <span className="h-1 w-1 rounded-full bg-[#E1C487]" />

      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style jsx>{`
        .form-input {
          width: 100%;
          min-height: 48px;
          border-radius: 14px;
          border: 1px solid rgb(231 229 228);
          background: rgb(250 250 248);
          padding-right: 16px;
          font-size: 14px;
          line-height: 1.5;
          color: rgb(28 25 23);
          outline: none;
          transition:
            border-color 200ms ease,
            box-shadow 200ms ease,
            background 200ms ease,
            transform 200ms ease;
        }

        .form-input::placeholder {
          color: rgb(168 162 158);
        }

        .form-input:hover {
          border-color: rgb(211 190 149);
        }

        .form-input:focus {
          border-color: rgb(184 137 63);
          background: white;
          box-shadow:
            0 0 0 3px rgb(199 156 77 / 10%);
        }

        .form-input:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        textarea.form-input {
          min-height: 180px;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgb(168 162 158);
          pointer-events: none;
        }
      `}</style>

    </form>
  )
}