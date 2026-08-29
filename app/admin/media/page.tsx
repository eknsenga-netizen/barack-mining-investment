'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  File,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
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

const CATEGORY_OPTIONS = Object.entries(
  CATEGORY_LABELS
).map(
  ([value, label]) => ({
    value,
    label,
  })
)

const TYPE_OPTIONS = Object.entries(
  TYPE_LABELS
).map(
  ([value, label]) => ({
    value,
    label,
  })
)

/*
 * Conservative client-side limits.
 * Server / Storage policies remain the real authority.
 */
const MAX_IMAGE_SIZE =
  10 * 1024 * 1024

const MAX_VIDEO_SIZE =
  100 * 1024 * 1024

const MAX_DOCUMENT_SIZE =
  20 * 1024 * 1024

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
]

/* ============================================================
   HELPERS
============================================================ */

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

function formatBytes(
  bytes: number
) {
  if (bytes <= 0) {
    return '0 B'
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
  ]

  const exponent =
    Math.min(
      Math.floor(
        Math.log(bytes) /
          Math.log(1024)
      ),
      units.length - 1
    )

  const value =
    bytes /
    Math.pow(
      1024,
      exponent
    )

  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`
}

function detectMediaType(
  mimeType: string
): MediaType {
  if (
    mimeType.startsWith(
      'image/'
    )
  ) {
    return 'image'
  }

  if (
    mimeType.startsWith(
      'video/'
    )
  ) {
    return 'video'
  }

  return 'document'
}

function sanitizeFilename(
  filename: string
) {
  const normalized =
    filename
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .replace(
        /[^a-zA-Z0-9._-]+/g,
        '-'
      )
      .replace(
        /-+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      )

  return (
    normalized ||
    'file'
  )
}

function createStoragePath(
  filename: string
) {
  const cleanName =
    sanitizeFilename(
      filename
    )

  const uniquePart =
    `${Date.now()}-${crypto.randomUUID()}`

  return `${uniquePart}-${cleanName}`
}

function validateFile(
  file: File
) {
  const type =
    detectMediaType(
      file.type
    )

  if (
    type === 'image' &&
    file.size >
      MAX_IMAGE_SIZE
  ) {
    return `Image "${file.name}" exceeds the ${formatBytes(MAX_IMAGE_SIZE)} limit.`
  }

  if (
    type === 'video' &&
    file.size >
      MAX_VIDEO_SIZE
  ) {
    return `Video "${file.name}" exceeds the ${formatBytes(MAX_VIDEO_SIZE)} limit.`
  }

  if (
    type === 'document' &&
    file.size >
      MAX_DOCUMENT_SIZE
  ) {
    return `Document "${file.name}" exceeds the ${formatBytes(MAX_DOCUMENT_SIZE)} limit.`
  }

  if (
    type === 'document' &&
    file.type &&
    !ALLOWED_DOCUMENT_TYPES.includes(
      file.type
    )
  ) {
    return `The document type of "${file.name}" is not supported.`
  }

  return null
}

function getTypeClass(
  type: MediaType
) {
  switch (type) {
    case 'image':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'

    case 'video':
      return 'bg-blue-50 text-blue-700 ring-blue-600/10'

    case 'document':
      return 'bg-amber-50 text-amber-700 ring-amber-600/10'

    default:
      return 'bg-slate-50 text-slate-600 ring-slate-500/10'
  }
}

/* ============================================================
   FILTER BADGE
============================================================ */

function FilterBadge({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm">

      <span className="max-w-[260px] truncate">
        {label}
      </span>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <X size={12} />
      </button>

    </span>
  )
}

/* ============================================================
   SECTION
============================================================ */

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

        {eyebrow && (
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A98B4F]">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-slate-950">
          {title}
        </h2>

        {description && (
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}

      </div>

      <div className="p-5 sm:p-6">
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
          Preparing secure media workspace
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying access and loading the media library...
        </p>

      </div>
    </div>
  )
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  filtered,
  onUpload,
  onClear,
  uploading,
}: {
  filtered: boolean
  onUpload: () => void
  onClear: () => void
  uploading: boolean
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#0A0C0B]">

        <img
          src="/images/logo-bmi.png"
          alt="Barack Mining Investment"
          className="max-h-8 max-w-[40px] object-contain brightness-0 invert"
        />

      </div>

      <h3 className="mt-5 text-base font-semibold text-slate-950">
        {filtered
          ? 'No matching media'
          : 'Media library is empty'}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? 'No media item matches your current search or filters.'
          : 'Upload images, videos or supported documents directly into the Media workspace.'}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">

        {filtered && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X size={14} />
            Clear filters
          </button>
        )}

        {!filtered && (
          <button
            type="button"
            onClick={onUpload}
            disabled={uploading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={15} />
            Upload Files
          </button>
        )}

      </div>
    </div>
  )
}

/* ============================================================
   MEDIA CARD
============================================================ */

function MediaCard({
  item,
  onOpen,
  onDelete,
}: {
  item: MediaItem
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_15px_40px_rgba(15,23,42,0.07)]">

      {/* Preview */}

      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-square w-full overflow-hidden bg-slate-100 text-left"
      >

        {item.type ===
        'image' ? (
          <img
            src={item.url}
            alt={
              item.alt_text ||
              item.filename
            }
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : item.type ===
          'video' ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 text-white">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Video size={24} />
            </div>

            <p className="mt-3 text-xs font-semibold">
              Video
            </p>

            <p className="mt-1 max-w-[180px] truncate text-[10px] text-white/40">
              {item.filename}
            </p>

          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 text-slate-500">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <File size={24} />
            </div>

            <p className="mt-3 text-xs font-semibold">
              Document
            </p>

            <p className="mt-1 max-w-[180px] truncate text-[10px] text-slate-400">
              {item.filename}
            </p>

          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

      </button>

      {/* Information */}

      <div className="p-4">

        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left"
        >

          <p className="truncate text-sm font-semibold text-slate-950">
            {item.filename}
          </p>

          <p className="mt-1 truncate text-[10px] text-slate-400">
            {item.url}
          </p>

        </button>

        <div className="mt-3 flex flex-wrap gap-2">

          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${getTypeClass(
              item.type
            )}`}
          >
            {TYPE_LABELS[item.type]}
          </span>

          <span className="inline-flex rounded-full bg-[#F3EFE7] px-2.5 py-1 text-[10px] font-semibold text-[#94713F]">
            {CATEGORY_LABELS[item.category]}
          </span>

        </div>

        <p className="mt-3 text-[10px] text-slate-400">
          Uploaded {formatDate(item.created_at)}
        </p>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">

          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit
            <ArrowRight size={13} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${item.filename}`}
          >
            <Trash2 size={14} />
          </button>

        </div>
      </div>
    </article>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function MediaPage() {
  const router =
    useRouter()

  const supabase =
    createClient()

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    )

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

  const [media, setMedia] =
    useState<MediaItem[]>([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  /* ----------------------------------------------------------
     UPLOAD
  ---------------------------------------------------------- */

  const [uploading, setUploading] =
    useState(false)

  const [uploadProgress, setUploadProgress] =
    useState(
      {
        current: 0,
        total: 0,
      }
    )

  /* ----------------------------------------------------------
     SEARCH / FILTERS
  ---------------------------------------------------------- */

  const [search, setSearch] =
    useState('')

  const [categoryFilter, setCategoryFilter] =
    useState<string>('all')

  const [typeFilter, setTypeFilter] =
    useState<string>('all')

  const [showFilters, setShowFilters] =
    useState(false)

  /* ----------------------------------------------------------
     FEEDBACK
  ---------------------------------------------------------- */

  const [error, setError] =
    useState<string | null>(
      null
    )

  const [successMessage, setSuccessMessage] =
    useState<string | null>(
      null
    )

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
     LOAD MEDIA
  ========================================================== */

  const loadMedia =
    useCallback(
      async (
        isRefresh = false
      ) => {
        if (!authorized) {
          return
        }

        if (isRefresh) {
          setRefreshing(
            true
          )
        } else {
          setLoading(
            true
          )
        }

        setError(
          null
        )

        try {
          let query =
            supabase
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
              .order(
                'created_at',
                {
                  ascending:
                    false,
                }
              )

          if (
            categoryFilter !==
            'all'
          ) {
            query =
              query.eq(
                'category',
                categoryFilter
              )
          }

          if (
            typeFilter !==
            'all'
          ) {
            query =
              query.eq(
                'type',
                typeFilter
              )
          }

          const {
            data,
            error: queryError,
          } =
            await query

          if (queryError) {
            console.error(
              'Media query error:',
              queryError
            )

            setMedia(
              []
            )

            setError(
              'Unable to load media. Please check your permissions and try again.'
            )

            return
          }

          setMedia(
            (data as MediaItem[]) ??
              []
          )
        } catch (
          requestError
        ) {
          console.error(
            'Media request error:',
            requestError
          )

          setMedia(
            []
          )

          setError(
            'An unexpected error occurred while loading the media library.'
          )
        } finally {
          setLoading(
            false
          )

          setRefreshing(
            false
          )
        }
      },
      [
        authorized,
        categoryFilter,
        supabase,
        typeFilter,
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
     LOCAL SEARCH
  ========================================================== */

  const filteredMedia =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase()

        if (!term) {
          return media
        }

        return media.filter(
          (
            item
          ) =>
            item.filename
              .toLowerCase()
              .includes(
                term
              ) ||
            item.url
              .toLowerCase()
              .includes(
                term
              ) ||
            CATEGORY_LABELS[
              item.category
            ]
              .toLowerCase()
              .includes(
                term
              ) ||
            TYPE_LABELS[
              item.type
            ]
              .toLowerCase()
              .includes(
                term
              ) ||
            item.alt_text
              ?.toLowerCase()
              .includes(
                term
              ) ||
            item.caption
              ?.toLowerCase()
              .includes(
                term
              )
        )
      },
      [
        media,
        search,
      ]
    )

  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts =
    useMemo(
      () => ({
        total:
          media.length,

        images:
          media.filter(
            (item) =>
              item.type ===
              'image'
          ).length,

        videos:
          media.filter(
            (item) =>
              item.type ===
              'video'
          ).length,

        documents:
          media.filter(
            (item) =>
              item.type ===
              'document'
          ).length,
      }),
      [media]
    )

  /* ==========================================================
     FILTERS
  ========================================================== */

  const hasActiveFilters =
    categoryFilter !==
      'all' ||
    typeFilter !==
      'all' ||
    search.trim() !== ''

  const clearFilters =
    () => {
      setCategoryFilter(
        'all'
      )

      setTypeFilter(
        'all'
      )

      setSearch('')
    }

  /* ==========================================================
     OPEN FILE PICKER
  ========================================================== */

  const openFilePicker =
    () => {
      if (uploading) {
        return
      }

      fileInputRef.current?.click()
    }

  /* ==========================================================
     UPLOAD
  ========================================================== */

  const handleUpload =
    async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files =
        event.target.files

      if (
        !files ||
        files.length === 0
      ) {
        return
      }

      if (!authorized) {
        setError(
          'Your current account is not authorized to upload media.'
        )

        event.target.value =
          ''

        return
      }

      setUploading(
        true
      )

      setError(
        null
      )

      setSuccessMessage(
        null
      )

      const selectedFiles =
        Array.from(
          files
        )

      setUploadProgress({
        current: 0,
        total:
          selectedFiles.length,
      })

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
            'Your current account is not authorized to upload media.'
          )
        }

        let uploadedCount =
          0

        let failedCount =
          0

        const failedMessages:
          string[] = []

        for (
          let index = 0;
          index <
          selectedFiles.length;
          index++
        ) {
          const file =
            selectedFiles[index]

          setUploadProgress({
            current:
              index + 1,
            total:
              selectedFiles.length,
          })

          const validationError =
            validateFile(
              file
            )

          if (
            validationError
          ) {
            failedCount++

            failedMessages.push(
              validationError
            )

            continue
          }

          const mediaType =
            detectMediaType(
              file.type
            )

          const filePath =
            createStoragePath(
              file.name
            )

          /* --------------------------------------------------
             Storage upload
          -------------------------------------------------- */

          const {
            error: uploadError,
          } =
            await supabase.storage
              .from(
                BUCKET_NAME
              )
              .upload(
                filePath,
                file,
                {
                  cacheControl:
                    '3600',
                  upsert:
                    false,
                  contentType:
                    file.type ||
                    undefined,
                }
              )

          if (
            uploadError
          ) {
            console.error(
              'Storage upload error:',
              uploadError
            )

            failedCount++

            failedMessages.push(
              `Unable to upload "${file.name}".`
            )

            continue
          }

          /* --------------------------------------------------
             Public URL generated by Supabase Storage
          -------------------------------------------------- */

          const {
            data:
              publicUrlData,
          } =
            supabase.storage
              .from(
                BUCKET_NAME
              )
              .getPublicUrl(
                filePath
              )

          const publicUrl =
            publicUrlData.publicUrl

          /* --------------------------------------------------
             Database record
          -------------------------------------------------- */

          const {
            error: insertError,
          } =
            await supabase
              .from(
                'media'
              )
              .insert({
                filename:
                  file.name,
                url:
                  publicUrl,
                type:
                  mediaType,
                category:
                  'corporate',
                alt_text:
                  null,
                caption:
                  null,
                uploaded_by:
                  user.id,
              })

          if (
            insertError
          ) {
            console.error(
              'Media database insert error:',
              insertError
            )

            /*
             * Prevent an orphaned Storage object
             * when the metadata insert fails.
             */
            const {
              error:
                cleanupError,
            } =
              await supabase.storage
                .from(
                  BUCKET_NAME
                )
                .remove([
                  filePath,
                ])

            if (
              cleanupError
            ) {
              console.error(
                'Storage cleanup error:',
                cleanupError
              )
            }

            failedCount++

            failedMessages.push(
              `Unable to register "${file.name}" in the media library.`
            )

            continue
          }

          uploadedCount++
        }

        await loadMedia(
          true
        )

        if (
          uploadedCount >
            0 &&
          failedCount === 0
        ) {
          setSuccessMessage(
            `${uploadedCount} file${uploadedCount === 1 ? '' : 's'} uploaded successfully.`
          )
        } else if (
          uploadedCount >
          0
        ) {
          setSuccessMessage(
            `${uploadedCount} file${uploadedCount === 1 ? '' : 's'} uploaded successfully. ${failedCount} could not be processed.`
          )

          setError(
            failedMessages.join(
              ' '
            )
          )
        } else {
          setError(
            failedMessages.length
              ? failedMessages.join(
                  ' '
                )
              : 'No file could be uploaded.'
          )
        }
      } catch (
        uploadRequestError
      ) {
        console.error(
          'Media upload failed:',
          uploadRequestError
        )

        setError(
          uploadRequestError instanceof
          Error
            ? uploadRequestError.message
            : 'Unable to upload the selected files.'
        )
      } finally {
        setUploading(
          false
        )

        setUploadProgress({
          current: 0,
          total: 0,
        })

        event.target.value =
          ''
      }
    }

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete =
    async (
      id: string
    ) => {
      const item =
        media.find(
          (
            mediaItem
          ) =>
            mediaItem.id ===
            id
        )

      if (!item) {
        return
      }

      const confirmed =
        window.confirm(
          `Delete "${item.filename}"?\n\nThe media record and its Storage file will be removed. This action cannot be undone.`
        )

      if (!confirmed) {
        return
      }

      setError(
        null
      )

      setSuccessMessage(
        null
      )

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
           Extract Storage path safely
           from the existing public URL.
        ---------------------------------------------------- */

        let storagePath:
          | string
          | null =
          null

        try {
          const url =
            new URL(
              item.url
            )

          const marker =
            `/storage/v1/object/public/${BUCKET_NAME}/`

          const markerIndex =
            url.pathname.indexOf(
              marker
            )

          if (
            markerIndex !== -1
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
            'Unable to determine media storage path:',
            pathError
          )
        }

        /* ----------------------------------------------------
           Remove Storage object first
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
              'Unable to remove the media file from Storage.'
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
            .from(
              'media'
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
            'Media database deletion error:',
            deleteError
          )

          throw new Error(
            deleteError.message ||
              'Unable to remove the media record.'
          )
        }

        setMedia(
          (
            current
          ) =>
            current.filter(
              (
                mediaItem
              ) =>
                mediaItem.id !==
                id
            )
        )

        setSuccessMessage(
          `"${item.filename}" was deleted successfully.`
        )
      } catch (
        deleteRequestError
      ) {
        console.error(
          'Media deletion failed:',
          deleteRequestError
        )

        setError(
          deleteRequestError instanceof
          Error
            ? deleteRequestError.message
            : 'Unable to delete this media file.'
        )
      }
    }

  /* ==========================================================
     LOADING / ACCESS
  ========================================================== */

  if (
    checkingAccess
  ) {
    return (
      <LoadingState />
    )
  }

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
     MAIN
  ========================================================== */

  return (
    <div className="space-y-6 pb-10">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin'
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

          <span className="text-xs font-semibold text-slate-700">
            Media
          </span>

        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

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
                  Media
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected workspace
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                Media Library
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage the visual and document assets used across the Barack Mining Investment website.
              </p>

            </div>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                loadMedia(
                  true
                )
              }
              disabled={
                refreshing ||
                uploading
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={
                openFilePicker
              }
              disabled={
                uploading
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                  Uploading
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Files
                </>
              )}
            </button>

          </div>
        </div>
      </section>

      {/* Hidden file input */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        multiple
        onChange={
          handleUpload
        }
        className="hidden"
        disabled={uploading}
      />

      {/* ======================================================
          UPLOAD STATUS
      ====================================================== */}

      {uploading && (
        <section className="rounded-[22px] border border-[#D8C9AA] bg-[#FBF8F1] px-5 py-4">

          <div className="flex items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#94713F] shadow-sm">
                <Upload size={16} />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-semibold text-slate-800">
                  Uploading media files
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  {
                    uploadProgress.current
                  } of{' '}
                  {
                    uploadProgress.total
                  } file
                  {uploadProgress.total ===
                  1
                    ? ''
                    : 's'}{' '}
                  processed
                </p>

              </div>
            </div>

            <span className="text-xs font-semibold text-slate-700">
              {uploadProgress.total >
              0
                ? Math.round(
                    (uploadProgress.current /
                      uploadProgress.total) *
                      100
                  )
                : 0}
              %
            </span>

          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E8DFD0]">

            <div
              className="h-full rounded-full bg-[#A98B4F] transition-all duration-300"
              style={{
                width: `${
                  uploadProgress.total >
                  0
                    ? Math.round(
                        (uploadProgress.current /
                          uploadProgress.total) *
                          100
                      )
                    : 0
                }%`,
              }}
            />

          </div>
        </section>
      )}

      {/* ======================================================
          FEEDBACK
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
            <AlertCircle size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              Media operation failed
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

      {successMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
            <CheckCircle2 size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-emerald-800">
              Media operation completed
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              {successMessage}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setSuccessMessage(
                null
              )
            }
            className="rounded-lg p-1 text-emerald-400 transition hover:bg-emerald-100 hover:text-emerald-700"
            aria-label="Dismiss success message"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <button
          type="button"
          onClick={
            clearFilters
          }
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Total
            </span>

            <ImageIcon
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.total}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            All media assets
          </p>

        </button>

        <button
          type="button"
          onClick={() => {
            setTypeFilter(
              'image'
            )
            setCategoryFilter(
              'all'
            )
            setSearch('')
          }}
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Images
            </span>

            <ImageIcon
              size={16}
              className="text-emerald-500"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.images}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Visual assets
          </p>

        </button>

        <button
          type="button"
          onClick={() => {
            setTypeFilter(
              'video'
            )
            setCategoryFilter(
              'all'
            )
            setSearch('')
          }}
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Videos
            </span>

            <Video
              size={16}
              className="text-blue-500"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.videos}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Video assets
          </p>

        </button>

        <button
          type="button"
          onClick={() => {
            setTypeFilter(
              'document'
            )
            setCategoryFilter(
              'all'
            )
            setSearch('')
          }}
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Documents
            </span>

            <File
              size={16}
              className="text-amber-500"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.documents}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Document assets
          </p>

        </button>

      </section>

      {/* ======================================================
          SEARCH / FILTERS
      ====================================================== */}

      <Section
        eyebrow="Library"
        title="Media register"
        description="Search the library by file name, category, type or existing media metadata."
      >

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          <div className="relative flex-1">

            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search files, category or type..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (
                    value
                  ) =>
                    !value
                )
              }
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-semibold transition ${
                showFilters ||
                hasActiveFilters
                  ? 'border-slate-900 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >

              Filters

              {hasActiveFilters && (
                <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px]">
                  {
                    [
                      categoryFilter !==
                        'all',
                      typeFilter !==
                        'all',
                      Boolean(
                        search.trim()
                      ),
                    ].filter(
                      Boolean
                    ).length
                  }
                </span>
              )}

              <ChevronDown
                size={14}
                className={
                  showFilters
                    ? 'rotate-180 transition-transform'
                    : 'transition-transform'
                }
              />

            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={14} />
                Clear
              </button>
            )}

          </div>
        </div>

        {showFilters && (
          <div className="mt-4 border-t border-slate-100 pt-4">

            <div className="grid gap-4 md:grid-cols-2">

              <div>

                <label
                  htmlFor="media-category-filter"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  Category
                </label>

                <select
                  id="media-category-filter"
                  value={
                    categoryFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setCategoryFilter(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                >

                  <option value="all">
                    All categories
                  </option>

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

              </div>

              <div>

                <label
                  htmlFor="media-type-filter"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  Type
                </label>

                <select
                  id="media-type-filter"
                  value={
                    typeFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setTypeFilter(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                >

                  <option value="all">
                    All types
                  </option>

                  {TYPE_OPTIONS.map(
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

              </div>

            </div>
          </div>
        )}

      </Section>

      {/* ======================================================
          ACTIVE FILTERS
      ====================================================== */}

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">

          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Active filters
          </span>

          {categoryFilter !==
            'all' && (
            <FilterBadge
              label={`Category: ${
                CATEGORY_LABELS[
                  categoryFilter as MediaCategory
                ]
              }`}
              onRemove={() =>
                setCategoryFilter(
                  'all'
                )
              }
            />
          )}

          {typeFilter !==
            'all' && (
            <FilterBadge
              label={`Type: ${
                TYPE_LABELS[
                  typeFilter as MediaType
                ]
              }`}
              onRemove={() =>
                setTypeFilter(
                  'all'
                )
              }
            />
          )}

          {search.trim() && (
            <FilterBadge
              label={`Search: "${search.trim()}"`}
              onRemove={() =>
                setSearch('')
              }
            />
          )}

        </div>
      )}

      {/* ======================================================
          RESULT HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

        <div>

          <p className="text-sm font-semibold text-slate-900">
            {
              filteredMedia.length
            }{' '}
            {filteredMedia.length ===
            1
              ? 'file'
              : 'files'}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {hasActiveFilters
              ? 'Matching your current criteria'
              : 'Complete media register'}
          </p>

        </div>

        <p className="text-xs text-slate-400">
          Storage bucket:{' '}
          <span className="font-semibold text-slate-600">
            {BUCKET_NAME}
          </span>
        </p>

      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      {loading ? (
        <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="flex flex-col items-center justify-center px-5 py-10">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A0C0B]">

              <img
                src="/images/logo-bmi.png"
                alt="Barack Mining Investment"
                className="max-h-7 max-w-[35px] object-contain brightness-0 invert"
              />

            </div>

            <div className="mt-4 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            <p className="mt-3 text-xs font-semibold text-slate-700">
              Loading media library
            </p>

          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {Array.from({
              length: 8,
            }).map(
              (_, index) => (
                <div
                  key={
                    index
                  }
                  className="overflow-hidden rounded-[22px] border border-slate-100"
                >

                  <div className="aspect-square animate-pulse bg-slate-100" />

                  <div className="space-y-3 p-4">

                    <div className="h-4 animate-pulse rounded bg-slate-100" />

                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />

                    <div className="h-8 animate-pulse rounded-xl bg-slate-100" />

                  </div>
                </div>
              )
            )}

          </div>
        </div>
      ) : filteredMedia.length ===
        0 ? (
        <EmptyState
          filtered={
            hasActiveFilters
          }
          onUpload={
            openFilePicker
          }
          onClear={
            clearFilters
          }
          uploading={
            uploading
          }
        />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filteredMedia.map(
            (
              item
            ) => (
              <MediaCard
                key={
                  item.id
                }
                item={
                  item
                }
                onOpen={() =>
                  router.push(
                    `/admin/media/${item.id}`
                  )
                }
                onDelete={() =>
                  handleDelete(
                    item.id
                  )
                }
              />
            )
          )}

        </section>
      )}

      {/* ======================================================
          SECURITY
      ====================================================== */}

      <section className="flex flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck size={16} />
          </div>

          <div>

            <p className="text-xs font-semibold text-slate-800">
              Protected media workspace
            </p>

            <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
              Media access and mutations are controlled by authenticated roles, Storage policies and Supabase RLS.
            </p>

          </div>
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {profile?.role
            ? profile.role.replace(
                /_/g,
                ' '
              )
            : 'restricted'}
        </span>

      </section>

      {/* ======================================================
          BOTTOM NAVIGATION
      ====================================================== */}

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft size={14} />
          Previous page
        </button>

        <button
          type="button"
          onClick={
            openFilePicker
          }
          disabled={
            uploading
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          Upload Files
        </button>

      </div>

    </div>
  )
}