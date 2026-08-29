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
  File,
  FileText,
  Globe2,
  Image as ImageIcon,
  Save,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Video,
  X,
} from 'lucide-react'

import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type MediaType =
  | 'image'
  | 'video'
  | 'document'

type MediaCategory =
  | 'corporate'
  | 'team'
  | 'operations'
  | 'communities'
  | 'projects'
  | 'news'

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

type MediaItem = {
  id: string
  filename: string
  url: string
  type: MediaType
  category: MediaCategory
  alt_text: string | null
  caption: string | null
  uploaded_by: string | null
  created_at: string
}

/* ============================================================
   CONSTANTS
============================================================ */

const BUCKET_NAME = 'media'

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
  'content_manager',
]

const CATEGORY_OPTIONS: {
  value: MediaCategory
  label: string
}[] = [
  {
    value: 'corporate',
    label: 'Corporate',
  },
  {
    value: 'team',
    label: 'Team',
  },
  {
    value: 'operations',
    label: 'Operations',
  },
  {
    value: 'communities',
    label: 'Communities',
  },
  {
    value: 'projects',
    label: 'Projects',
  },
  {
    value: 'news',
    label: 'News',
  },
]

const TYPE_OPTIONS: {
  value: MediaType
  label: string
}[] = [
  {
    value: 'image',
    label: 'Image',
  },
  {
    value: 'video',
    label: 'Video',
  },
  {
    value: 'document',
    label: 'Document',
  },
]

const CATEGORY_LABELS: Record<
  MediaCategory,
  string
> = {
  corporate: 'Corporate',
  team: 'Team',
  operations: 'Operations',
  communities: 'Communities',
  projects: 'Projects',
  news: 'News',
}

const TYPE_LABELS: Record<
  MediaType,
  string
> = {
  image: 'Image',
  video: 'Video',
  document: 'Document',
}

/* ============================================================
   HELPERS
============================================================ */

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

