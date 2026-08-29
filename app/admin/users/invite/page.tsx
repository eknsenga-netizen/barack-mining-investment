'use client'

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Mail,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type Role =
  | 'super_admin'
  | 'admin'
  | 'opportunity_manager'
  | 'content_manager'
  | 'operations_manager'
  | 'viewer'

type Profile = {
  id: string
  email: string
  role: Role
}

type RoleOption = {
  value: Role
  label: string
  description: string
}

/* ============================================================
   CONSTANTS
============================================================ */

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'super_admin',
    label: 'Super Admin',
    description:
      'Full administrative access to the workspace.',
  },
  {
    value: 'admin',
    label: 'Administrator',
    description:
      'Manage users, content, opportunities and administration.',
  },
  {
    value: 'opportunity_manager',
    label: 'Opportunity Manager',
    description:
      'Manage opportunities and relationship workflows.',
  },
  {
    value: 'content_manager',
    label: 'Content Manager',
    description:
      'Manage public website content, news and team.',
  },
  {
    value: 'operations_manager',
    label: 'Operations Manager',
    description:
      'Manage operational information and related workflows.',
  },
  {
    value: 'viewer',
    label: 'Viewer',
    description:
      'Read-only access to permitted workspace information.',
  },
]

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
]

/* ============================================================
   HELPERS
============================================================ */

function isValidEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  )
}

function getInitials(
  value: string
) {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (
    parts.length === 0
  ) {
    return 'BMI'
  }

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">

      <div className="text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#0A0C0B] shadow-[0_12px_35px_rgba(10,12,11,0.16)]">

          <img
            src="/images/logo-bmi.png"
            alt="Barack Mining Investment"
            className="max-h-9 max-w-[46px] object-contain brightness-0 invert"
          />

        </div>

        <div className="mx-auto mt-5 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

        <p className="mt-4 text-sm font-semibold text-slate-900">
          Preparing secure invitation
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying administration privileges...
        </p>

      </div>
    </div>
  )
}

/* ============================================================
   SECTION
============================================================ */

