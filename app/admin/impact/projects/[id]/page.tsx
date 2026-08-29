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
  CircleAlert,
  FileText,
  Globe2,
  MapPin,
  Save,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'

import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type Status =
  | 'draft'
  | 'published'
  | 'archived'

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

type Project = {
  id: string
  title: string
  slug: string
  location: string | null
  status: Status
  description: string | null
  cover_image_url: string | null
  started_at: string | null
  completed_at: string | null
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
    value: 'draft',
    label: 'Draft',
    description:
      'Work in progress and not publicly visible.',
  },
  {
    value: 'published',
    label: 'Published',
    description:
      'Visible on the public Impact section.',
  },
  {
    value: 'archived',
    label: 'Archived',
    description:
      'Retained internally and no longer active.',
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

function generateSlug(
  value: string
) {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      '')
}

function getStatusClass(
  status: Status
) {
  switch (status) {
    case 'draft':
      return 'bg-slate-100 text-slate-600'

    case 'published':
      return 'bg-emerald-50 text-emerald-700'

    case 'archived':
      return 'bg-slate-100 text-slate-400'

    default:
      return 'bg-slate-50 text-slate-600'
  }
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return '—'
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '—'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  ).format(date)
}

function formatDateTime(
  value: string | null | undefined
) {
  if (!value) {
    return '—'
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '—'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(date)
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
          Preparing secure impact editor
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying access and loading the project...
        </p>

      </div>
    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function EditProjectPage() {
  const router =
    useRouter()

  const params =
    useParams()

  const id =
    params.id as string

  const supabase =
    createClient()

  /* ----------------------------------------------------------
     SECURITY
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
     DATA
  ---------------------------------------------------------- */

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)

  const [project, setProject] =
    useState<Project | null>(
      null
    )

  /* ----------------------------------------------------------
     FORM
  ---------------------------------------------------------- */

  const [title, setTitle] =
    useState('')

  const [slug, setSlug] =
    useState('')

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false)

  const [location, setLocation] =
    useState('')

  const [status, setStatus] =
    useState<Status>('draft')

  const [description, setDescription] =
    useState('')

  const [coverImage, setCoverImage] =
    useState('')

  const [startedAt, setStartedAt] =
    useState('')

  const [completedAt, setCompletedAt] =
    useState('')

  /* ----------------------------------------------------------
     FEEDBACK
  ---------------------------------------------------------- */

  const [error, setError] =
    useState<string | null>(
      null
    )

  const [success, setSuccess] =
    useState(false)

  /* ==========================================================
     ACCESS
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
                'id, email, full_name, role'
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
            console.error(
              'Profile access error:',
              profileError
            )

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
            'Access verification error:',
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
     LOAD PROJECT
  ========================================================== */

  const loadProject =
    useCallback(
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
              .from(
                'impact_projects'
              )
              .select(
                `
                  id,
                  title,
                  slug,
                  location,
                  status,
                  description,
                  cover_image_url,
                  started_at,
                  completed_at,
                  created_at,
                  updated_at
                `
              )
              .eq(
                'id',
                id
              )
              .maybeSingle()

          if (
            queryError
          ) {
            console.error(
              'Impact project loading error:',
              queryError
            )

            setError(
              'Unable to load this impact project.'
            )

            return
          }

          if (!data) {
            setError(
              'This impact project could not be found.'
            )

            return
          }

          const typedProject =
            data as Project

          setProject(
            typedProject
          )

          setTitle(
            typedProject.title ??
              ''
          )

          setSlug(
            typedProject.slug ??
              ''
          )

          setSlugManuallyEdited(
            false
          )

          setLocation(
            typedProject.location ??
              ''
          )

          setStatus(
            typedProject.status ??
              'draft'
          )

          setDescription(
            typedProject.description ??
              ''
          )

          setCoverImage(
            typedProject.cover_image_url ??
              ''
          )

          setStartedAt(
            typedProject.started_at
              ? typedProject.started_at.split(
                  'T'
                )[0]
              : ''
          )

          setCompletedAt(
            typedProject.completed_at
              ? typedProject.completed_at.split(
                  'T'
                )[0]
              : ''
          )
        } catch (
          loadError
        ) {
          console.error(
            'Impact project detail error:',
            loadError
          )

          setError(
            'An unexpected error occurred while loading this project.'
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
      loadProject()
    }
  }, [
    authorized,
    loadProject,
  ])

  /* ==========================================================
     TITLE / SLUG
  ========================================================== */

  const handleTitleChange =
    (
      value: string
    ) => {
      setTitle(
        value
      )

      if (
        !slugManuallyEdited
      ) {
        setSlug(
          generateSlug(
            value
          )
        )
      }
    }

  const handleSlugChange =
    (
      value: string
    ) => {
      setSlug(
        generateSlug(
          value
        )
      )

      setSlugManuallyEdited(
        true
      )
    }

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateForm =
    () => {
      const cleanTitle =
        title.trim()

      const cleanSlug =
        slug.trim()

      const cleanLocation =
        location.trim()

      const cleanDescription =
        description.trim()

      const cleanCoverImage =
        coverImage.trim()

      if (!cleanTitle) {
        return 'The project title is required.'
      }

      if (!cleanSlug) {
        return 'The project slug is required.'
      }

      if (
        cleanTitle.length >
        250
      ) {
        return 'The project title is too long.'
      }

      if (
        cleanSlug.length >
        250
      ) {
        return 'The project slug is too long.'
      }

      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
          cleanSlug
        )
      ) {
        return 'The slug may only contain lowercase letters, numbers and hyphens.'
      }

      if (
        cleanLocation.length >
        250
      ) {
        return 'The location is too long.'
      }

      if (
        cleanDescription.length >
        10000
      ) {
        return 'The project description is too long.'
      }

      if (
        cleanCoverImage
      ) {
        try {
          const url =
            new URL(
              cleanCoverImage
            )

          if (
            ![
              'http:',
              'https:',
            ].includes(
              url.protocol
            )
          ) {
            return 'The cover image URL must use HTTP or HTTPS.'
          }
        } catch {
          return 'The cover image URL is not valid.'
        }
      }

      if (
        startedAt
      ) {
        const start =
          new Date(
            `${startedAt}T00:00:00`
          )

        if (
          Number.isNaN(
            start.getTime()
          )
        ) {
          return 'The start date is not valid.'
        }
      }

      if (
        completedAt
      ) {
        const end =
          new Date(
            `${completedAt}T00:00:00`
          )

        if (
          Number.isNaN(
            end.getTime()
          )
        ) {
          return 'The completion date is not valid.'
        }
      }

      if (
        startedAt &&
        completedAt
      ) {
        const start =
          new Date(
            `${startedAt}T00:00:00`
          )

        const end =
          new Date(
            `${completedAt}T00:00:00`
          )

        if (end < start) {
          return 'Completed date cannot be earlier than started date.'
        }
      }

      if (
        status ===
          'published' &&
        !cleanDescription
      ) {
        return 'A published project must contain a description.'
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
        !authorized ||
        !project
      ) {
        return
      }

      setError(
        null
      )

      setSuccess(
        false
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

      setSaving(
        true
      )

      try {
        /* ------------------------------------------------------
           Re-check session
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
           Re-check authorization
        ------------------------------------------------------ */

        const {
          data: currentProfile,
          error: profileError,
        } =
          await supabase
            .from('profiles')
            .select(
              'role'
            )
            .eq(
              'id',
              user.id
            )
            .maybeSingle()

        if (
          profileError ||
          !currentProfile ||
          !AUTHORIZED_ROLES.includes(
            currentProfile.role as Role
          )
        ) {
          throw new Error(
            'Your current account is not authorized to modify impact projects.'
          )
        }

        /* ------------------------------------------------------
           Update
        ------------------------------------------------------ */

        const {
          error: updateError,
        } =
          await supabase
            .from(
              'impact_projects'
            )
            .update({
              title:
                title.trim(),
              slug:
                slug.trim(),
              location:
                location.trim() ||
                null,
              status,
              description:
                description.trim() ||
                null,
              cover_image_url:
                coverImage.trim() ||
                null,
              started_at:
                startedAt ||
                null,
              completed_at:
                completedAt ||
                null,
              updated_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              id
            )

        if (
          updateError
        ) {
          console.error(
            'Impact project update error:',
            updateError
          )

          if (
            updateError.code ===
            '23505'
          ) {
            throw new Error(
              'This project slug already exists. Please choose another one.'
            )
          }

          throw new Error(
            updateError.message ||
              'Unable to update this impact project.'
          )
        }

        const updatedAt =
          new Date().toISOString()

        setProject(
          (
            current
          ) =>
            current
              ? {
                  ...current,
                  title:
                    title.trim(),
                  slug:
                    slug.trim(),
                  location:
                    location.trim() ||
                    null,
                  status,
                  description:
                    description.trim() ||
                    null,
                  cover_image_url:
                    coverImage.trim() ||
                    null,
                  started_at:
                    startedAt ||
                    null,
                  completed_at:
                    completedAt ||
                    null,
                  updated_at:
                    updatedAt,
                }
              : current
        )

        setSuccess(
          true
        )

        window.setTimeout(
          () => {
            router.push(
              '/admin/impact'
            )
          },
          1500
        )
      } catch (
        saveError
      ) {
        console.error(
          'Impact project update failed:',
          saveError
        )

        setError(
          saveError instanceof
          Error
            ? saveError.message
            : 'Unable to update this impact project.'
        )
      } finally {
        setSaving(
          false
        )
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
        !project
      ) {
        return
      }

      const confirmed =
        window.confirm(
          `Delete "${project.title}"?\n\nThis action cannot be undone.`
        )

      if (!confirmed) {
        return
      }

      setDeleting(
        true
      )

      setError(
        null
      )

      try {
        /* ------------------------------------------------------
           Re-check session
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
           Re-check authorization
        ------------------------------------------------------ */

        const {
          data: currentProfile,
          error: profileError,
        } =
          await supabase
            .from('profiles')
            .select(
              'role'
            )
            .eq(
              'id',
              user.id
            )
            .maybeSingle()

        if (
          profileError ||
          !currentProfile ||
          !AUTHORIZED_ROLES.includes(
            currentProfile.role as Role
          )
        ) {
          throw new Error(
            'Your current account is not authorized to delete impact projects.'
          )
        }

        /* ------------------------------------------------------
           Delete
        ------------------------------------------------------ */

        const {
          error: deleteError,
        } =
          await supabase
            .from(
              'impact_projects'
            )
            .delete()
            .eq(
              'id',
              id
            )

        if (
          deleteError
        ) {
          console.error(
            'Impact project deletion error:',
            deleteError
          )

          throw new Error(
            deleteError.message ||
              'Unable to delete this impact project.'
          )
        }

        router.replace(
          '/admin/impact'
        )
      } catch (
        deleteError
      ) {
        console.error(
          'Impact project deletion failed:',
          deleteError
        )

        setError(
          deleteError instanceof
          Error
            ? deleteError.message
            : 'Unable to delete this impact project.'
        )
      } finally {
        setDeleting(
          false
        )
      }
    }

  /* ==========================================================
     DERIVED
  ========================================================== */

  const selectedStatus =
    useMemo(
      () =>
        STATUS_OPTIONS.find(
          (
            option
          ) =>
            option.value ===
            status
        ),
      [
        status,
      ]
    )

  const previewTitle =
    title.trim() ||
    'Impact project'

  const previewSlug =
    slug.trim() ||
    'impact-project'

  /* ==========================================================
     LOADING
  ========================================================== */

  if (
    checkingAccess ||
    loading
  ) {
    return (
      <LoadingState />
    )
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
            Your current role does not have permission to edit Impact projects.
          </p>

          {profile?.email && (
            <p className="mt-3 text-xs text-slate-400">
              Signed in as{' '}
              {profile.email}
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
     PROJECT NOT FOUND
  ========================================================== */

  if (
    error &&
    !project
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="w-full max-w-xl rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Globe2 size={23} />
          </div>

          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.3em] text-red-600">
            Impact record
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Project unavailable
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/impact'
              )
            }
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Back to Impact
          </button>

        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <LoadingState />
    )
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <div className="mx-auto max-w-[1180px] space-y-6 pb-10">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/impact'
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
            Impact
          </span>

          <span className="text-slate-300">
            /
          </span>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/impact'
              )
            }
            className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
          >
            Projects
          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="max-w-[280px] truncate text-xs font-semibold text-slate-700">
            {previewTitle}
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
                  Edit Project
                </span>

                <span
                  className={`inline-flex h-7 items-center rounded-full px-3 text-[9px] font-bold uppercase tracking-[0.18em] ${getStatusClass(
                    status
                  )}`}
                >
                  {
                    selectedStatus?.label
                  }
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected workspace
                </span>

              </div>

              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                {previewTitle}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Impact project record · Created{' '}
                {formatDate(
                  project.created_at
                )}
              </p>

            </div>
          </div>

          <button
            type="button"
            onClick={
              handleDelete
            }
            disabled={
              deleting ||
              saving
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2
              size={15}
            />

            {deleting
              ? 'Deleting...'
              : 'Delete Project'}
          </button>

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
              We could not complete the request
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
            <CheckCircle2
              size={17}
            />
          </div>

          <div>

            <p className="text-sm font-semibold text-emerald-800">
              Project updated successfully
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              Your changes have been saved. Returning to the Impact register...
            </p>

          </div>
        </div>
      )}

      {/* ======================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >

        {/* ====================================================
            01 PROJECT
        ==================================================== */}

        <FormSection
          number="01"
          eyebrow="Project"
          title="Project information"
          description="Update the project title, public URL, location and publication status."
        >

          <div className="space-y-6">

            <Field
              label="Title"
              required
              hint={`${title.length}/250`}
            >

              <input
                type="text"
                value={
                  title
                }
                onChange={(
                  event
                ) =>
                  handleTitleChange(
                    event.target.value
                  )
                }
                maxLength={
                  250
                }
                placeholder="Project title"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                required
              />

            </Field>

            <Field
              label="Slug"
              required
              hint="Public URL"
            >

              <div className="relative">

                <Globe2
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={
                    slug
                  }
                  onChange={(
                    event
                  ) =>
                    handleSlugChange(
                      event.target.value
                    )
                  }
                  maxLength={
                    250
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                  required
                />

              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">

                <span>
                  /impact/
                  <span className="font-medium text-slate-600">
                    {previewSlug}
                  </span>
                </span>

                {slugManuallyEdited && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(
                        generateSlug(
                          title
                        )
                      )
                      setSlugManuallyEdited(
                        false
                      )
                    }}
                    className="font-semibold text-[#A96F35] transition hover:underline"
                  >
                    Regenerate
                  </button>
                )}

              </div>

            </Field>

            <div className="grid gap-6 lg:grid-cols-2">

              <Field
                label="Location"
                hint="Optional"
              >

                <div className="relative">

                  <MapPin
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={
                      location
                    }
                    onChange={(
                      event
                    ) =>
                      setLocation(
                        event.target.value
                      )
                    }
                    maxLength={
                      250
                    }
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                  />

                </div>

              </Field>

              <Field
                label="Status"
                required
              >

                <div className="space-y-2">

                  {STATUS_OPTIONS.map(
                    (
                      option
                    ) => {
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
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                            selected
                              ? 'border-slate-950 bg-slate-950 text-white shadow-[0_8px_25px_rgba(10,12,11,0.10)]'
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
                              className={`mt-0.5 text-[10px] ${
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
                            <Check
                              size={
                                15
                              }
                              className="text-[#D0A765]"
                            />
                          )}

                        </button>
                      )
                    }
                  )}

                </div>

              </Field>

            </div>

          </div>
        </FormSection>

        {/* ====================================================
            02 IMPACT
        ==================================================== */}

        <FormSection
          number="02"
          eyebrow="Impact"
          title="Project description"
          description="Maintain a factual and trustworthy description of the community initiative."
        >

          <Field
            label="Description"
            hint={`${description.length}/10000`}
          >

            <textarea
              value={
                description
              }
              onChange={(
                event
              ) =>
                setDescription(
                  event.target.value
                )
              }
              maxLength={
                10000
              }
              rows={
                12
              }
              className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
            />

          </Field>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600">
              <ShieldAlert size={17} />
            </div>

            <div>

              <p className="text-xs font-semibold text-amber-800">
                Factual impact record
              </p>

              <p className="mt-1 text-[10px] leading-5 text-amber-700/80">
                Keep published information accurate and based on verified project activities.
              </p>

            </div>
          </div>

        </FormSection>

        {/* ====================================================
            03 MEDIA
        ==================================================== */}

        <FormSection
          number="03"
          eyebrow="Media"
          title="Cover image"
          description="Update the image reference associated with this project."
        >

          <Field
            label="Cover image URL"
            hint="Optional"
          >

            <div className="relative">

              <Globe2
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="url"
                value={
                  coverImage
                }
                onChange={(
                  event
                ) =>
                  setCoverImage(
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
              />

            </div>

            <p className="mt-2 text-[10px] leading-5 text-slate-400">
              The project keeps the existing
              <span className="font-medium text-slate-500">
                {' '}cover_image_url
              </span>
              {' '}reference. Upload management remains in Media.
            </p>

          </Field>

        </FormSection>

        {/* ====================================================
            04 TIMELINE
        ==================================================== */}

        <FormSection
          number="04"
          eyebrow="Timeline"
          title="Project dates"
          description="Update the known start and completion dates for this initiative."
        >

          <div className="grid gap-5 sm:grid-cols-2">

            <Field
              label="Started at"
              hint="Optional"
            >

              <input
                type="date"
                value={
                  startedAt
                }
                onChange={(
                  event
                ) =>
                  setStartedAt(
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
              />

            </Field>

            <Field
              label="Completed at"
              hint="Optional"
            >

              <input
                type="date"
                value={
                  completedAt
                }
                onChange={(
                  event
                ) =>
                  setCompletedAt(
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
              />

            </Field>

          </div>

          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Current record
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">

              <div>
                <p className="text-[10px] text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {
                    formatDateTime(
                      project.created_at
                    )
                  }
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">
                  Last updated
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {
                    formatDateTime(
                      project.updated_at
                    )
                  }
                </p>
              </div>

            </div>
          </div>

        </FormSection>

        {/* ====================================================
            SECURITY SUMMARY
        ==================================================== */}

        <section className="rounded-[26px] border border-slate-200/80 bg-[#0A0C0B] p-5 text-white shadow-[0_15px_45px_rgba(10,12,11,0.12)] sm:p-7">

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#D0A765]">
                <ShieldCheck
                  size={20}
                />
              </div>

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D0A765]">
                  Secure project management
                </p>

                <h3 className="mt-1 text-sm font-semibold">
                  Ready to save your changes
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-white/45">
                  The authenticated session and current role are revalidated before this project is modified in Supabase.
                </p>

              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:min-w-[290px]">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Current project
              </p>

              <div className="mt-3 space-y-2">

                <div className="flex items-center justify-between gap-4 text-[10px]">

                  <span className="text-white/35">
                    Status
                  </span>

                  <span className="font-semibold text-white">
                    {
                      selectedStatus?.label
                    }
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 text-[10px]">

                  <span className="text-white/35">
                    Location
                  </span>

                  <span className="max-w-[170px] truncate font-semibold text-white">
                    {
                      location.trim() ||
                      'Not specified'
                    }
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4 text-[10px]">

                  <span className="text-white/35">
                    URL
                  </span>

                  <span className="max-w-[170px] truncate font-semibold text-white">
                    /impact/
                    {
                      previewSlug
                    }
                  </span>

                </div>

              </div>

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
                <FileText size={15} />
              </div>

              <div>

                <p className="text-xs font-semibold text-slate-800">
                  {saving
                    ? 'Saving changes...'
                    : deleting
                      ? 'Deleting project...'
                      : 'Project ready'}
                </p>

                <p className="text-[10px] text-slate-400">
                  Changes are validated before they are written to the workspace.
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