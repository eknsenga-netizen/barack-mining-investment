'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ImageIcon,
  Save,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react'

import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type Status =
  | 'active'
  | 'inactive'

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
  full_name: string | null
  role: Role
}

type TeamMemberRecord = {
  id: string
  full_name: string | null
  position: string | null
  bio: string | null
  photo_url: string | null
  display_order: number | null
  status: Status | null
  created_at: string
  updated_at: string
}

/* ============================================================
   CONSTANTS
============================================================ */

const STATUS_OPTIONS: {
  value: Status
  label: string
  description: string
}[] = [
  {
    value: 'active',
    label: 'Active',
    description:
      'Visible on the public team section.',
  },
  {
    value: 'inactive',
    label: 'Inactive',
    description:
      'Retained internally and not currently displayed.',
  },
]

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
  'content_manager',
]

/* ============================================================
   HELPERS
============================================================ */

function getStatusClass(
  status: Status
) {
  return status === 'active'
    ? 'bg-emerald-50 text-emerald-700'
    : 'bg-slate-100 text-slate-500'
}

function getInitials(
  value: string
) {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return 'BM'
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function isValidUrl(
  value: string
) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
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
            <span className="ml-1 text-[#A96F35]">
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
   SECTION
============================================================ */

function FormSection({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number?: string
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">

        <div className="flex items-start gap-4">

          {number && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[10px] font-bold tracking-[0.12em] text-white">
              {number}
            </div>
          )}

          <div className="min-w-0">

            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A98B4F]">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-slate-950">
              {title}
            </h2>

            {description && (
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                {description}
              </p>
            )}

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
          Preparing secure editor
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying access and loading the team member...
        </p>

      </div>
    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const supabase = createClient()

  /* ----------------------------------------------------------
     ACCESS
  ---------------------------------------------------------- */

  const [authorized, setAuthorized] =
    useState(false)

  const [checkingAccess, setCheckingAccess] =
    useState(true)

  const [profile, setProfile] =
    useState<Profile | null>(null)

  /* ----------------------------------------------------------
     DATA
  ---------------------------------------------------------- */

  const [loading, setLoading] =
    useState(true)

  const [member, setMember] =
    useState<TeamMemberRecord | null>(null)

  /* ----------------------------------------------------------
     UI
  ---------------------------------------------------------- */

  const [saving, setSaving] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [success, setSuccess] =
    useState(false)

  /* ----------------------------------------------------------
     FORM
  ---------------------------------------------------------- */

  const [fullName, setFullName] =
    useState('')

  const [position, setPosition] =
    useState('')

  const [bio, setBio] =
    useState('')

  const [photoUrl, setPhotoUrl] =
    useState('')

  const [displayOrder, setDisplayOrder] =
    useState(0)

  const [status, setStatus] =
    useState<Status>('active')

  /* ==========================================================
     ACCESS CHECK
  ========================================================== */

  const verifyAccess = useCallback(
    async () => {
      setCheckingAccess(true)

      try {
        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser()

        if (!user) {
          router.replace('/login')
          return
        }

        const {
          data: currentProfile,
          error: profileError,
        } =
          await supabase
            .from('profiles')
            .select(
              'id, email, full_name, role'
            )
            .eq('id', user.id)
            .maybeSingle()

        if (
          profileError ||
          !currentProfile
        ) {
          console.error(
            'Profile access error:',
            profileError
          )

          router.replace('/login')
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
      } catch (accessError) {
        console.error(
          'Access verification error:',
          accessError
        )

        router.replace('/login')
      } finally {
        setCheckingAccess(false)
      }
    },
    [router, supabase]
  )

  useEffect(() => {
    verifyAccess()
  }, [verifyAccess])

  /* ==========================================================
     AUTH STATE
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
            event === 'SIGNED_OUT' ||
            !session?.user
          ) {
            router.replace('/login')
          }
        }
      )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  /* ==========================================================
     LOAD MEMBER
  ========================================================== */

  const loadMember = useCallback(
    async () => {
      if (!authorized) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        const {
          data,
          error: queryError,
        } =
          await supabase
            .from('team_members')
            .select(
              `
                id,
                full_name,
                position,
                bio,
                photo_url,
                display_order,
                status,
                created_at,
                updated_at
              `
            )
            .eq(
              'id',
              id
            )
            .maybeSingle()

        if (queryError) {
          console.error(
            'Team member loading error:',
            queryError
          )

          setError(
            'Unable to load this team member.'
          )

          return
        }

        if (!data) {
          setError(
            'This team member could not be found.'
          )

          return
        }

        const typedMember =
          data as TeamMemberRecord

        setMember(
          typedMember
        )

        setFullName(
          typedMember.full_name ??
            ''
        )

        setPosition(
          typedMember.position ??
            ''
        )

        setBio(
          typedMember.bio ??
            ''
        )

        setPhotoUrl(
          typedMember.photo_url ??
            ''
        )

        setDisplayOrder(
          typeof typedMember.display_order ===
            'number'
            ? typedMember.display_order
            : 0
        )

        setStatus(
          typedMember.status ??
            'active'
        )
      } catch (loadError) {
        console.error(
          'Team member detail error:',
          loadError
        )

        setError(
          'An unexpected error occurred while loading this team member.'
        )
      } finally {
        setLoading(false)
      }
    },
    [
      authorized,
      id,
      supabase,
    ]
  )

  useEffect(() => {
    if (authorized) {
      loadMember()
    }
  }, [
    authorized,
    loadMember,
  ])

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateForm = () => {
    const cleanFullName =
      fullName.trim()

    const cleanPosition =
      position.trim()

    const cleanBio =
      bio.trim()

    const cleanPhotoUrl =
      photoUrl.trim()

    if (!cleanFullName) {
      return 'The full name is required.'
    }

    if (!cleanPosition) {
      return 'The position is required.'
    }

    if (
      cleanFullName.length >
      200
    ) {
      return 'The full name is too long.'
    }

    if (
      cleanPosition.length >
      200
    ) {
      return 'The position is too long.'
    }

    if (
      cleanBio.length >
      5000
    ) {
      return 'The biography is too long.'
    }

    if (
      cleanPhotoUrl &&
      !isValidUrl(cleanPhotoUrl)
    ) {
      return 'The photo URL is not valid.'
    }

    if (
      !Number.isInteger(
        displayOrder
      ) ||
      displayOrder < 0
    ) {
      return 'Display order must be a positive whole number or zero.'
    }

    return null
  }

  /* ==========================================================
     SAVE
  ========================================================== */

  const handleSubmit =
    async (
      event: React.FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault()

      if (
        saving ||
        deleting ||
        success ||
        !authorized ||
        !member
      ) {
        return
      }

      setError(null)

      const validationError =
        validateForm()

      if (validationError) {
        setError(
          validationError
        )
        return
      }

      setSaving(true)

      try {
        /* ----------------------------------------------------
           Re-check authenticated user
        ---------------------------------------------------- */

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser()

        if (!user) {
          router.replace('/login')
          return
        }

        /* ----------------------------------------------------
           Re-check authorization before mutation
        ---------------------------------------------------- */

        const {
          data: currentProfile,
          error: profileError,
        } =
          await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        if (
          profileError ||
          !currentProfile ||
          !AUTHORIZED_ROLES.includes(
            currentProfile.role as Role
          )
        ) {
          throw new Error(
            'Your current account is not authorized to modify team members.'
          )
        }

        /* ----------------------------------------------------
           Update
        ---------------------------------------------------- */

        const now =
          new Date().toISOString()

        const {
          error: updateError,
        } =
          await supabase
            .from('team_members')
            .update({
              full_name:
                fullName.trim(),
              position:
                position.trim(),
              bio:
                bio.trim() ||
                null,
              photo_url:
                photoUrl.trim() ||
                null,
              display_order:
                displayOrder,
              status,
              updated_at:
                now,
            })
            .eq(
              'id',
              id
            )

        if (updateError) {
          console.error(
            'Team member update error:',
            updateError
          )

          throw new Error(
            updateError.message ||
              'Unable to update this team member.'
          )
        }

        setMember(
          (current) =>
            current
              ? {
                  ...current,
                  full_name:
                    fullName.trim(),
                  position:
                    position.trim(),
                  bio:
                    bio.trim() ||
                    null,
                  photo_url:
                    photoUrl.trim() ||
                    null,
                  display_order:
                    displayOrder,
                  status,
                  updated_at:
                    now,
                }
              : current
        )

        setSuccess(true)
      } catch (saveError) {
        console.error(
          'Team member update failed:',
          saveError
        )

        setError(
          saveError instanceof Error
            ? saveError.message
            : 'Unable to update this team member.'
        )
      } finally {
        setSaving(false)
      }
    }

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete =
    async () => {
      if (
        deleting ||
        saving ||
        !authorized ||
        !member
      ) {
        return
      }

      const memberName =
        member.full_name?.trim() ||
        fullName.trim() ||
        'this team member'

      const confirmed =
        window.confirm(
          `Delete "${memberName}"?\n\nThis action cannot be undone.`
        )

      if (!confirmed) {
        return
      }

      setDeleting(true)
      setError(null)

      try {
        /* ----------------------------------------------------
           Re-check authenticated user
        ---------------------------------------------------- */

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser()

        if (!user) {
          router.replace('/login')
          return
        }

        /* ----------------------------------------------------
           Re-check authorization
        ---------------------------------------------------- */

        const {
          data: currentProfile,
          error: profileError,
        } =
          await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        if (
          profileError ||
          !currentProfile ||
          !AUTHORIZED_ROLES.includes(
            currentProfile.role as Role
          )
        ) {
          throw new Error(
            'Your current account is not authorized to delete team members.'
          )
        }

        /* ----------------------------------------------------
           Delete
        ---------------------------------------------------- */

        const {
          error: deleteError,
        } =
          await supabase
            .from('team_members')
            .delete()
            .eq(
              'id',
              id
            )

        if (deleteError) {
          console.error(
            'Team member deletion error:',
            deleteError
          )

          throw new Error(
            deleteError.message ||
              'Unable to delete this team member.'
          )
        }

        router.push(
          '/admin/content/team'
        )
      } catch (deleteError) {
        console.error(
          'Team member deletion failed:',
          deleteError
        )

        setError(
          deleteError instanceof Error
            ? deleteError.message
            : 'Unable to delete this team member.'
        )
      } finally {
        setDeleting(false)
      }
    }

  /* ==========================================================
     DERIVED
  ========================================================== */

  const previewName =
    useMemo(
      () =>
        fullName.trim() ||
        'Team member',
      [fullName]
    )

  const previewPosition =
    useMemo(
      () =>
        position.trim() ||
        'Position',
      [position]
    )

  const previewInitials =
    useMemo(
      () =>
        getInitials(
          previewName
        ),
      [previewName]
    )

  const statusLabel =
    status === 'active'
      ? 'Active'
      : 'Inactive'

  /* ==========================================================
     LOADING / ACCESS
  ========================================================== */

  if (
    checkingAccess ||
    loading
  ) {
    return <LoadingState />
  }

  if (!authorized) {
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
            Your current role does not have permission to edit team content.
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

  if (
    error &&
    !member
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="w-full max-w-xl rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Users size={23} />
          </div>

          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.3em] text-red-600">
            Team record
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Team member unavailable
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/content/team'
              )
            }
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Back to Team
          </button>

        </div>
      </div>
    )
  }

  if (!member) {
    return <LoadingState />
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <div className="mx-auto max-w-[1180px] space-y-6 pb-10">

      {/* ======================================================
          HEADER / BREADCRUMB
      ====================================================== */}

      <section>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/content/team'
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
            Content
          </span>

          <span className="text-slate-300">
            /
          </span>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/content/team'
              )
            }
            className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
          >
            Team
          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="max-w-[280px] truncate text-xs font-semibold text-slate-700">
            {previewName}
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
                  Edit team member
                </span>

                <span
                  className={`inline-flex h-7 items-center rounded-full px-3 text-[9px] font-bold uppercase tracking-[0.18em] ${getStatusClass(
                    status
                  )}`}
                >
                  {statusLabel}
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected workspace
                </span>

              </div>

              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                {previewName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Team record · Created{' '}
                {new Intl.DateTimeFormat(
                  'en-US',
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }
                ).format(
                  new Date(
                    member.created_at
                  )
                )}
              </p>

            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={
              saving ||
              deleting
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={15} />

            {deleting
              ? 'Deleting...'
              : 'Delete Member'}
          </button>

        </div>
      </section>

      {/* ======================================================
          FEEDBACK
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
            <ShieldAlert size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              We could not complete the request
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700/80">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setError(null)
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

          <div>

            <p className="text-sm font-semibold text-emerald-800">
              Team member updated successfully
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              Your changes have been saved successfully.
            </p>

          </div>

        </div>
      )}

      {/* ======================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">

          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="space-y-6">

            {/* PROFILE */}

            <FormSection
              number="01"
              eyebrow="Profile"
              title="Member information"
              description="Update the identity and professional information displayed on the public team section."
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Full name"
                  required
                >
                  <div className="relative">

                    <User
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(
                          event.target.value
                        )
                      }
                      maxLength={200}
                      autoComplete="name"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                      required
                    />

                  </div>
                </Field>

                <Field
                  label="Position"
                  required
                >
                  <input
                    type="text"
                    value={position}
                    onChange={(event) =>
                      setPosition(
                        event.target.value
                      )
                    }
                    maxLength={200}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                    required
                  />
                </Field>

              </div>

              <div className="mt-5">

                <Field
                  label="Biography"
                  hint={`${bio.length}/5000`}
                >

                  <textarea
                    value={bio}
                    onChange={(event) =>
                      setBio(
                        event.target.value
                      )
                    }
                    maxLength={5000}
                    rows={7}
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                  />

                </Field>

              </div>

            </FormSection>

            {/* PRESENTATION */}

            <FormSection
              number="02"
              eyebrow="Presentation"
              title="Photo and display order"
              description="Control the visual identity and position of this member in the public team listing."
            >

              <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_220px]">

                <Field
                  label="Photo URL"
                  hint="Optional"
                >

                  <div className="relative">

                    <ImageIcon
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(event) =>
                        setPhotoUrl(
                          event.target.value
                        )
                      }
                      placeholder="https://example.com/photo.jpg"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                    />

                  </div>

                  <p className="mt-2 text-[10px] leading-5 text-slate-400">
                    The image is referenced by the existing photo URL field.
                  </p>

                </Field>

                <Field
                  label="Display order"
                  hint="0+"
                >

                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(event) => {
                      const value =
                        Number(
                          event.target.value
                        )

                      setDisplayOrder(
                        Number.isFinite(
                          value
                        )
                          ? Math.max(
                              0,
                              Math.trunc(
                                value
                              )
                            )
                          : 0
                      )
                    }}
                    min={0}
                    step={1}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                  />

                  <p className="mt-2 text-[10px] leading-5 text-slate-400">
                    Lower numbers appear first.
                  </p>

                </Field>

              </div>

            </FormSection>

            {/* STATUS */}

            <FormSection
              number="03"
              eyebrow="Visibility"
              title="Publication status"
              description="Determine whether this member is currently visible in the public team section."
            >

              <div className="grid gap-3 sm:grid-cols-2">

                {STATUS_OPTIONS.map(
                  (option) => {
                    const selected =
                      status ===
                      option.value

                    return (
                      <button
                        type="button"
                        key={
                          option.value
                        }
                        onClick={() =>
                          setStatus(
                            option.value
                          )
                        }
                        className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                          selected
                            ? 'border-slate-950 bg-slate-950 text-white shadow-[0_10px_30px_rgba(10,12,11,0.10)]'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >

                        <div>

                          <p className="text-xs font-semibold">
                            {
                              option.label
                            }
                          </p>

                          <p
                            className={`mt-1 text-[10px] leading-5 ${
                              selected
                                ? 'text-white/50'
                                : 'text-slate-400'
                            }`}
                          >
                            {
                              option.description
                            }
                          </p>

                        </div>

                        {selected && (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D0A765] text-[#0A0C0B]">
                            <Check
                              size={13}
                              strokeWidth={
                                3
                              }
                            />
                          </div>
                        )}

                      </button>
                    )
                  }
                )}

              </div>

            </FormSection>

            {/* SECURITY */}

            <section className="rounded-[26px] border border-slate-200/80 bg-[#0A0C0B] p-5 text-white shadow-[0_15px_45px_rgba(10,12,11,0.12)] sm:p-7">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#D0A765]">
                  <ShieldCheck
                    size={20}
                  />
                </div>

                <div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D0A765]">
                    Secure team management
                  </p>

                  <h3 className="mt-1 text-sm font-semibold">
                    Protected record
                  </h3>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-white/45">
                    The authenticated session and current role are revalidated before this team member is modified.
                  </p>

                </div>

              </div>

            </section>

          </div>

          {/* ==================================================
              RIGHT
          ================================================== */}

          <aside className="space-y-6">

            {/* PREVIEW */}

            <FormSection
              eyebrow="Preview"
              title="Team member profile"
              description="Live preview of the current member information."
            >

              <div className="flex flex-col items-center text-center">

                {photoUrl.trim() ? (
                  <img
                    src={
                      photoUrl.trim()
                    }
                    alt={previewName}
                    className="h-24 w-24 rounded-[28px] object-cover shadow-[0_12px_35px_rgba(15,23,42,0.10)]"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#0A0C0B] text-xl font-semibold text-[#D0A765] shadow-[0_12px_35px_rgba(10,12,11,0.12)]">
                    {previewInitials}
                  </div>
                )}

                <h3 className="mt-5 max-w-full truncate text-base font-semibold text-slate-950">
                  {previewName}
                </h3>

                <p className="mt-1 max-w-full truncate text-xs text-slate-400">
                  {previewPosition}
                </p>

                <span
                  className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wide ${getStatusClass(
                    status
                  )}`}
                >
                  {statusLabel}
                </span>

                {bio.trim() && (
                  <p className="mt-5 line-clamp-5 text-xs leading-5 text-slate-500">
                    {bio.trim()}
                  </p>
                )}

              </div>

            </FormSection>

            {/* RECORD */}

            <FormSection
              eyebrow="Record"
              title="Team record"
            >

              <div className="space-y-2">

                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50/70 px-3 py-3">

                  <span className="text-xs text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase ${getStatusClass(
                      status
                    )}`}
                  >
                    {statusLabel}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50/70 px-3 py-3">

                  <span className="text-xs text-slate-500">
                    Display order
                  </span>

                  <span className="text-xs font-semibold text-slate-700">
                    {displayOrder}
                  </span>

                </div>

                <div className="rounded-xl bg-slate-50/70 px-3 py-3">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Member ID
                  </p>

                  <p className="mt-1 break-all font-mono text-[10px] text-slate-600">
                    {member.id}
                  </p>

                </div>

              </div>

            </FormSection>

            {/* SYSTEM INFO */}

            <FormSection
              eyebrow="System"
              title="Record information"
            >

              <div className="space-y-3">

                <div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-700">
                    {new Intl.DateTimeFormat(
                      'en-US',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    ).format(
                      new Date(
                        member.created_at
                      )
                    )}
                  </p>

                </div>

                <div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Last updated
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-700">
                    {new Intl.DateTimeFormat(
                      'en-US',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    ).format(
                      new Date(
                        member.updated_at
                      )
                    )}
                  </p>

                </div>

              </div>

            </FormSection>

          </aside>
        </div>

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
                  {saving
                    ? 'Saving changes...'
                    : 'Team member ready'}
                </p>

                <p className="text-[10px] text-slate-400">
                  Changes are validated before being written to the workspace.
                </p>

              </div>

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                disabled={
                  saving ||
                  deleting
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
                  saving ||
                  deleting
                }
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-5 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Changes
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