function Section({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number: string
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">

        <div className="flex items-start gap-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[10px] font-bold tracking-[0.12em] text-white">
            {number}
          </div>

          <div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A98B4F]">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-slate-950">
              {title}
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              {description}
            </p>

          </div>

        </div>

      </div>

      <div className="p-5 sm:p-7">
        {children}
      </div>

    </section>
  )
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between gap-3">

        <label className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">

          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}

        </label>

        {hint && (
          <span className="text-[10px] text-slate-400">
            {hint}
          </span>
        )}

      </div>

      {children}

    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function InviteUserPage() {
  const router = useRouter()
  const supabase = createClient()

  /* ----------------------------------------------------------
     ACCESS
  ---------------------------------------------------------- */

  const [profile, setProfile] =
    useState<Profile | null>(
      null
    )

  const [authorized, setAuthorized] =
    useState(false)

  const [checkingAccess, setCheckingAccess] =
    useState(true)

  /* ----------------------------------------------------------
     FORM
  ---------------------------------------------------------- */

  const [email, setEmail] =
    useState('')

  const [fullName, setFullName] =
    useState('')

  const [role, setRole] =
    useState<Role>('viewer')

  /* ----------------------------------------------------------
     UI
  ---------------------------------------------------------- */

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(
      null
    )

  const [success, setSuccess] =
    useState<string | null>(
      null
    )

  /* ==========================================================
     ACCESS CHECK
  ========================================================== */

  const verifyAccess =
    useCallback(
      async () => {
        setCheckingAccess(
          true
        )

        try {
          const {
            data: {
              user,
            },
          } =
            await supabase.auth.getUser()

          if (!user) {
            router.replace(
              '/login'
            )
            return
          }

          const {
            data: currentProfile,
            error: profileError,
          } =
            await supabase
              .from('profiles')
              .select(
                'id, email, role'
              )
              .eq(
                'id',
                user.id
              )
              .maybeSingle()

          if (
            profileError ||
            !currentProfile
          ) {
            router.replace(
              '/login'
            )
            return
          }

          const typedProfile =
            currentProfile as Profile

          setProfile(
            typedProfile
          )

          setAuthorized(
            AUTHORIZED_ROLES.includes(
              typedProfile.role
            )
          )
        } catch (
          accessError
        ) {
          console.error(
            'Invite access verification failed:',
            accessError
          )

          router.replace(
            '/login'
          )
        } finally {
          setCheckingAccess(
            false
          )
        }
      },
      [
        router,
        supabase,
      ]
    )

  useEffect(() => {
    verifyAccess()
  }, [
    verifyAccess,
  ])

  /* ==========================================================
     AUTH LISTENER
  ========================================================== */

  useEffect(() => {
    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session
        ) => {
          if (
            event ===
              'SIGNED_OUT' ||
            !session?.user
          ) {
            router.replace(
              '/login'
            )
          }
        }
      )

    return () => {
      subscription.unsubscribe()
    }
  }, [
    router,
    supabase,
  ])

  /* ==========================================================
     DERIVED
  ========================================================== */

  const selectedRole =
    useMemo(
      () =>
        ROLE_OPTIONS.find(
          (
            option
          ) =>
            option.value ===
            role
        ),
      [
        role,
      ]
    )

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateForm =
    () => {
      const cleanEmail =
        email.trim()

      const cleanName =
        fullName.trim()

      if (!cleanEmail) {
        return 'Email address is required.'
      }

      if (
        !isValidEmail(
          cleanEmail
        )
      ) {
        return 'Please enter a valid email address.'
      }

      if (
        cleanEmail.length >
        254
      ) {
        return 'The email address is too long.'
      }

      if (
        cleanName.length >
        120
      ) {
        return 'The full name is too long.'
      }

      if (
        !ROLE_OPTIONS.some(
          (
            option
          ) =>
            option.value ===
            role
        )
      ) {
        return 'Please select a valid role.'
      }

      return null
    }

  /* ==========================================================
     INVITE
  ========================================================== */

  const handleInvite =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault()

      if (
        loading ||
        !authorized
      ) {
        return
      }

      setError(
        null
      )

      setSuccess(
        null
      )

      const validationError =
        validateForm()

      if (
        validationError
      ) {
        setError(
          validationError
        )
        return
      }

      const cleanEmail =
        email
          .trim()
          .toLowerCase()

      const cleanName =
        fullName.trim()

      setLoading(
        true
      )

      try {
        /* ------------------------------------------------------
           Re-check current session
        ------------------------------------------------------ */

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser()

        if (!user) {
          router.replace(
            '/login'
          )
          return
        }

        /* ------------------------------------------------------
           Re-check actor role
        ------------------------------------------------------ */

        const {
          data: actorProfile,
          error: actorError,
        } =
          await supabase
            .from('profiles')
            .select(
              'id, email, role'
            )
            .eq(
              'id',
              user.id
            )
            .maybeSingle()

        if (
          actorError ||
          !actorProfile ||
          !AUTHORIZED_ROLES.includes(
            actorProfile.role as Role
          )
        ) {
          throw new Error(
            'Your current account is no longer authorized to invite users.'
          )
        }

        /* ------------------------------------------------------
           Server-side invitation
        ------------------------------------------------------ */

        const response =
          await fetch(
            '/api/admin/users/invite',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify({
                email:
                  cleanEmail,
                full_name:
                  cleanName ||
                  null,
                role,
              }),
            }
          )

        const result =
          await response.json().catch(
            () => null
          )

        if (
          !response.ok
        ) {
          throw new Error(
            result?.message ||
              'Unable to send the invitation.'
          )
        }

        setSuccess(
          `Invitation sent to ${cleanEmail} with the role "${selectedRole?.label}".`
        )

        setEmail(
          ''
        )

        setFullName(
          ''
        )

        setRole(
          'viewer'
        )

        window.setTimeout(
          () => {
            router.push(
              '/admin/users'
            )
          },
          1800
        )
      } catch (
        inviteError
      ) {
        console.error(
          'User invitation failed:',
          inviteError
        )

        setError(
          inviteError instanceof
          Error
            ? inviteError.message
            : 'Unable to send the invitation.'
        )
      } finally {
        setLoading(
          false
        )
      }
    }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (
    checkingAccess
  ) {
    return <LoadingState />
  }

  /* ==========================================================
     ACCESS DENIED
  ========================================================== */

  if (
    !authorized
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="w-full max-w-md rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert size={23} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-950">
            Access restricted
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your current role does not have permission to invite users.
          </p>

          {profile?.email && (
            <p className="mt-3 text-xs text-slate-400">
              Signed in as {profile.email}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              router.replace(
                '/admin'
              )
            }
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </button>

        </div>
      </div>
    )
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <div className="mx-auto max-w-[1080px] space-y-6 pb-10">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/users'
              )
            }
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="text-xs font-medium text-slate-400">
            Administration
          </span>

          <span className="text-slate-300">
            /
          </span>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/users'
              )
            }
            className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
          >
            Users
          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="text-xs font-semibold text-slate-700">
            Invite
          </span>

        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div className="flex items-start gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#0A0C0B] shadow-[0_12px_30px_rgba(10,12,11,0.13)]">

              <img
                src="/images/logo-bmi.png"
                alt="Barack Mining Investment"
                className="max-h-9 max-w-[46px] object-contain brightness-0 invert"
              />

            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="inline-flex h-7 items-center rounded-full bg-[#F3EFE7] px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#94713F]">
                  User Administration
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Secure invitation
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                Invite User
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Invite a new authorized member to the Barack Mining Investment administration workspace.
              </p>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Inviter
            </p>

            <div className="mt-2 flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-[9px] font-bold text-white">
                {getInitials(
                  profile?.email ||
                    'BMI'
                )}
              </div>

              <div className="min-w-0">

                <p className="max-w-[190px] truncate text-xs font-semibold text-slate-900">
                  {profile?.email ||
                    'Administrator'}
                </p>

                <p className="text-[9px] uppercase tracking-wide text-slate-400">
                  {profile?.role
                    ? profile.role.replace(
                        /_/g,
                        ' '
                      )
                    : 'authorized'}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          FEEDBACK
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
            <CircleAlert size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              Invitation failed
            </p>

            <p className="mt-1 whitespace-pre-line text-xs leading-5 text-red-700/80">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setError(
                null
              )
            }
            className="rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
            <CheckCircle2 size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-emerald-800">
              Invitation sent successfully
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              {success}
            </p>

            <p className="mt-2 text-[10px] text-emerald-700/60">
              Returning to the user directory...
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setSuccess(
                null
              )
            }
            className="rounded-lg p-1 text-emerald-400 transition hover:bg-emerald-100 hover:text-emerald-700"
            aria-label="Dismiss success"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* ======================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={
          handleInvite
        }
        className="space-y-6"
      >

        {/* ====================================================
            01 IDENTITY
        ==================================================== */}

        <Section
          number="01"
          eyebrow="Invitation"
          title="User identity"
          description="Provide the account information that will be used to issue the secure invitation."
        >

          <div className="grid gap-5 lg:grid-cols-2">

            <Field
              label="Email address"
              required
              hint="Required"
            >

              <div className="relative">

                <Mail
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  maxLength={254}
                  autoComplete="email"
                  placeholder="user@barackmining.com"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                  required
                />

              </div>

            </Field>

            <Field
              label="Full name"
              hint="Optional"
            >

              <div className="relative">

                <UserRound
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={fullName}
                  onChange={(
                    event
                  ) =>
                    setFullName(
                      event.target.value
                    )
                  }
                  maxLength={120}
                  autoComplete="name"
                  placeholder="e.g. Jean Dupont"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                />

              </div>

            </Field>

          </div>

        </Section>

        {/* ====================================================
            02 ROLE
        ==================================================== */}

        <Section
          number="02"
          eyebrow="Authorization"
          title="Workspace role"
          description="Choose the level of access that should be assigned to the invited user."
        >

          <Field
            label="Role"
            required
          >

            <div className="relative">

              <select
                value={role}
                onChange={(
                  event
                ) =>
                  setRole(
                    event.target
                      .value as Role
                  )
                }
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
              >

                {ROLE_OPTIONS.map(
                  (
                    option
                  ) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {option.label}
                    </option>
                  )
                )}

              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

            </div>

          </Field>

          {selectedRole && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-[#D0A765]">
                  <ShieldCheck size={17} />
                </div>

                <div>

                  <p className="text-xs font-semibold text-slate-800">
                    {selectedRole.label}
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    {selectedRole.description}
                  </p>

                </div>

              </div>

            </div>
          )}

          <div className="mt-5 grid gap-2 sm:grid-cols-2">

            {ROLE_OPTIONS.map(
              (
                option
              ) => {
                const selected =
                  role ===
                  option.value

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      setRole(
                        option.value
                      )
                    }
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      selected
                        ? 'border-slate-950 bg-slate-950 text-white shadow-[0_8px_25px_rgba(10,12,11,0.10)]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >

                    <div className="min-w-0">

                      <p className="text-xs font-semibold">
                        {option.label}
                      </p>

                      <p
                        className={`mt-0.5 text-[10px] leading-4 ${
                          selected
                            ? 'text-white/50'
                            : 'text-slate-400'
                        }`}
                      >
                        {option.description}
                      </p>

                    </div>

                    {selected && (
                      <div className="ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D0A765] text-[#0A0C0B]">
                        <Check
                          size={11}
                          strokeWidth={3}
                        />
                      </div>
                    )}

                  </button>
                )
              }
            )}

          </div>

        </Section>

        {/* ====================================================
            03 SECURITY
        ==================================================== */}

        <section className="rounded-[26px] border border-slate-200/80 bg-[#0A0C0B] p-5 text-white shadow-[0_15px_45px_rgba(10,12,11,0.12)] sm:p-7">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#D0A765]">
              <ShieldCheck size={20} />
            </div>

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D0A765]">
                Secure invitation
              </p>

              <h3 className="mt-1 text-sm font-semibold">
                Access is issued through Supabase Auth
              </h3>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-white/45">
                The invitation is processed server-side. The browser never receives the Supabase service-role key. The final authorization boundary remains your authentication and RLS policies.
              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            ACTION BAR
        ==================================================== */}

        <div className="sticky bottom-4 z-20">

          <div className="flex flex-col justify-between gap-3 rounded-[22px] border border-slate-200 bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.13)] backdrop-blur-xl sm:flex-row sm:items-center">

            <div className="flex items-center gap-3 px-2">

              <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:flex">
                <Users size={15} />
              </div>

              <div>

                <p className="text-xs font-semibold text-slate-800">
                  {loading
                    ? 'Sending invitation...'
                    : 'Invitation ready'}
                </p>

                <p className="text-[10px] text-slate-400">
                  The selected role will be assigned when the invitation is created.
                </p>

              </div>

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                disabled={
                  loading
                }
                onClick={() =>
                  router.back()
                }
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <ArrowLeft size={14} />
                Previous
              </button>

              <button
                type="submit"
                disabled={
                  loading
                }
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-5 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={15} />
                    Send Invitation
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      </form>

    </div>
  )
}