function getInitials(
  value: string
) {
  const parts =
    value
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (
    parts.length === 0
  ) {
    return 'BM'
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

function getTypeClass(
  type: MediaType
) {
  switch (type) {
    case 'image':
      return 'bg-emerald-50 text-emerald-700'

    case 'video':
      return 'bg-blue-50 text-blue-700'

    case 'document':
      return 'bg-amber-50 text-amber-700'

    default:
      return 'bg-slate-50 text-slate-600'
  }
}

function getMediaIcon(
  type: MediaType
) {
  switch (type) {
    case 'image':
      return <ImageIcon size={20} />

    case 'video':
      return <Video size={20} />

    case 'document':
      return <FileText size={20} />

    default:
      return <File size={20} />
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
          Preparing secure media editor
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying access and loading the media record...
        </p>

      </div>
    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function EditMediaPage() {
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

  const [media, setMedia] =
    useState<MediaItem | null>(null)

  /* ----------------------------------------------------------
     FORM
  ---------------------------------------------------------- */

  const [filename, setFilename] =
    useState('')

  const [category, setCategory] =
    useState<MediaCategory>(
      'corporate'
    )

  const [type, setType] =
    useState<MediaType>(
      'image'
    )

  const [altText, setAltText] =
    useState('')

  const [caption, setCaption] =
    useState('')

  /* ----------------------------------------------------------
     UI
  ---------------------------------------------------------- */

  const [saving, setSaving] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)

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
        setCheckingAccess(true)

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
     LOAD MEDIA
  ========================================================== */

  const loadMedia =
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
              .from('media')
              .select(
                `
                  id,
                  filename,
                  url,
                  type,
                  category,
                  alt_text,
                  caption,
                  uploaded_by,
                  created_at
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
              'Media loading error:',
              queryError
            )

            setError(
              'Unable to load this media record.'
            )

            return
          }

          if (!data) {
            setError(
              'This media record could not be found.'
            )

            return
          }

          const typedMedia =
            data as MediaItem

          setMedia(
            typedMedia
          )

          setFilename(
            typedMedia.filename
          )

          setCategory(
            typedMedia.category
          )

          setType(
            typedMedia.type
          )

          setAltText(
            typedMedia.alt_text ??
              ''
          )

          setCaption(
            typedMedia.caption ??
              ''
          )
        } catch (
          loadError
        ) {
          console.error(
            'Media detail error:',
            loadError
          )

          setError(
            'An unexpected error occurred while loading this media.'
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
      loadMedia()
    }
  }, [
    authorized,
    loadMedia,
  ])

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateForm =
    () => {
      const cleanFilename =
        filename.trim()

      const cleanAltText =
        altText.trim()

      const cleanCaption =
        caption.trim()

      if (!cleanFilename) {
        return 'The filename is required.'
      }

      if (
        cleanFilename.length >
        255
      ) {
        return 'The filename is too long.'
      }

      if (
        cleanAltText.length >
        500
      ) {
        return 'The alt text is too long.'
      }

      if (
        cleanCaption.length >
        1000
      ) {
        return 'The caption is too long.'
      }

      if (
        !CATEGORY_OPTIONS.some(
          (option) =>
            option.value ===
            category
        )
      ) {
        return 'The selected category is invalid.'
      }

      if (
        !TYPE_OPTIONS.some(
          (option) =>
            option.value ===
            type
        )
      ) {
        return 'The selected media type is invalid.'
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
        !media
      ) {
        return
      }

      setError(null)
      setSuccess(false)

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
           Re-check session
        ---------------------------------------------------- */

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

        /* ----------------------------------------------------
           Re-check role before mutation
        ---------------------------------------------------- */

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
            'Your current account is not authorized to modify media.'
          )
        }

        /* ----------------------------------------------------
           Update metadata only.
           The physical Storage file is not replaced here.
        ---------------------------------------------------- */

        const {
          error: updateError,
        } =
          await supabase
            .from('media')
            .update({
              filename:
                filename.trim(),
              category,
              type,
              alt_text:
                altText.trim() ||
                null,
              caption:
                caption.trim() ||
                null,
            })
            .eq(
              'id',
              id
            )

        if (updateError) {
          console.error(
            'Media update error:',
            updateError
          )

          throw new Error(
            updateError.message ||
              'Unable to update this media record.'
          )
        }

        setMedia(
          (current) =>
            current
              ? {
                  ...current,
                  filename:
                    filename.trim(),
                  category,
                  type,
                  alt_text:
                    altText.trim() ||
                    null,
                  caption:
                    caption.trim() ||
                    null,
                }
              : current
        )

        setSuccess(true)
      } catch (
        saveError
      ) {
        console.error(
          'Media update failed:',
          saveError
        )

        setError(
          saveError instanceof
          Error
            ? saveError.message
            : 'Unable to update this media record.'
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
        !media
      ) {
        return
      }

      const confirmed =
        window.confirm(
          `Delete "${media.filename}"?\n\nThe database record and the associated Storage file will be removed. This action cannot be undone.`
        )

      if (!confirmed) {
        return
      }

      setDeleting(true)
      setError(null)

      try {
        /* ----------------------------------------------------
           Re-check session
        ---------------------------------------------------- */

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

        /* ----------------------------------------------------
           Re-check role
        ---------------------------------------------------- */

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
            'Your current account is not authorized to delete media.'
          )
        }

        /* ----------------------------------------------------
           Resolve Storage path from public URL
        ---------------------------------------------------- */

        let storagePath:
          | string
          | null =
          null

        try {
          const url =
            new URL(
              media.url
            )

          const marker =
            `/storage/v1/object/public/${BUCKET_NAME}/`

          const markerIndex =
            url.pathname.indexOf(
              marker
            )

          if (
            markerIndex !==
              -1
          ) {
            storagePath =
              decodeURIComponent(
                url.pathname.slice(
                  markerIndex +
                    marker.length
                )
              )
          }
        } catch (
          pathError
        ) {
          console.error(
            'Storage path resolution error:',
            pathError
          )
        }

        /* ----------------------------------------------------
           Remove Storage file
        ---------------------------------------------------- */

        if (
          storagePath
        ) {
          const {
            error:
              storageError,
          } =
            await supabase.storage
              .from(
                BUCKET_NAME
              )
              .remove([
                storagePath,
              ])

          if (
            storageError
          ) {
            console.error(
              'Storage deletion error:',
              storageError
            )

            throw new Error(
              'Unable to remove the associated Storage file.'
            )
          }
        }

        /* ----------------------------------------------------
           Remove database record
        ---------------------------------------------------- */

        const {
          error:
            deleteError,
        } =
          await supabase
            .from('media')
            .delete()
            .eq(
              'id',
              id
            )

        if (
          deleteError
        ) {
          console.error(
            'Media record deletion error:',
            deleteError
          )

          throw new Error(
            deleteError.message ||
              'Unable to delete the media record.'
          )
        }

        router.push(
          '/admin/media'
        )
      } catch (
        deleteError
      ) {
        console.error(
          'Media deletion failed:',
          deleteError
        )

        setError(
          deleteError instanceof
          Error
            ? deleteError.message
            : 'Unable to delete this media file.'
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
        filename.trim() ||
        'Media file',
      [filename]
    )

  const categoryLabel =
    CATEGORY_LABELS[
      category
    ]

  const typeLabel =
    TYPE_LABELS[type]

  const initials =
    useMemo(
      () =>
        getInitials(
          previewName
        ),
      [previewName]
    )

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
            Your current role does not have permission to manage the media library.
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
     ERROR / NOT FOUND
  ========================================================== */

  if (
    error &&
    !media
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="w-full max-w-xl rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ImageIcon size={23} />
          </div>

          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.3em] text-red-600">
            Media record
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Media unavailable
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/media'
              )
            }
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Back to Media
          </button>

        </div>
      </div>
    )
  }

  if (!media) {
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
                '/admin/media'
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
                '/admin/media'
              )
            }
            className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
          >
            Media
          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="max-w-[300px] truncate text-xs font-semibold text-slate-700">
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
                  Edit media
                </span>

                <span className="inline-flex h-7 items-center rounded-full bg-slate-100 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  {typeLabel}
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected workspace
                </span>

              </div>

              <h1 className="mt-3 max-w-3xl truncate text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                {previewName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Media record · Uploaded{' '}
                {formatDate(
                  media.created_at
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
              saving ||
              deleting
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={15} />

            {deleting
              ? 'Deleting...'
              : 'Delete Media'}
          </button>

        </div>
      </section>

      {/* ======================================================
          ERROR / SUCCESS
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

          <div>

            <p className="text-sm font-semibold text-emerald-800">
              Media updated successfully
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              The media metadata has been saved successfully.
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">

          {/* ==================================================
              LEFT
          ================================================== */}

          <div className="space-y-6">

            {/* MEDIA INFORMATION */}

            <FormSection
              number="01"
              eyebrow="Media"
              title="Media information"
              description="Update the file name, category and media classification stored in the media register."
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Filename"
                  required
                >

                  <div className="relative">

                    <File
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={
                        filename
                      }
                      onChange={(
                        event
                      ) =>
                        setFilename(
                          event.target
                            .value
                        )
                      }
                      maxLength={
                        255
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                      required
                    />

                  </div>

                </Field>

                <Field
                  label="Category"
                  required
                >

                  <div className="relative">

                    <select
                      value={
                        category
                      }
                      onChange={(
                        event
                      ) =>
                        setCategory(
                          event.target
                            .value as MediaCategory
                        )
                      }
                      className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                    >

                      {CATEGORY_OPTIONS.map(
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
                            {
                              option.label
                            }
                          </option>
                        )
                      )}

                    </select>

                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>

                  </div>

                </Field>

              </div>

              <div className="mt-5">

                <Field
                  label="Type"
                  required
                  hint="Stored media classification"
                >

                  <div className="grid gap-2 sm:grid-cols-3">

                    {TYPE_OPTIONS.map(
                      (
                        option
                      ) => {
                        const selected =
                          type ===
                          option.value

                        return (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              setType(
                                option.value
                              )
                            }
                            className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                              selected
                                ? 'border-slate-950 bg-slate-950 text-white shadow-[0_8px_25px_rgba(10,12,11,0.10)]'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >

                            <div className="flex items-center gap-3">

                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                  selected
                                    ? 'bg-white/10'
                                    : 'bg-slate-100'
                                }`}
                              >
                                {getMediaIcon(
                                  option.value
                                )}
                              </div>

                              <span className="text-xs font-semibold">
                                {
                                  option.label
                                }
                              </span>

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

            </FormSection>

            {/* ACCESSIBILITY */}

            <FormSection
              number="02"
              eyebrow="Accessibility"
              title="Public metadata"
              description="Provide descriptive metadata that can be used when the media asset is displayed on the website."
            >

              <div className="space-y-5">

                <Field
                  label="Alt text"
                  hint={`${altText.length}/500`}
                >

                  <input
                    type="text"
                    value={
                      altText
                    }
                    onChange={(
                      event
                    ) =>
                      setAltText(
                        event.target
                          .value
                      )
                    }
                    maxLength={
                      500
                    }
                    placeholder="Descriptive text for accessibility"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                  />

                </Field>

                <Field
                  label="Caption"
                  hint={`${caption.length}/1000`}
                >

                  <textarea
                    value={
                      caption
                    }
                    onChange={(
                      event
                    ) =>
                      setCaption(
                        event.target
                          .value
                      )
                    }
                    maxLength={
                      1000
                    }
                    rows={5}
                    placeholder="Caption displayed with the media when applicable"
                    className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                  />

                </Field>

              </div>

            </FormSection>

            {/* SOURCE */}

            <FormSection
              number="03"
              eyebrow="Source"
              title="Storage reference"
              description="The physical asset remains stored in the existing Supabase Storage media bucket."
            >

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                    <Globe2
                      size={17}
                    />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Storage URL
                    </p>

                    <p className="mt-2 break-all font-mono text-[10px] leading-5 text-slate-600">
                      {media.url}
                    </p>

                  </div>

                </div>

              </div>

              <p className="mt-3 text-[10px] leading-5 text-slate-400">
                The Storage file itself is not replaced when saving these metadata changes.
              </p>

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
                    Secure media management
                  </p>

                  <h3 className="mt-1 text-sm font-semibold">
                    Protected media record
                  </h3>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-white/45">
                    The authenticated session and current role are revalidated before the media record is modified or deleted.
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
              title="Media preview"
              description="Preview of the existing asset and its current classification."
            >

              <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50">

                {media.type ===
                'image' ? (
                  <img
                    src={
                      media.url
                    }
                    alt={
                      altText ||
                      filename
                    }
                    className="max-h-[340px] w-full object-contain bg-slate-100"
                  />
                ) : media.type ===
                  'video' ? (
                  <div className="flex h-[300px] flex-col items-center justify-center bg-slate-950 text-white">

                    <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/10">
                      <Video
                        size={
                          28
                        }
                      />
                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      Video
                    </p>

                    <p className="mt-1 max-w-[220px] truncate text-[10px] text-white/40">
                      {
                        media.filename
                      }
                    </p>

                  </div>
                ) : (
                  <div className="flex h-[300px] flex-col items-center justify-center bg-slate-100 text-slate-500">

                    <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white shadow-sm">
                      <FileText
                        size={
                          28
                        }
                      />
                    </div>

                    <p className="mt-4 text-sm font-semibold">
                      Document
                    </p>

                    <p className="mt-1 max-w-[220px] truncate text-[10px] text-slate-400">
                      {
                        media.filename
                      }
                    </p>

                  </div>
                )}

              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${getTypeClass(
                    type
                  )}`}
                >
                  {typeLabel}
                </span>

                <span className="inline-flex rounded-full bg-[#F3EFE7] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#94713F]">
                  {categoryLabel}
                </span>

              </div>

            </FormSection>

            {/* RECORD */}

            <FormSection
              eyebrow="Record"
              title="Media record"
            >

              <div className="space-y-3">

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50/70 p-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500">
                    {getMediaIcon(
                      type
                    )}
                  </div>

                  <div className="min-w-0">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      File type
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-700">
                      {typeLabel}
                    </p>

                  </div>

                </div>

                <div className="rounded-2xl bg-slate-50/70 p-3">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {categoryLabel}
                  </p>

                </div>

                <div className="rounded-2xl bg-slate-50/70 p-3">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Media ID
                  </p>

                  <p className="mt-1 break-all font-mono text-[10px] text-slate-600">
                    {media.id}
                  </p>

                </div>

              </div>

            </FormSection>

            {/* SYSTEM */}

            <FormSection
              eyebrow="System"
              title="Record information"
            >

              <div className="space-y-4">

                <div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Uploaded
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-700">
                    {formatDateTime(
                      media.created_at
                    )}
                  </p>

                </div>

                <div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Uploaded by
                  </p>

                  <p className="mt-1 break-all font-mono text-[10px] text-slate-600">
                    {media.uploaded_by ??
                      'Not recorded'}
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
                <Save
                  size={15}
                />
              </div>

              <div>

                <p className="text-xs font-semibold text-slate-800">
                  {saving
                    ? 'Saving changes...'
                    : 'Media record ready'}
                </p>

                <p className="text-[10px] text-slate-400">
                  Metadata changes are validated before being saved.
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
                <ArrowLeft
                  size={
                    14
                  }
                />
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